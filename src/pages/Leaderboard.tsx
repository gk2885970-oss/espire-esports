import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Users,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'regional'>('global');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1 }} 
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" 
        />
      </div>
    );
  }

  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Skill Rankings</h2>
        </div>
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 pt-10 pb-6">
          {/* Rank 2 */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={`https://picsum.photos/seed/${top3[1].id}/100/100`} alt={top3[1].display_name} className="w-16 h-16 rounded-full border-2 border-secondary object-cover" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-[10px] font-black text-black">2</div>
            </div>
            <span className="text-[10px] font-bold text-center w-20 truncate">{top3[1].display_name}</span>
            <div className="h-16 w-16 bg-gradient-to-t from-secondary/20 to-transparent rounded-t-xl border-t border-x border-secondary/30"></div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center gap-2">
            <Trophy className="text-accent mb-2 animate-bounce" size={24} />
            <div className="relative">
              <img src={`https://picsum.photos/seed/${top3[0].id}/100/100`} alt={top3[0].display_name} className="w-20 h-20 rounded-full border-4 border-accent object-cover shadow-lg shadow-accent/20" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-black text-black">1</div>
            </div>
            <span className="text-xs font-black text-center w-24 truncate">{top3[0].display_name}</span>
            <div className="h-24 w-20 bg-gradient-to-t from-accent/20 to-transparent rounded-t-xl border-t border-x border-accent/30"></div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img src={`https://picsum.photos/seed/${top3[2].id}/100/100`} alt={top3[2].display_name} className="w-16 h-16 rounded-full border-2 border-primary object-cover" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-black text-white">3</div>
            </div>
            <span className="text-[10px] font-bold text-center w-20 truncate">{top3[2].display_name}</span>
            <div className="h-12 w-16 bg-gradient-to-t from-primary/20 to-transparent rounded-t-xl border-t border-x border-primary/30"></div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {rest.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card p-4 rounded-3xl border-white/5 flex items-center gap-4 hover:border-white/10 transition-all"
          >
            <span className="text-xs font-black text-muted-foreground w-4">{index + 4}</span>
            <img src={`https://picsum.photos/seed/${player.id}/100/100`} alt={player.display_name} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">{player.display_name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-bold">{player.ai_rating} AI RATING</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-black text-secondary">
                <TrendingUp size={14} />
                <span>{player.tournaments_won} WINS</span>
              </div>
              <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">{player.total_kills} KILLS</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
