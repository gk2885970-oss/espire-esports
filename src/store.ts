import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, Tournament, ChatMessage, AppState } from './types';
import { calculateAIRating, getAIRank } from './utils/ratingEngine';
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
    aiRating: 84,
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
              gamingIds: data.gamingIds.reduce((acc: any, curr: any) => {
                acc[curr.game_name.toLowerCase()] = curr.player_id;
                return acc;
              }, {}),
              stats: {
                level: data.level,
                xp: data.xp,
                rank: data.rank,
                tournamentsPlayed: data.tournaments_played,
                tournamentsWon: data.tournaments_won,
                placementPoints: data.placement_points,
                totalKills: data.total_kills,
                totalPoints: data.total_points,
                booyahs: data.booyahs,
                top3: data.top3,
                avgPoints: data.avg_points,
                aiRating: data.ai_rating,
                aiRank: data.ai_rank,
              },
              wallet: {
                balance: data.balance,
                currency: data.currency,
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
        set((state) => ({
          chatHistory: [...state.chatHistory, message],
        })),
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
              teamsRegistered: t.players_joined,
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
        set((state) => ({
          trainingStats: { ...state.trainingStats, ...stats },
        })),
      trackMatch: async (matchData) => {
        const { user } = get();
        await api.trackMatch({ ...matchData, userId: user.uid });
        await get().fetchUser(user.uid);
      },
    }),
    {
      name: 'espire-storage',
    }
  )
);
