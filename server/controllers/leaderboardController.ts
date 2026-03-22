import db from '../database.js';

export const getLeaderboard = (req: any, res: any) => {
  const leaderboard = db.prepare(`
    SELECT id, display_name, ai_rating, tournaments_won, total_kills, tournaments_played
    FROM users
    ORDER BY ai_rating DESC
    LIMIT 100
  `).all();
  res.json(leaderboard);
};
