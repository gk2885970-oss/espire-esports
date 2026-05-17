import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Search, Sparkles, ArrowRight, Zap, Target, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import confetti from 'canvas-confetti';

const TournamentList = () => {
  const navigate = useNavigate();
  const { tournaments, joinTournament, user, fetchTournaments } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('All Games');
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

  useEffect(() => {
    fetchTournaments();
    if (tournaments.length > 0) {
      const bestMatch = tournaments.find(t => 
        t.game === (user?.stats?.favGame || 'BGMI') && 
        t.entryFee <= (user?.wallet?.balance || 0)
      );
      setAiRecommendation(bestMatch);
    }
  }, [tournaments, user]);

  const handleJoin = async (id: string, fee: number) => {
    if (user.wallet.balance < fee) {
      alert('Insufficient balance!');
      return;
    }
    setJoiningId(id);
    try {
      await joinTournament(id);
      // Confetti updated to Gold theme colors
      confetti({ particleCount: 150, spread: 80, colors: ['#facc15', '#eab308', '#ffffff'] });
    } catch (error: any) {
      alert('Failed to join');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 py-4 px-4 max-w-4xl mx-auto"
    >
      {/* 1. AI AGENT: Predictive Matching (Premium Gold Theme) */}
      <AnimatePresence>
        {aiRecommendation && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="relative p-[2px] rounded-3xl overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 animate-gradient-x shadow-[0_0_30px_rgba(250,204,21,0.2)]"
          >
            <div className="bg-[#0a0a0a] rounded-[22px] p-5 relative z-10 border border-[#0a0a0a]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/30">
                    <BrainCircuit size={20} className="text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-tight uppercase">AI Strategic Match</h3>
                    <p className="text-[10px] text-yellow-600 font-bold tracking-widest">BASED ON YOUR {user?.stats?.aiRating || 'PRO'} RATING</p>
                  </div>
                </div>
                <div className="bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 shadow-inner">
                   <span className="text-[10px] font-black text-yellow-500 tracking-wider">98% WIN POTENTIAL</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-black text-white">{aiRecommendation.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-medium">
                    AI Analysis: Your recent aggressive playstyle fits this tournament's map pool perfectly.
                  </p>
                </div>
                <button 
                  onClick={() => handleJoin(aiRecommendation.id, aiRecommendation.entryFee)}
                  className="bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black text-xs shadow-[0_0_15px_rgba(250,204,21,0.6)] hover:bg-yellow-400 hover:scale-105 transition-all"
                >
                  INSTANT JOIN
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 2. Simplified Search (Dark & Gold) */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
        <div className="relative flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Talk to find: 'Free BGMI matches'..." 
              className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-[#111] border border-yellow-500/20 p-4 rounded-2xl text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all shadow-sm">
            <Sparkles size={20} />
          </button>
        </div>
      </div>

      {/* 3. Smart Tournament Feed */}
      <div className="space-y-4 pb-10">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <Target size={16} className="text-yellow-500" /> Eligible Scrims
          </h3>
        </div>
        
        {tournaments.filter(t => t.id !== aiRecommendation?.id).map(t => (
          <div key={t.id} className="glass-card p-4 rounded-3xl border border-white/5 bg-[#111] hover:border-yellow-500/30 transition-all relative group shadow-lg">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#050505] relative border border-white/5 group-hover:border-yellow-500/20 transition-colors">
                <img src={t.bannerUrl} alt={t.title} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-all">
                   <Trophy size={20} className="text-white/20 group-hover:text-yellow-500/50 transition-colors" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-black bg-yellow-500 px-2 py-0.5 rounded uppercase tracking-widest shadow-sm">{t.game}</span>
                    <span className="text-[10px] text-gray-500 font-bold italic">AI Difficulty: Medium</span>
                  </div>
                  <h4 className="font-black text-sm mt-1.5 text-white">{t.title}</h4>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-3">
                    <div className="text-[10px] font-bold text-white"><span className="text-gray-500">PRIZE </span>₹{t.prizePool}</div>
                    <div className="text-[10px] font-bold text-white"><span className="text-gray-500">SLOTS </span>{t.teamsRegistered}/{t.maxTeams}</div>
                  </div>
                  <button 
                    onClick={() => handleJoin(t.id, t.entryFee)}
                    className="text-[10px] font-black bg-white/5 border border-white/10 text-white px-4 py-1.5 rounded-xl hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all"
                  >
                    {t.entryFee === 0 ? 'FREE JOIN' : `PAY ₹${t.entryFee}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TournamentList;
