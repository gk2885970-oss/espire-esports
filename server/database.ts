import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../espire.db'));

// Initialize database tables
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      display_name TEXT,
      photo_url TEXT,
      role TEXT,
      balance INTEGER DEFAULT 0,
      currency TEXT DEFAULT 'INR',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      rank INTEGER DEFAULT 0,
      tournaments_played INTEGER DEFAULT 0,
      tournaments_won INTEGER DEFAULT 0,
      placement_points INTEGER DEFAULT 0,
      total_kills INTEGER DEFAULT 0,
      total_points INTEGER DEFAULT 0,
      booyahs INTEGER DEFAULT 0,
      top3 INTEGER DEFAULT 0,
      avg_points REAL DEFAULT 0,
      ai_rating INTEGER DEFAULT 0,
      ai_rank TEXT DEFAULT 'Beginner'
    );

    CREATE TABLE IF NOT EXISTS gaming_ids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      game_name TEXT,
      player_id TEXT,
      rank TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      title TEXT,
      game TEXT,
      prize_pool INTEGER,
      entry_fee INTEGER,
      max_players INTEGER,
      players_joined INTEGER DEFAULT 0,
      date TEXT,
      status TEXT DEFAULT 'upcoming',
      banner_url TEXT
    );

    CREATE TABLE IF NOT EXISTS tournament_players (
      tournament_id TEXT,
      user_id TEXT,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(tournament_id, user_id),
      FOREIGN KEY(tournament_id) REFERENCES tournaments(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      player_id TEXT,
      kills INTEGER,
      placement INTEGER,
      damage INTEGER,
      game TEXT,
      points INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(player_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      description TEXT,
      type TEXT,
      progress INTEGER DEFAULT 0,
      unlock_condition INTEGER,
      reward INTEGER,
      unlocked INTEGER DEFAULT 0,
      unlocked_at DATETIME,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Seed initial data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    db.prepare(`
      INSERT INTO users (id, email, display_name, role, balance, ai_rating, ai_rank)
      VALUES ('user123', 'legend@espire.com', 'Legend_Aryan', 'player', 450, 84, 'Elite Pro')
    `).run();

    db.prepare(`
      INSERT INTO gaming_ids (user_id, game_name, player_id, rank)
      VALUES ('user123', 'BGMI', '5521345678', 'Ace'),
             ('user123', 'Valorant', 'Legend#IND', 'Diamond')
    `).run();

    db.prepare(`
      INSERT INTO tournaments (id, title, game, prize_pool, entry_fee, max_players, players_joined, date, banner_url)
      VALUES 
        ('t1', 'ESPIRE ULTIMATE CUP', 'BGMI', 100000, 100, 512, 124, '2026-10-25', 'https://picsum.photos/seed/mega/800/400'),
        ('t2', 'VALORANT PRO SERIES', 'Valorant', 50000, 50, 128, 64, '2026-11-05', 'https://picsum.photos/seed/val/800/400'),
        ('t3', 'FREE FIRE BOOYAH CUP', 'Free Fire', 25000, 0, 256, 200, '2026-11-12', 'https://picsum.photos/seed/ff/800/400')
    `).run();

    db.prepare(`
      INSERT INTO achievements (id, user_id, title, description, type, progress, unlock_condition, reward, unlocked)
      VALUES 
        ('ach1', 'user123', 'First Win', 'Get your first kill in a tournament.', 'kills', 1, 1, 100, 1),
        ('ach2', 'user123', '10 Match Streak', 'Play 10 tournaments.', 'tournaments', 12, 10, 500, 1),
        ('ach3', 'user123', 'Verified Pro', 'Reach Elite Pro AI Rating.', 'rating', 84, 80, 1000, 1),
        ('ach4', 'user123', 'Top 100', 'Reach the top 100 on the leaderboard.', 'rank', 124, 100, 2000, 0)
    `).run();
  }
}

export default db;
