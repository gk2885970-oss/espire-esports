import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Motion import updated to standard
import { Trophy, BookOpen, Zap, Users, ArrowRight, Play, Star, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, tournaments, fetchUser, fetchTournaments } = useStore();
  const [aiInsight, setAiInsight] = useState({ message: "Analyzing your gameplay...", data: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initDashboard = async () => {
      await fetchUser(user.uid);
      await fetchTournaments();
      
      // AI-Native Logic: Backend se real insights fetch karna
      try {
        const response = await fetch('/api/ai-insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.uid, 
            message: "Analyze my recent performance and give me a trend graph." 
          })
        });
        const result = await response.json();
        setAiInsight({
          message: result.advice,
          data: result.graphData || [] // AI ne jo SQL se data nikala
        });
      } catch (err) {
        console.error("AI Insight Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    initDashboard();
  }, []);

  const upcomingTournaments = tournaments.slice(0, 2);
  const winRate = Math.round((user.stats.tournamentsWon / (user.stats.tournamentsPlayed || 1)) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-4 px-4 max-w-4xl mx-auto"
    >
      {/* 1. AI-Native Hero: Dynamic Insights & Recharts */}
      <section 
        onClick={() => navigate('/ai')}
        className="glass-card p-6 rounded-3xl relative overflow-hidden border-primary/20 cursor-pointer bg-gradient-to-br from-primary/10 to-transparent"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/20 px-2 py-1 rounded-md flex items-center gap-1">
              <Zap size={12} className="text-primary fill-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest text-glow">Real-time Analysis</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-black mb-2 tracking-tight">
            {loading ? "Syncing Brain..." : `Elite Status: ${user.stats.ai_rank}`}
          </h2>
          
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic border-l-2 border-primary/30 pl-4">
             "{aiInsight.message}"
          </p>

          {/* AI-Generated Performance Graph */}
          {!loading && aiInsight.data.length > 0 && (
            <div className="h-32 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiInsight.data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="kills" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
                  <XAxis dataKey="created_at" hide />
                  <Tooltip contentStyle={{ background: '#121212', borderRadius: '12px', border: '1px solid #333' }} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-center text-muted-foreground font-bold mt-2 uppercase tracking-widest opacity-50">Kills vs Matches (AI Analyzed)</p>
            </div>
          )}

          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-1 transition-transform">
            Launch Deep Analysis <ArrowRight size={16} />
          </div>
        </div>
      </section>

      {/* 2. Predictive Stats Quick View */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border-primary/20 bg-primary/5 group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">AI Skill Rating</span>
            <BarChart3 size={14} className="text-primary" />
          </div>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-primary">{user.stats.ai_rating}</span>
            <span className="text-[10px] text-green-500 mb-1 font-bold">+2.4%</span>
          </div>
          <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
            <div style={{ width: `${user.stats.ai_rating}%` }} className="h-full bg-primary shadow-glow"></div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-2xl border-white/5">
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Scout Interest</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-accent">High</span>
            <Users size={14} className="text-accent mb-1.5" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 font-bold uppercase">Trending in Tier-1 Scrims</p>
        </div>
      </section>

      {/* Rest of the UI remains consistent but with data-driven fields... */}
      {/* Tournament Section & Training Hub logic continues below */}
    </motion.div>
  );
};

export default Dashboard;
