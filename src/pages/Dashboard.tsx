import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 
import { Trophy, Zap, Users, ArrowRight, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  // Store se data nikalna
  const { user, tournaments, fetchUser, fetchTournaments } = useStore();
  const [aiInsight, setAiInsight] = useState({ message: "Analyzing your gameplay...", data: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initDashboard = async () => {
      // 1. Check karo user hai ya nahi
      if (user?.uid) {
        try {
          await fetchUser(user.uid);
          await fetchTournaments();
          
          // 2. AI Insight Fetch (Iska try-catch zaroori hai taaki API fail hone par UI na ruke)
          const response = await fetch('/api/ai-insight', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid })
          });
          
          if (response.ok) {
            const result = await response.json();
            setAiInsight({
              message: result.advice || "Keep grinding, Elite status awaits!",
              data: result.graphData || []
            });
          }
        } catch (err) {
          console.error("Dashboard Data Error:", err);
          // Fallback data agar API fail ho jaye
          setAiInsight(prev => ({ ...prev, message: "Ready for your next tournament?" }));
        } finally {
          setLoading(false);
        }
      } else {
        // Agar user nahi mila toh 2 second baad loading band karo (Security check)
        setTimeout(() => setLoading(false), 2000);
      }
    };
    
    initDashboard();
  }, [user?.uid, fetchUser, fetchTournaments]);

  // Loading Screen (Blank screen se bachne ke liye)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-4 px-4 max-w-4xl mx-auto"
    >
      {/* AI Analysis Hero Section */}
      <section 
        onClick={() => navigate('/ai')}
        className="glass-card p-6 rounded-3xl relative overflow-hidden border-primary/20 cursor-pointer bg-gradient-to-br from-primary/10 to-transparent"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/20 px-2 py-1 rounded-md flex items-center gap-1">
              <Zap size={12} className="text-primary fill-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Real-time Analysis</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-black mb-2 tracking-tight">
             Elite Status: {user?.stats?.ai_rank || 'Scout'}
          </h2>
          
          <p className="text-sm text-muted-foreground mb-6 italic border-l-2 border-primary/30 pl-4">
              "{aiInsight.message}"
          </p>

          {/* Performance Graph */}
          {aiInsight.data.length > 0 && (
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
            </div>
          )}

          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm">
            Launch Deep Analysis <ArrowRight size={16} />
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">AI Skill Rating</span>
            <BarChart3 size={14} className="text-primary" />
          </div>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-primary">{user?.stats?.ai_rating || '0'}</span>
            <span className="text-[10px] text-green-500 mb-1 font-bold">+2.4%</span>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-2xl border-white/5">
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Scout Interest</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-accent">High</span>
            <Users size={14} className="text-accent mb-1.5" />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
