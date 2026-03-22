import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Settings, 
  Edit2, 
  Trophy, 
  Zap, 
  Star, 
  Shield, 
  LogOut, 
  ChevronRight,
  Gamepad2,
  Share2,
  Check,
  X,
  Cpu,
  TrendingUp
} from 'lucide-react';
import { useStore } from '../store';
import { getRatingSuggestion } from '../utils/ratingEngine';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateGamingId } = useStore();
  const [editingGame, setEditingGame] = useState<'bgmi' | 'freefire' | 'valorant' | null>(null);
  const [tempId, setTempId] = useState('');

  const ratingSuggestion = getRatingSuggestion(user.stats);

  const stats = [
    { label: 'Tournaments', value: user.stats.tournamentsPlayed, path: '/profile/tournaments' },
    { label: 'Wins', value: user.stats.tournamentsWon, path: '/profile/stats' },
    { label: 'Win Rate', value: `${Math.round((user.stats.tournamentsWon / (user.stats.tournamentsPlayed || 1)) * 100)}%`, path: '/profile/stats' },
    { label: 'Earnings', value: `₹${user.wallet.balance * 2}`, path: '/wallet' },
  ];

  const handleEdit = (game: 'bgmi' | 'freefire' | 'valorant') => {
    setEditingGame(game);
    setTempId(user.gamingIds[game] || '');
  };

  const handleSave = async () => {
    if (editingGame) {
      await updateGamingId(editingGame, tempId);
      setEditingGame(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 py-4 pb-10"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-primary via-secondary to-accent">
            <div className="w-full h-full rounded-full bg-background p-1">
              <img 
                src={user.photoURL || "https://picsum.photos/seed/user/200/200"} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-background shadow-lg">
            <Edit2 size={14} className="text-white" />
          </button>
          <div className="absolute -top-2 -left-2 bg-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-lg">
            PRO
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">{user.displayName}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-muted/50 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-muted transition-colors">
            <Share2 size={14} /> Share Profile
          </button>
          <button className="bg-muted/50 border border-white/5 p-2 rounded-xl hover:bg-muted transition-colors">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* AI Rating Section */}
      <section 
        onClick={() => navigate('/profile/stats')}
        className="glass-card p-6 rounded-3xl border-primary/20 bg-primary/5 relative overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={80} className="text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black flex items-center gap-2">
                AI Rating: <span className="text-primary">{user.stats.aiRating}</span>
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rank: {user.stats.aiRank}</p>
            </div>
            <div className="text-right">
              <TrendingUp size={24} className="text-emerald-500 ml-auto" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase">+5.2% this week</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-muted rounded-full mb-4 overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${user.stats.aiRating}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            />
          </div>
          
          <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              "{ratingSuggestion}"
            </p>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map(stat => (
          <div 
            key={stat.label} 
            onClick={() => navigate(stat.path)}
            className="glass-card p-3 rounded-2xl border-white/5 text-center cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <p className="text-lg font-black text-white">{stat.value}</p>
            <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Gaming IDs */}
      <section>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Gaming IDs</h3>
        <div className="space-y-3">
          {(['bgmi', 'valorant', 'freefire'] as const).map(game => (
            <div key={game} className="glass-card p-4 rounded-2xl border-white/5 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Gamepad2 size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{game}</p>
                  {editingGame === game ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="text" 
                        value={tempId}
                        onChange={(e) => setTempId(e.target.value)}
                        className="bg-muted/50 border border-primary/50 rounded-lg px-2 py-1 text-sm w-full focus:outline-none"
                        autoFocus
                      />
                      <button onClick={handleSave} className="p-1 text-emerald-500"><Check size={18} /></button>
                      <button onClick={() => setEditingGame(null)} className="p-1 text-red-500"><X size={18} /></button>
                    </div>
                  ) : (
                    <p className="text-sm font-bold">{user.gamingIds[game] || 'Not Set'}</p>
                  )}
                </div>
              </div>
              {!editingGame && (
                <button onClick={() => handleEdit(game)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section 
        onClick={() => navigate('/profile/achievements')}
        className="cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">Achievements</h3>
          <span className="text-[10px] text-primary font-bold">12 / 50</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[
            { icon: Trophy, color: 'text-yellow-500', label: 'First Win' },
            { icon: Zap, color: 'text-primary', label: '10 Match Streak' },
            { icon: Shield, color: 'text-secondary', label: 'Verified Pro' },
            { icon: Star, color: 'text-accent', label: 'Top 100' },
          ].map((ach, i) => (
            <div key={i} className="min-w-[80px] flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl glass-card border-white/5 flex items-center justify-center group-hover:border-primary/30 transition-all">
                <ach.icon className={ach.color} size={32} />
              </div>
              <span className="text-[8px] font-bold text-center uppercase tracking-tighter text-muted-foreground">{ach.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Options */}
      <div className="space-y-2">
        <button 
          onClick={() => navigate('/privacy')}
          className="w-full flex items-center justify-between p-4 glass-card rounded-2xl border-white/5 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Privacy & Security</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
        <button 
          onClick={() => navigate('/premium')}
          className="w-full flex items-center justify-between p-4 glass-card rounded-2xl border-white/5 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Star size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Premium Subscription</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
        <button 
          onClick={() => navigate('/achievements')}
          className="w-full flex items-center justify-between p-4 glass-card rounded-2xl border-white/5 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Trophy size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Achievements</span>
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
        <button className="w-full flex items-center justify-between p-4 glass-card rounded-2xl border-white/5 text-red-500 hover:bg-red-500/10 transition-colors">
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
