import db from '../database.js';
import { GoogleGenAI } from "@google/genai";

// Initialize AI for background processing
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const trackMatch = async (req: any, res: any) => {
  const { userId, kills, placement, damage, game } = req.body;
  const matchId = `m_${Date.now()}`;
  
  const isWin = placement === 1;
  const placementPoints = Math.max(0, 10 - Math.floor(placement / 2));
  const points = (isWin ? 5 : 0) + (kills * 2) + placementPoints;

  let newRating = 0;
  let newRank = 'Beginner';
  let user: any = null;

  // 1. Solid Transactional Execution (Tumhara original solid logic)
  db.transaction(() => {
    db.prepare(`
      INSERT INTO matches (id, player_id, kills, placement, damage, game, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(matchId, userId, kills, placement, damage, game, points);

    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    
    const newTotalKills = user.total_kills + kills;
    const newTotalPoints = user.total_points + points;
    const newBooyahs = user.booyahs + (isWin ? 1 : 0);
    const newTop3 = user.top3 + (placement <= 3 ? 1 : 0);
    const newTournamentsPlayed = user.tournaments_played + 1;
    const newAvgPoints = Number((newTotalPoints / newTournamentsPlayed).toFixed(1));
    
    // Core Base Rating
    newRating = Math.min(100, Math.floor((newTotalPoints * 0.4) + (newTotalKills * 0.2) + (newBooyahs * 5) + (newTop3 * 2)));
    
    if (newRating > 80) newRank = 'Elite Pro';
    else if (newRating > 60) newRank = 'Elite';
    else if (newRating > 40) newRank = 'Pro';
    else if (newRating > 20) newRank = 'Amateur';

    db.prepare(`
      UPDATE users SET 
        total_kills = ?, total_points = ?, booyahs = ?, top3 = ?, 
        tournaments_played = ?, avg_points = ?, ai_rating = ?, ai_rank = ?
      WHERE id = ?
    `).run(newTotalKills, newTotalPoints, newBooyahs, newTop3, newTournamentsPlayed, newAvgPoints, newRating, newRank, userId);
  })();

  // 2. The YC "Aha" Moment: Agentic Background Processing
  // Response turant bhej do taaki app fast lage (Cost collapse)
  res.json({ 
    success: true, 
    points, 
    matchId, 
    ratingChange: { old: user.ai_rating, new: newRating, rank: newRank }
  });

  // 3. AI Asynchronous Post-Match Analysis (No user waiting required)
  try {
    const prompt = `
      You are the Espire Esports AI Coach.
      Player "${user.display_name}" just finished a ${game} match.
      Performance: Kills: ${kills}, Placement: ${placement}, Damage: ${damage}.
      Their new overall AI Rating is ${newRating} (${newRank}).
      
      Give a 1-sentence actionable coaching advice based strictly on THIS match's damage-to-kills ratio or placement.
    `;
    
    ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }],
    }).then(response => {
      const insight = response.candidates?.[0]?.content?.parts?.[0]?.text;
      
      // Store this insight in the database so it appears on their Dashboard!
      // db.prepare('UPDATE users SET last_ai_insight = ? WHERE id = ?').run(insight, userId);
      console.log(`[AI Agent] Generated insight for ${user.display_name}: ${insight}`);
    });

  } catch (err) {
    console.error("AI Post-Match Agent failed, skipping...", err);
  }
};

export const getPlayerMatches = (req: any, res: any) => {
  const { userId } = req.params;
  const matches = db.prepare('SELECT * FROM matches WHERE player_id = ? ORDER BY created_at DESC').all(userId);
  res.json(matches);
};
