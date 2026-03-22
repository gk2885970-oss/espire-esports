import db from '../database.js';

export const getAchievements = (req: any, res: any) => {
  const { userId } = req.params;
  const achievements = db.prepare('SELECT * FROM achievements WHERE user_id = ?').all(userId);
  res.json(achievements);
};

export const updateAchievementProgress = (req: any, res: any) => {
  const { userId, achievementId, progress } = req.body;
  
  const achievement = db.prepare('SELECT * FROM achievements WHERE id = ? AND user_id = ?').get(achievementId, userId) as any;
  if (!achievement) return res.status(404).json({ error: 'Achievement not found' });

  const newProgress = Math.min(achievement.unlock_condition, achievement.progress + progress);
  const unlocked = newProgress >= achievement.unlock_condition ? 1 : 0;
  const unlockedAt = (unlocked && !achievement.unlocked) ? new Date().toISOString() : achievement.unlocked_at;

  db.prepare(`
    UPDATE achievements 
    SET progress = ?, unlocked = ?, unlocked_at = ?
    WHERE id = ? AND user_id = ?
  `).run(newProgress, unlocked, unlockedAt, achievementId, userId);

  res.json({ success: true, unlocked: unlocked === 1 });
};
