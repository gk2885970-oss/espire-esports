export type UserRole = 'player' | 'coach' | 'organizer' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  gamingIds: {
    bgmi?: string;
    freefire?: string;
    valorant?: string;
  };
  stats: {
    level: number;
    xp: number;
    rank: number;
    tournamentsPlayed: number;
    tournamentsWon: number;
    // Tournament Performance Stats
    placementPoints: number;
    totalKills: number;
    totalPoints: number;
    booyahs: number;
    top3: number;
    avgPoints: number;
    // AI Rating
    aiRating: number;
    aiRank: string;
  };
  wallet: {
    balance: number;
    currency: 'INR' | 'USD';
  };
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  entryFee: number;
  prizePool: number;
  startDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  teamsRegistered: number;
  maxTeams: number;
  bannerUrl: string;
}

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface Match {
  id: string;
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  winner?: string;
  status: MatchStatus;
  time: string;
}

export interface TournamentBracket {
  roundName: string;
  matches: Match[];
}

export interface TrainingLesson {
  id: string;
  title: string;
  category: 'aim' | 'game-sense' | 'strategy' | 'teamwork' | 'communication';
  level: 'beginner' | 'intermediate' | 'advanced';
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  description: string;
}

export type PlayerRank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Elite' | 'Legend';

export interface PlayerStats extends SkillStats {
  elo: number;
  rank: PlayerRank;
  winRate: number;
  matchesPlayed: number;
  avgKills: number;
  avgDamage: number;
}

export interface TrainingRecommendation {
  id: string;
  title: string;
  reason: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  category: 'aim' | 'game-sense' | 'strategy' | 'teamwork';
}

export interface SkillStats {
  aim: number;
  gameSense: number;
  strategy: number;
  teamwork: number;
  reactionSpeed: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TrainingStats {
  aimScore: number;
  accuracy: number;
  reactionTime: number;
  targetsHit: number;
  lastDrill: string;
}

export interface AppState {
  user: UserProfile;
  tournaments: Tournament[];
  chatHistory: ChatMessage[];
  trainingStats: TrainingStats;
}
