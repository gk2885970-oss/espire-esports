import db from '../database.js';

export const getTournaments = (req: any, res: any) => {
  const tournaments = db.prepare('SELECT * FROM tournaments').all();
  res.json(tournaments);
};

export const getTournamentById = (req: any, res: any) => {
  const { id } = req.params;
  const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id);
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
  res.json(tournament);
};

export const joinTournament = (req: any, res: any) => {
  const { id } = req.params;
  const { userId } = req.body;

  const tournament = db.prepare('SELECT * FROM tournaments WHERE id = ?').get(id) as any;
  if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

  if (tournament.players_joined >= tournament.max_players) {
    return res.status(400).json({ error: 'Tournament is full' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (user.balance < tournament.entry_fee) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  try {
    db.transaction(() => {
      db.prepare('INSERT INTO tournament_players (tournament_id, user_id) VALUES (?, ?)').run(id, userId);
      db.prepare('UPDATE tournaments SET players_joined = players_joined + 1 WHERE id = ?').run(id);
      db.prepare('UPDATE users SET balance = balance - ?, tournaments_played = tournaments_played + 1 WHERE id = ?').run(tournament.entry_fee, userId);
    })();
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: 'Already joined' });
  }
};
