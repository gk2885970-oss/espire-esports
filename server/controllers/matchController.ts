import db from '../database.js';

export const trackMatch = (req: any, res: any) => {
  const { userId, kills, placement, damage, game } = req.body;
  const matchId = `m_${Date.now()}`;
  
  // Rating calculation: rating = (wins × 5) + (kills × 2) + placement_points
  // Let's assume placement_points = (100 - placement) / 10
  const isWin = placement === 1;
  const placementPoints = Math.max(0, 10 - Math.floor(placement / 2));
  const points = (isWin ? 5 : 0) + (kills * 2) + placementPoints;

  db.transaction(() => {
    db.prepare(`
      INSERT INTO matches (id, player_id, kills, placement, damage, game, points)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(matchId, userId, kills, placement, damage, game, points);

    // Update user stats
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
    const newTotalKills = user.total_kills + kills;
    const newTotalPoints = user.total_points + points;
    const newBooyahs = user.booyahs + (isWin ? 1 : 0);
    const newTop3 = user.top3 + (placement <= 3 ? 1 : 0);
    const newTournamentsPlayed = user.tournaments_played + 1;
    const newAvgPoints = Number((newTotalPoints / newTournamentsPlayed).toFixed(1));
    
    // AI Rating calculation
    const newRating = Math.min(100, Math.floor((newTotalPoints * 0.4) + (newTotalKills * 0.2) + (newBooyahs * 5) + (newTop3 * 2)));
    
    let newRank = 'Beginner';
    if (newRating > 80) newRank = 'Elite Pro';
    else if (newRating > 60) newRank = 'Elite';
    else if (newRating > 40) newRank = 'Pro';
    else if (newRating > 20) newRank = 'Amateur';

    db.prepare(`
      UPDATE users SET 
        total_kills = ?, 
        total_points = ?, 
        booyahs = ?, 
        top3 = ?, 
        tournaments_played = ?, 
        avg_points = ?,
        ai_rating = ?,
        ai_rank = ?
      WHERE id = ?
    `).run(newTotalKills, newTotalPoints, newBooyahs, newTop3, newTournamentsPlayed, newAvgPoints, newRating, newRank, userId);
  })();

  res.json({ success: true, points, matchId });
};

export const getPlayerMatches = (req: any, res: any) => {
  const { userId } = req.params;
  const matches = db.prepare('SELECT * FROM matches WHERE player_id = ? ORDER BY created_at DESC').all(userId);
  res.json(matches);
};
