import { GoogleGenAI, Type } from "@google/genai";
import { SkillStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAICoachAdvice = async (userStats: any, recentPerformance: any) => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `
    As an expert Esports Coach for games like BGMI, Free Fire, and Valorant, analyze the following player data:
    Stats: ${JSON.stringify(userStats)}
    Recent Performance: ${JSON.stringify(recentPerformance)}
    
    Provide actionable, concise advice to help them improve. Focus on:
    1. One specific weak skill to work on.
    2. A suggested 15-minute training routine.
    3. A professional tip for their favorite game.
    
    Format the response as a friendly, motivational message.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("AI Coach Error:", error);
    return "Keep grinding! Focus on your aim today and watch your replays to spot positioning errors.";
  }
};

export const analyzeGameplayScreenshot = async (base64Image: string): Promise<{ analysis: string; skills: SkillStats }> => {
  const model = "gemini-3.1-pro-preview";
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      analysis: { type: Type.STRING, description: "Detailed analysis of the gameplay screenshot" },
      skills: {
        type: Type.OBJECT,
        properties: {
          aim: { type: Type.NUMBER },
          gameSense: { type: Type.NUMBER },
          strategy: { type: Type.NUMBER },
          teamwork: { type: Type.NUMBER },
          reactionSpeed: { type: Type.NUMBER }
        },
        required: ["aim", "gameSense", "strategy", "teamwork", "reactionSpeed"]
      }
    },
    required: ["analysis", "skills"]
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: "Analyze this gameplay screenshot. Identify the game, current situation, and evaluate the player's performance based on visible stats (kills, deaths, position, equipment). Provide a skill breakdown from 0-100." },
            { inlineData: { mimeType: "image/png", data: base64Image.split(',')[1] || base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      analysis: "Could not analyze the image. Please ensure it's a clear screenshot of your match results or gameplay.",
      skills: { aim: 50, gameSense: 50, strategy: 50, teamwork: 50, reactionSpeed: 50 }
    };
  }
};

export const getTrainingRecommendations = async (stats: any): Promise<any[]> => {
  const model = "gemini-3.1-pro-preview";
  const prompt = `
    Based on these player stats: ${JSON.stringify(stats)}, recommend 3 specific training modules. 
    Return a JSON array of objects with: id, title, reason, difficulty (beginner, intermediate, advanced), duration, category (aim, game-sense, strategy, teamwork).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return [
      { id: 'rec1', title: 'Close Range Tracking', reason: 'Your close-range win rate is below average.', difficulty: 'intermediate', duration: '15m', category: 'aim' },
      { id: 'rec2', title: 'Zone Prediction 101', reason: 'You often get caught outside the play zone.', difficulty: 'beginner', duration: '10m', category: 'strategy' },
      { id: 'rec3', title: 'Utility Masterclass', reason: 'Low grenade usage in recent matches.', difficulty: 'advanced', duration: '20m', category: 'game-sense' }
    ];
  }
};

export const chatWithCoach = async (message: string, history: any[]) => {
  const model = "gemini-3.1-pro-preview";
  
  // Convert history to Gemini format
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [...contents, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: "You are an expert Esports Coach for games like BGMI, Free Fire, and Valorant. Your name is Coach Espire. You provide tactical advice, training routines, and motivational support. Keep your responses concise, professional, and actionable. Use gaming terminology correctly.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting right now. Keep practicing your aim and I'll be back soon!";
  }
};
