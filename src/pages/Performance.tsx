import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Target, Zap, Trophy, Cpu, Star, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getRatingSuggestion } from '../utils/ratingEngine';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const Performance = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  
  const ratingSuggestion = getRatingSuggestion(user.stats);

  const chartData = [
    { name: 'Mon', rating: 78 },
    { name: 'Tue', rating: 80 },
    { name: 'Wed', rating: 79 },
    { name: 'Thu', rating: 82 },
    { name: 'Fri', rating: 85 },
    { name: 'Sat', rating: 84 },
    { name: 'Sun', rating: 84 },
  ];

  const skillData = [
    { skill: 'Aim', value: 88 },
    { skill: 'Game Sense', value: 72 },
    { skill: 'Strategy', value: 65 },
    { skill: 'Teamwork', value: 90 },
    { skill: 'Reaction', value: 82 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-4 pb-20"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black tracking-tighter uppercase">Performance Analysis</h2>
      </div>

      {/* AI Rating Card */}
      <section className="glass-card p-6 rounded-3xl border-primary/20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={80} className="text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-black flex items-center gap-2">
                AI Rating: <span className="text-primary">{user.stats.aiRating}</span>
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rank: {user.stats.aiRank}</p>
            </div>
            <div className="text-right">
              <TrendingUp size={24} className="text-emerald-500 ml-auto" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase">+5.2% this week</p>
            </div>
          </div>
          
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

      {/* Rating Trend Chart */}
      <section className="glass-card p-6 rounded-3xl border-white/5">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Rating Trend</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#8B5CF6', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="rating" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorRating)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Skill Breakdown */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Skill Breakdown</h3>
        <div className="grid grid-cols-1 gap-3">
          {skillData.map((skill) => (
            <div key={skill.skill} className="glass-card p-4 rounded-2xl border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-widest">{skill.skill}</span>
                <span className="text-xs font-black text-primary">{skill.value}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.value}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tournament Performance Stats */}
      <section className="glass-card p-6 rounded-3xl border-white/5">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Tournament Performance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Points</p>
            <p className="text-xl font-black text-white">{user.stats.totalPoints}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Kills</p>
            <p className="text-xl font-black text-white">{user.stats.totalKills}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Booyahs</p>
            <p className="text-xl font-black text-secondary">{user.stats.booyahs}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg Points</p>
            <p className="text-xl font-black text-accent">{user.stats.avgPoints}</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Performance;
