import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Tournament, ChatMessage, AppState } from './types';
// Note: Tumhe ratingEngine frontend par nahi chahiye kyunki ab AI backend decide karta hai rating.
import { api } from './api';

interface Store extends AppState {
  setUser: (user: UserProfile) => void;
  fetchUser: (userId: string) => Promise<void>;
  updateGamingId: (game: 'bgmi' | 'freefire' | 'valorant', id: string) => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
  fetchTournaments: () => Promise<void>;
  joinTournament: (tournamentId: string) => Promise<void>;
  updateTrainingStats: (stats: Partial<AppState['trainingStats']>) => void;
  trackMatch: (matchData: { kills: number; placement: number; damage: number; game: string }) => Promise<void>;
  
  // --- NEW AI-NATIVE STATE ---
  globalAiInsight: { message: string; data: any[] };
  fetchDashboardInsight: () => Promise<void>;
}

const initialUser: UserProfile = {
  uid: 'user123',
  email: 'legend@espire.com',
  displayName: 'Legend_Aryan',
  role: 'player',
  gamingIds: {
    bgmi: '5521345678',
    valorant: 'Legend#IND',
  },
  stats: {
    level: 24,
    xp: 750,
    rank: 1240,
    tournamentsPlayed: 12,
    tournamentsWon: 3,
    placementPoints: 120,
    totalKills: 85,
    totalPoints: 205,
    booyahs: 3,
    top3: 8,
    avgPoints: 17.1,
    aiRating: 84,        // Yeh ab backend AI control karega
    aiRank: 'Elite Pro',
  },
  wallet: {
    balance: 450,
    currency: 'INR',
  },
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: initialUser,
      tournaments: [],
      chatHistory: [],
      trainingStats: {
        aimScore: 0,
        accuracy: 0,
        reactionTime: 0,
        targetsHit: 0,
        lastDrill: 'None',
      },
      
      // Global AI Memory
      globalAiInsight: { message: "Initializing Espire Neural Net...", data: [] },

      setUser: (user) => set({ user }),
      
      fetchUser: async (userId) => {
        try {
          const data = await api.getUserProfile(userId);
          if (data && !data.error) {
            const userProfile: UserProfile = {
              uid: data.id,
              email: data.email,
              displayName: data.display_name,
              photoURL: data.photo_url,
              role: data.role as any,
              gamingIds: Object.keys(data.gamingIds || {}).reduce((acc: any, curr: any) => {
                if(data.gamingIds[curr]) acc[data.gamingIds[curr].game_name?.toLowerCase()] = data.gamingIds[curr].player_id;
                return acc;
              }, {}),
              stats: {
                level: data.level || 1,
                xp: data.xp || 0,
                rank: data.rank || 0,
                tournamentsPlayed: data.tournaments_played || 0,
                tournamentsWon: data.tournaments_won || 0,
                placementPoints: data.placement_points || 0,
                totalKills: data.total_kills || 0,
                totalPoints: data.total_points || 0,
                booyahs: data.booyahs || 0,
                top3: data.top3 || 0,
                avgPoints: data.avg_points || 0,
                aiRating: data.ai_rating || 50,
                aiRank: data.ai_rank || 'Beginner',
              },
              wallet: {
                balance: data.balance || 0,
                currency: data.currency || 'INR',
              },
            };
            set({ user: userProfile });
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      },

      updateGamingId: async (game, id) => {
        const { user } = get();
        await api.updateGamingId(user.uid, { game_name: game.toUpperCase(), player_id: id, rank: 'Unranked' });
        await get().fetchUser(user.uid);
      },

      addChatMessage: (message) =>
        set((state) => ({ chatHistory: [...state.chatHistory, message] })),

      fetchTournaments: async () => {
        try {
          const data = await api.getTournaments();
          if (Array.isArray(data)) {
            const tournaments: Tournament[] = data.map(t => ({
              id: t.id,
              title: t.title,
              game: t.game,
              entryFee: t.entry_fee,
              prizePool: t.prize_pool,
              startDate: t.date,
              status: t.status,
              teamsRegistered: t.players_joined || 0,
              maxTeams: t.max_players,
              bannerUrl: t.banner_url,
            }));
            set({ tournaments });
          }
        } catch (error) {
          console.error('Failed to fetch tournaments:', error);
        }
      },

      joinTournament: async (tournamentId) => {
        const { user } = get();
        const res = await api.joinTournament(tournamentId, user.uid);
        if (res.success) {
          await get().fetchTournaments();
          await get().fetchUser(user.uid);
        } else {
          throw new Error(res.error);
        }
      },

      updateTrainingStats: (stats) =>
        set((state) => ({ trainingStats: { ...state.trainingStats, ...stats } })),

      // YC SaaS Challenger Workflow: Agentic State Updates
      trackMatch: async (matchData) => {
        const { user } = get();
        // Send to backend. Backend AI will automatically calculate the new rating.
        const response = await api.trackMatch({ ...matchData, userId: user.uid });
        
        // Immediately refresh user to get the new AI Rating and Rank assigned by the backend Agent
        await get().fetchUser(user.uid);
        
        // Background update the Dashboard AI insight so the user gets immediate coaching feedback
        await get().fetchDashboardInsight();
      },

      // The new brain connection
      fetchDashboardInsight: async () => {
        const { user } = get();
        try {
          // Direct call to our new Text-to-SQL AI Route
          const result = await api.getAiInsight(user.uid, "Analyze my recent performance and give me a trend graph.");
          if (result && result.advice) {
            set({ 
              globalAiInsight: { 
                message: result.advice, 
                data: result.graphData || [] 
              } 
            });
          }
        } catch (err) {
          console.error("AI Brain connection lost:", err);
        }
      }
    }),
    {
      name: 'espire-ai-storage', // Updated name to clear old un-optimized cache
    }
  )
);
