import db from '../database.js';

export const getUserProfile = (req: any, res: any) => {
  const { userId } = req.params;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const gamingIds = db.prepare('SELECT * FROM gaming_ids WHERE user_id = ?').all(userId);
  const achievements = db.prepare('SELECT * FROM achievements WHERE user_id = ?').all(userId);

  res.json({
    ...user,
    gamingIds,
    achievements
  });
};

export const updateGamingId = (req: any, res: any) => {
  const { userId } = req.params;
  const { game_name, player_id, rank } = req.body;

  const existing = db.prepare('SELECT * FROM gaming_ids WHERE user_id = ? AND game_name = ?').get(userId, game_name);
  if (existing) {
    db.prepare('UPDATE gaming_ids SET player_id = ?, rank = ? WHERE user_id = ? AND game_name = ?')
      .run(player_id, rank, userId, game_name);
  } else {
    db.prepare('INSERT INTO gaming_ids (user_id, game_name, player_id, rank) VALUES (?, ?, ?, ?)')
      .run(userId, game_name, player_id, rank);
  }

  res.json({ success: true });
};
