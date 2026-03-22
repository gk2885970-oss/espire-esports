import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAICoachAdvice = async (req: any, res: any) => {
  const { message, userStats } = req.body;

  const prompt = `
    You are an elite Esports Coach for competitive games like BGMI, Free Fire, and Valorant.
    Always be concise, professional, and motivational like a real team coach.

    Analyze this player:
    Stats: ${JSON.stringify(userStats || {})}
    Message: "${message}"

    Provide:
    1. One specific weak skill to target.
    2. A 15-minute training routine.
    3. A pro tip for their specific game.

    Keep response friendly and under 150 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",   //  Real model
      contents: [{ parts: [{ text: prompt }] }],
    });

    //  Correct way to get text
    const advice = response.candidates?.[0]?.content?.parts?.[0]?.text
      || "Focus on your positioning and game sense today!";

    res.json({ advice });
  } catch (error) {
    console.error("AI Coach Error:", error);
    res.status(500).json({ error: "Coach is currently unavailable." });
  }
};