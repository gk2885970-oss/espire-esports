const API_BASE = '/api';

const GEMINI_API_KEY = "AIzaSyC5BzNZe5IaKHfBlnxndkBxGdPbw38vy3s";
export const api = {
  getUserProfile: async (userId: string) => {
    const res = await fetch(`${API_BASE}/user/${userId}`);
    return res.json();
  },

  updateGamingId: async (userId: string, data: {
    game_name: string;
    player_id: string;
    rank: string
  }) => {
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

  trackMatch: async (data: {
    userId: string;
    kills: number;
    placement: number;
    damage: number;
    game: string
  }) => {
    const res = await fetch(`${API_BASE}/matches/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // ── GEMINI DIRECT CALL ────────────────────────────────────────────────────
  getAICoachAdvice: async (message: string, userStats: any) => {
    const prompt = `You are an expert esports coach for mobile games like BGMI, Free Fire, and Valorant.

Player Stats: ${JSON.stringify(userStats || {})}

Player Question: ${message}

Give a concise, practical coaching tip in 2-3 sentences. Be direct and actionable. Focus on improvement.`;

    const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    const advice = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Let's work on your gameplay! Try focusing on positioning first.";
    return { advice };
  },
  // ─────────────────────────────────────────────────────────────────────────

  getLeaderboard: async () => {
    const res = await fetch(`${API_BASE}/leaderboard`);
    return res.json();
  },

  getAchievements: async (userId: string) => {
    const res = await fetch(`${API_BASE}/user/${userId}/achievements`);
    return res.json();
  },

  updateAchievementProgress: async (
    userId: string,
    achievementId: string,
    progress: number
  ) => {
    const res = await fetch(`${API_BASE}/achievements/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, achievementId, progress }),
    });
    return res.json();
  },
};