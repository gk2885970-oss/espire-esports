import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, BookOpen, Zap, Users, ArrowRight, Play, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, tournaments, fetchUser, fetchTournaments } = useStore();
  
  useEffect(() => {
    fetchUser(user.uid);
    fetchTournaments();
  }, []);

  const upcomingTournaments = tournaments.slice(0, 2);

  const trainingHighlights = [
    { id: '1', title: 'Mastering Recoil', category: 'Aim Training', level: 'Intermediate', duration: '12m', path: '/training/aim-trainer' },
    { id: '2', title: 'Map Rotation 101', category: 'Strategy', level: 'Beginner', duration: '8m', path: '/training/strategy' },
  ];

  const winRate = Math.round((user.stats.tournamentsWon / (user.stats.tournamentsPlayed || 1)) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 py-4"
    >
      {/* Hero Section / AI Insight */}
      <section 
        onClick={() => navigate('/ai')}
        className="glass-card p-6 rounded-3xl relative overflow-hidden border-primary/20 cursor-pointer hover:border-primary/50 transition-all"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap size={80} className="text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/20 px-2 py-1 rounded-md">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Coach Insight</span>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Ready to level up, {user.displayName.split(' ')[0]}?</h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            "Your aim accuracy in the last 3 matches has improved by 12%. Focus on your reaction speed training today to dominate the next tournament."
          </p>
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm">
            View Full Analysis <ArrowRight size={16} />
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/leaderboard')}
          className="glass-card p-4 rounded-2xl border-primary/20 bg-primary/5 group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Rank</span>
            <Trophy size={14} className="text-primary group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-primary">#{user.stats.rank}</span>
            <span className="text-[10px] text-muted-foreground mb-1">GLOBAL</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <div className="w-[40%] h-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
          </div>
        </div>
        <div 
          onClick={() => navigate('/profile/stats')}
          className="glass-card p-4 rounded-2xl border-white/5 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Win Rate</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-accent">{winRate}%</span>
            <span className="text-[10px] text-muted-foreground mb-1">+5%</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${winRate}%` }} className="h-full bg-accent shadow-[0_0_8px_rgba(217,70,239,0.5)]"></div>
          </div>
        </div>
      </section>

      {/* Live Now Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Live Now
          </h3>
          <Link to="/train" className="text-xs text-muted-foreground font-bold uppercase tracking-widest">View All</Link>
        </div>
        <Link to="/live-coaching" className="block glass-card p-4 rounded-3xl border-red-500/20 bg-gradient-to-r from-red-500/10 to-transparent relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center relative">
              <Play size={24} className="text-red-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background animate-ping"></div>
            </div>
            <div>
              <h4 className="font-bold text-sm">Pro Coaching: Advanced Rotations</h4>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">1.2k Players Watching</p>
            </div>
            <div className="ml-auto">
              <ArrowRight size={20} className="text-muted-foreground group-hover:text-red-500 transition-all" />
            </div>
          </div>
        </Link>
      </section>

      {/* Upcoming Tournaments */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy size={20} className="text-primary" />
            Tournaments
          </h3>
          <Link to="/play" className="text-xs text-muted-foreground font-bold uppercase tracking-widest">See All</Link>
        </div>
        <div className="space-y-4">
          {upcomingTournaments.map(t => (
            <div key={t.id} className="block glass-card rounded-2xl overflow-hidden border-white/5 group">
              <div onClick={() => navigate(`/tournament/${t.id}/bracket`)} className="h-32 relative cursor-pointer">
                <img src={t.bannerUrl} alt={t.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] font-bold bg-primary px-2 py-0.5 rounded uppercase mb-1 inline-block">{t.game}</span>
                  <h4 className="font-bold text-lg">{t.title}</h4>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Prize Pool</p>
                    <p className="text-sm font-bold text-secondary">₹{t.prizePool}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Entry</p>
                    <p className="text-sm font-bold">{t.entryFee === 0 ? 'Free' : `₹${t.entryFee}`}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/play')}
                  className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Training Hub Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-secondary" />
            Training Hub
          </h3>
          <Link to="/train" className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Explore</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {trainingHighlights.map(h => (
            <div key={h.id} onClick={() => navigate(h.path)} className="min-w-[240px] glass-card p-4 rounded-2xl border-white/5 cursor-pointer group">
              <div className="w-full aspect-video bg-muted rounded-xl mb-3 flex items-center justify-center relative">
                <Play size={32} className="text-white/50 group-hover:text-primary transition-colors" />
                <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-bold">{h.duration}</div>
              </div>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{h.category}</p>
              <h4 className="font-bold text-sm mb-2">{h.title}</h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">{h.level}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(s => <Star key={s} size={10} className="fill-secondary text-secondary" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
