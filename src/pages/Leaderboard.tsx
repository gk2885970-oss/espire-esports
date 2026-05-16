import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Zap, 
  Users,
  ArrowLeft,
  Search,
  BrainCircuit,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard(); // Backend now returns enriched AI data
        setLeaderboardData(data);
      } catch (error) {
        console.error('Scouting system offline:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }} 
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
        />
        <p className="text-[10px] font-black tracking-widest text-primary animate-pulse">RUNNING PREDICTIVE ANALYSIS...</p>
      </div>
    );
  }

  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-24 px-4 max-w-2xl mx-auto"
    >
      {/* Header with Scouting Badge */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-primary/20 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-tighter uppercase leading-none">Scouting Board</h2>
            <p className="text-[9px] font-bold text-primary tracking-[0.2em] mt-1 flex items-center gap-1">
              <ShieldCheck size={10} /> VERIFIED BY ESPIRE AI
            </p>
          </div>
        </div>
        <div className="bg-accent/10 px-3 py-2 rounded-2xl border border-accent/20 flex items-center gap-2">
           <Eye size={16} className="text-accent" />
           <span className="text-[10px] font-black text-accent uppercase tracking-wider">12 Scouts Active</span>
        </div>
      </div>

      {/* Enhanced Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-4 pt-12 pb-6">
          {[1, 0, 2].map((idx) => {
            const player = top3[idx];
            const isFirst = idx === 0;
            return (
              <motion.div 
                key={player.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative group">
                  <div className={`absolute -inset-1 bg-gradient-to-t ${isFirst ? 'from-accent' : 'from-primary'} to-transparent rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500`}></div>
                  <img src={`https://picsum.photos/seed/${player.id}/100/100`} className={`relative rounded-full object-cover border-2 ${isFirst ? 'w-24 h-24 border-accent shadow-glow-accent' : 'w-16 h-16 border-primary'} `} />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-black text-black ${isFirst ? 'bg-accent' : 'bg-primary text-white'}`}>
                    #{idx + 1}
                  </div>
                </div>
                <span className="text-[10px] font-black text-center w-20 truncate mt-2">{player.display_name}</span>
                <div className={`w-16 ${isFirst ? 'h-24 bg-accent/10 border-accent/20' : 'h-16 bg-primary/10 border-primary/20'} rounded-t-2xl border-t border-x relative overflow-hidden`}>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Predictive List */}
      <div className="space-y-4">
        {rest.map((player, index) => (
          <motion.div
            key={player.id}
            whileHover={{ scale: 1.02, x: 5 }}
            onClick={() => setSelectedPlayer(player === selectedPlayer ? null : player)}
            className={`glass-card p-4 rounded-[2rem] border-white/5 flex flex-col gap-3 transition-all cursor-pointer ${selectedPlayer === player ? 'border-primary/50 bg-primary/5' : ''}`}
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-muted-foreground w-4">{(index + 4).toString().padStart(2, '0')}</span>
              <div className="relative">
                <img src={`https://picsum.photos/seed/${player.id}/100/100`} className="w-12 h-12 rounded-2xl object-cover border border-white/10" />
                {player.scout_potential.includes('95%') && (
                  <div className="absolute -top-1 -right-1 bg-accent p-1 rounded-md shadow-glow-accent">
                    <Zap size={8} className="text-black fill-black" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black tracking-tight">{player.display_name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded font-bold text-muted-foreground uppercase">{player.ai_rank}</span>
                  <span className="text-[9px] font-black text-primary uppercase">{player.ai_rating} RATING</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-[10px] font-black text-secondary">
                  <TrendingUp size={12} />
                  <span>{player.scout_potential.split(' ')[0]} INTEREST</span>
                </div>
                <p className="text-[9px] text-muted-foreground font-bold uppercase mt-0.5">LETHALITY: {player.lethality_index}</p>
              </div>
            </div>

            {/* AI Insight Dropdown (Fundamental Workflow Change) */}
            <AnimatePresence>
              {selectedPlayer === player && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/40 rounded-2xl border border-white/5"
                >
                  <div className="p-4 flex items-start gap-3">
                    <BrainCircuit size={18} className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      "{player.ai_insight}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Leaderboard;
