import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Search, Filter, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import confetti from 'canvas-confetti';

const TournamentList = () => {
  const navigate = useNavigate();
  const { tournaments, joinTournament, user, fetchTournaments } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('All Games');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = selectedGame === 'All Games' || t.game === selectedGame;
    return matchesSearch && matchesGame;
  });

  const handleJoin = async (id: string, fee: number) => {
    if (user.wallet.balance < fee) {
      alert('Insufficient balance! Please top up your wallet.');
      return;
    }
    
    setJoiningId(id);
    try {
      await joinTournament(id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#D946EF']
      });
    } catch (error: any) {
      alert(error.message || 'Failed to join tournament');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 py-4"
    >
      {/* Header & Search */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="text-primary" />
          Tournaments
        </h2>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button className="bg-muted/50 border border-white/10 p-3 rounded-2xl text-muted-foreground hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Game Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {['All Games', 'BGMI', 'Valorant', 'Free Fire', 'CODM'].map((game) => (
          <button 
            key={game}
            onClick={() => setSelectedGame(game)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedGame === game ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted/30 border border-white/5 text-muted-foreground hover:text-white'
            }`}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Featured Tournament */}
      <section className="glass-card rounded-3xl overflow-hidden border-primary/20 relative group cursor-pointer">
        <div className="h-48 relative">
          <img src="https://picsum.photos/seed/mega/800/400" alt="Mega Tournament" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-accent px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Zap size={10} /> MEGA EVENT
            </span>
            <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
              OCT 25
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-black mb-1 tracking-tight">ESPIRE ULTIMATE CUP</h3>
            <div className="flex items-center justify-between">
              <p className="text-secondary font-bold text-lg">₹1,00,000 PRIZE</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={14} />
                <span>512 Slots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament List */}
      <div className="space-y-4 pb-10">
        {filteredTournaments.map(t => (
          <div key={t.id} className="glass-card p-4 rounded-3xl border-white/5 flex gap-4 hover:border-primary/30 transition-all group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden relative flex-shrink-0">
              <img src={t.bannerUrl} alt={t.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              {t.status === 'ongoing' && (
                <div className="absolute top-1 left-1 bg-red-500 px-1.5 py-0.5 rounded text-[8px] font-bold animate-pulse">LIVE</div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div onClick={() => navigate(`/tournament/${t.id}`)} className="cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t.game}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{t.startDate}</span>
                </div>
                <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{t.title}</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Trophy size={12} className="text-secondary" />
                    <span className="text-xs font-bold">₹{t.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{t.teamsRegistered}/{t.maxTeams}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <button 
                  onClick={() => handleJoin(t.id, t.entryFee)}
                  disabled={joiningId === t.id}
                  className={`text-[10px] font-bold px-4 py-1.5 rounded-xl uppercase transition-all flex items-center gap-2 ${
                    joiningId === t.id 
                      ? 'bg-muted/50 text-muted-foreground' 
                      : 'bg-primary text-white hover:bg-primary/80'
                  }`}
                >
                  {joiningId === t.id ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                      Joining...
                    </>
                  ) : (
                    <>
                      {t.entryFee === 0 ? 'Join Free' : `Join ₹${t.entryFee}`}
                    </>
                  )}
                </button>
                <ArrowRight size={16} onClick={() => navigate(`/tournament/${t.id}`)} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all cursor-pointer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TournamentList;
