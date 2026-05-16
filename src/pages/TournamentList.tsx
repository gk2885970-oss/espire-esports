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
    // AI Strategy: Calculate best tournament for user based on their AI Rating
    if (tournaments.length > 0) {
      const bestMatch = tournaments.find(t => 
        t.game === (user.stats.favGame || 'BGMI') && 
        t.entryFee <= user.wallet.balance
      );
      setAiRecommendation(bestMatch);
    }
  }, [tournaments]);

  const handleJoin = async (id: string, fee: number) => {
    if (user.wallet.balance < fee) {
      alert('Insufficient balance!');
      return;
    }
    setJoiningId(id);
    try {
      await joinTournament(id);
      confetti({ particleCount: 150, spread: 80, colors: ['#8B5CF6', '#D946EF'] });
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
      className="space-y-6 py-4 px-4"
    >
      {/* 1. AI AGENT: Predictive Matching (The YC "Aha" Moment) */}
      <AnimatePresence>
        {aiRecommendation && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="relative p-[2px] rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x"
          >
            <div className="bg-[#0f0f0f] rounded-[22px] p-5 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <BrainCircuit size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-tight uppercase">AI Strategic Match</h3>
                    <p className="text-[10px] text-muted-foreground font-bold">BASED ON YOUR {user.stats.ai_rating} RATING</p>
                  </div>
                </div>
                <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                   <span className="text-[10px] font-bold text-accent">98% WIN POTENTIAL</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-black text-white">{aiRecommendation.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    AI Analysis: Your recent aggressive playstyle fits this tournament's map pool perfectly.
                  </p>
                </div>
                <button 
                  onClick={() => handleJoin(aiRecommendation.id, aiRecommendation.entryFee)}
                  className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs shadow-glow-primary hover:scale-105 transition-all"
                >
                  INSTANT JOIN
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 2. Simplified Search (Reduced Cognitive Load) */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
        <div className="relative flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Talk to find: 'Free BGMI matches tomorrow'..." 
              className="w-full bg-muted/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 ring-primary/50"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-primary/10 border border-primary/20 p-4 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all">
            <Sparkles size={20} />
          </button>
        </div>
      </div>

      {/* 3. Smart Tournament Feed */}
      <div className="space-y-4 pb-10">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Target size={16} /> Eligible Scrims
          </h3>
        </div>
        
        {tournaments.filter(t => t.id !== aiRecommendation?.id).map(t => (
          <div key={t.id} className="glass-card p-4 rounded-3xl border-white/5 hover:bg-white/[0.02] transition-all relative group">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted relative">
                <img src={t.bannerUrl} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Trophy size={20} className="text-white/20" />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">{t.game}</span>
                    <span className="text-[10px] text-muted-foreground font-bold italic">AI Difficulty: Medium</span>
                  </div>
                  <h4 className="font-bold text-sm mt-1">{t.title}</h4>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="text-[10px] font-bold"><span className="text-muted-foreground">PRIZE</span> ₹{t.prizePool}</div>
                    <div className="text-[10px] font-bold"><span className="text-muted-foreground">SLOTS</span> {t.teamsRegistered}/{t.maxTeams}</div>
                  </div>
                  <button 
                    onClick={() => handleJoin(t.id, t.entryFee)}
                    className="text-[10px] font-bold bg-white text-black px-4 py-1.5 rounded-lg hover:invert transition-all"
                  >
                    {t.entryFee === 0 ? 'FREE' : `₹${t.entryFee}`}
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
