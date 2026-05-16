import { GoogleGenAI } from "@google/genai";
import db from "../database.js"; // Apna better-sqlite3 yahan import karo

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAICoachAdvice = async (req, res) => {
  const { message, userId } = req.body;

  // 1. AI ko tumhara Database Schema sikhana (The Brain)
  const systemPrompt = `
    You are the Core AI Engine and Esports Coach for Espire Esports.
    Here is our SQLite database schema:
    - users(id, display_name, ai_rating, ai_rank, total_kills, balance)
    - matches(id, player_id, kills, placement, damage, game, points)
    - tournaments(id, title, game, prize_pool, status)

    User Request: "${message}"
    Current User ID: "${userId}"

    Task:
    1. If the user asks for stats, comparisons, or history, write a strictly safe SQLite 'SELECT' query.
    2. Provide a 1-line pro esports coach advice based on their query.
    
    Return ONLY a valid JSON object. No markdown tags, no extra text. Format:
    {
      "sql_query": "SELECT ...", // Leave empty string "" if no DB query is needed
      "coach_advice": "Your motivating pro tip here."
    }
  `;

  try {
    // Step 1: AI se SQL aur Advice dono generate karwao
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: systemPrompt }] }],
    });

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    // Clean up JSON parsing (incase AI adds markdown formatting)
    const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiDecision = JSON.parse(cleanJsonStr);

    let dbData = null;

    // Step 2: Safe Execution - Agar AI ne SQL likhi hai, toh use DB me run karo
    // Security check: Sirf SELECT query allow karenge taaki koi data delete na kar sake
    if (aiDecision.sql_query && aiDecision.sql_query.toUpperCase().startsWith("SELECT")) {
      dbData = db.prepare(aiDecision.sql_query).all();
    }

    // Step 3: Frontend ko AI ki advice aur Recharts ke liye raw data bhej do
    res.json({ 
      advice: aiDecision.coach_advice,
      graphData: dbData, // Ye seedha tumhare Recharts ko data feed karega!
      queryRun: aiDecision.sql_query 
    });

  } catch (error) {
    console.error("AI Core Error:", error);
    res.status(500).json({ error: "System overload. The Coach is resting." });
  }
};
