import db from '../database.js';

export const getLeaderboard = (req: any, res: any) => {
  const { game, scoutMode } = req.query;

  // 1. Fundamental Rethink: Leaderboard is now a Scouting Engine
  // Humein sirf ai_rating nahi, balki 'momentum' aur 'consistency' bhi calculate karni hai
  let query = `
    SELECT 
      id, 
      display_name, 
      ai_rating, 
      ai_rank,
      tournaments_won, 
      total_kills, 
      tournaments_played,
      -- AI Logic: Calculating momentum (Kills per tournament)
      ROUND(CAST(total_kills AS REAL) / CASE WHEN tournaments_played = 0 THEN 1 ELSE tournaments_played END, 2) as lethality_index,
      -- Predictive Moat: Probability of being picked by a Pro Team
      CASE 
        WHEN ai_rating > 90 THEN '95% (Global Scout Interest)'
        WHEN ai_rating > 80 THEN '75% (Regional Scout Interest)'
        ELSE 'Developing'
      END as scout_potential
    FROM users
    WHERE role = 'player'
  `;

  // 2. Unbundling the Filter: Dynamic Query based on Scout Mode
  if (game && game !== 'All') {
    // Yahan hum gaming_ids table ko join kar sakte hain specific game rankings ke liye
    query += ` AND id IN (SELECT user_id FROM gaming_ids WHERE game_name = ?) `;
  }

  // Ordering by AI Rating as the primary source of truth
  query += ` ORDER BY ai_rating DESC LIMIT 100`;

  try {
    const stmt = db.prepare(query);
    const leaderboard = game && game !== 'All' ? stmt.all(game) : stmt.all();

    // 3. The "Aha" Moment: Adding AI metadata to the response
    // Ye frontend ko batayega ki ye rankings kyu aisi hain
    const enrichedLeaderboard = leaderboard.map((player: any, index: number) => ({
      ...player,
      global_rank: index + 1,
      trend: index < 5 ? 'rising' : 'stable', // Simple logic for demo
      ai_insight: `${player.display_name} has a lethality index of ${player.lethality_index}. Highly recommended for ${player.ai_rank} tier scrims.`
    }));

    res.json(enrichedLeaderboard);
  } catch (error) {
    console.error("Leaderboard Engine Error:", error);
    res.status(500).json({ error: "Scouting engine is updating..." });
  }
};
