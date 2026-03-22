const API_BASE = '/api';

export const api = {
  getUserProfile: async (userId: string) => {
    const res = await fetch(`${API_BASE}/user/${userId}`);
    return res.json();
  },
  updateGamingId: async (userId: string, data: { game_name: string; player_id: string; rank: string }) => {
    const res = await fetch(`${API_BASE}/user/${userId}/gaming-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getTournaments: async () => {
    const res = await fetch(`${API_BASE}/tournaments`);
    return res.json();
  },
  getTournamentById: async (id: string) => {
    const res = await fetch(`${API_BASE}/tournaments/${id}`);
    return res.json();
  },
  joinTournament: async (id: string, userId: string) => {
    const res = await fetch(`${API_BASE}/tournaments/${id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return res.json();
  },
  trackMatch: async (data: { userId: string; kills: number; placement: number; damage: number; game: string }) => {
    const res = await fetch(`${API_BASE}/matches/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getAICoachAdvice: async (message: string, userStats: any) => {
    const res = await fetch(`${API_BASE}/ai-coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userStats }),
    });
    return res.json();
  },
  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return res.json();
  },
  getAchievements: async (userId: string) => {
    const res = await fetch(`${API_BASE}/user/${userId}/achievements`);
    return res.json();
  },
  updateAchievementProgress: async (userId: string, achievementId: string, progress: number) => {
    const res = await fetch(`${API_BASE}/achievements/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, achievementId, progress }),
    });
    return res.json();
  },
};
