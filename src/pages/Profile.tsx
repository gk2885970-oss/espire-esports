import React, { useState } from 'react';
import { motion } from 'framer-motion'; 
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
import { auth } from '../firebase'; 

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

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
      className="space-y-8 py-4 pb-10 max-w-4xl mx-auto px-4"
    >
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-yellow-500 via-yellow-300 to-yellow-600 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
            <div className="w-full h-full rounded-full bg-[#0a0a0a] p-1">
              <img 
                src={user.photoURL || "https://picsum.photos/seed/user/200/200"} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover filter grayscale opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full border-2 border-[#0a0a0a] shadow-lg hover:bg-yellow-400 transition-colors">
            <Edit2 size={14} className="text-black" />
          </button>
          <div className="absolute -top-2 -left-2 bg-yellow-500 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(250,204,21,0.5)]">
            ELITE
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">{user.displayName}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-xl text-xs font-bold text-yellow-500 flex items-center gap-2 hover:bg-yellow-500/20 transition-colors">
            <Share2 size={14} /> Share Profile
          </button>
          <button className="bg-[#111] border border-white/5 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <Settings size={18} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* AI Rating Section */}
      <section 
        onClick={() => navigate('/profile/stats')}
        className="glass-card p-6 rounded-3xl border border-yellow-500/20 bg-[#111] relative overflow-hidden cursor-pointer hover:border-yellow-500/50 transition-all shadow-[0_0_15px_rgba(250,204,21,0.05)]"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={80} className="text-yellow-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black flex items-center gap-2 text-white">
                AI Rating: <span className="text-yellow-500">{user.stats.aiRating}</span>
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rank: {user.stats.aiRank}</p>
            </div>
            <div className="text-right">
              <TrendingUp size={24} className="text-yellow-500 ml-auto" />
              <p className="text-[10px] text-yellow-500 font-bold uppercase">+5.2% this week</p>
            </div>
          </div>
          
          <div className="w-full h-3 bg-[#050505] rounded-full mb-4 overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${user.stats.aiRating}%` }}
              className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]"
            />
          </div>
          
          <div className="bg-[#050505] p-3 rounded-2xl border border-white/5">
            <p className="text-[11px] text-gray-400 leading-relaxed italic font-medium">
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
            className="glass-card p-3 rounded-2xl border border-white/5 bg-[#111] text-center cursor-pointer hover:border-yellow-500/30 transition-colors"
          >
            <p className="text-lg font-black text-white">{stat.value}</p>
            <p className="text-[8px] text-yellow-500 uppercase font-bold tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Gaming IDs */}
      <section>
        <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Gamepad2 size={16}/> Linked Accounts
        </h3>
        <div className="space-y-3">
          {(['bgmi', 'valorant', 'freefire'] as const).map(game => (
            <div key={game} className="glass-card p-4 rounded-2xl border border-white/5 bg-[#111] flex items-center justify-between group transition-all hover:border-yellow-500/20">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#050505] flex items-center justify-center border border-white/5 group-hover:border-yellow-500/30 transition-colors">
                  <Gamepad2 size={18} className="text-yellow-500" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{game}</p>
                  {editingGame === game ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="text" 
                        value={tempId}
                        onChange={(e) => setTempId(e.target.value)}
                        className="bg-[#050505] border border-yellow-500/50 rounded-lg px-2 py-1 text-sm w-full focus:outline-none text-white"
                        autoFocus
                      />
                      <button onClick={handleSave} className="p-1 text-green-500 hover:text-green-400"><Check size={18} /></button>
                      <button onClick={() => setEditingGame(null)} className="p-1 text-red-500 hover:text-red-400"><X size={18} /></button>
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-gray-200">{user.gamingIds[game] || 'Not Set'}</p>
                  )}
                </div>
              </div>
              {!editingGame && (
                <button onClick={() => handleEdit(game)} className="p-2 text-gray-500 hover:text-yellow-500 transition-colors">
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
        className="cursor-pointer group bg-[#111] border border-white/5 p-4 rounded-2xl hover:border-yellow-500/20 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-yellow-500 transition-colors">Trophy Cabinet</h3>
          <span className="text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded-md">12 / 50</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[
            { icon: Trophy, color: 'text-yellow-500', label: 'First Win' },
            { icon: Zap, color: 'text-yellow-400', label: '10 Streak' },
            { icon: Shield, color: 'text-gray-400', label: 'Verified' },
            { icon: Star, color: 'text-yellow-500', label: 'Top 100' },
          ].map((ach, i) => (
            <div key={i} className="min-w-[80px] flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center group-hover:border-yellow-500/30 transition-all shadow-inner">
                <ach.icon className={ach.color} size={28} />
              </div>
              <span className="text-[9px] font-bold text-center uppercase tracking-tighter text-gray-400">{ach.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Options */}
      <div className="space-y-2">
        <button onClick={() => navigate('/privacy')} className="w-full flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-200">Privacy & Security</span>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
        
        <button onClick={() => navigate('/premium')} className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/10 to-[#111] rounded-2xl border border-yellow-500/20 hover:border-yellow-500/50 transition-colors">
          <div className="flex items-center gap-3">
            <Star size={18} className="text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500 tracking-wide">ESPIRE Premium</span>
          </div>
          <ChevronRight size={16} className="text-yellow-500" />
        </button>

        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-between p-4 bg-[#111] rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors mt-4"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Logout Session</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
