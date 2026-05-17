import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 
import { Trophy, Zap, Users, ArrowRight, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, tournaments, fetchUser, fetchTournaments } = useStore();
  const [aiInsight, setAiInsight] = useState({ message: "Analyzing your gameplay...", data: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initDashboard = async () => {
      if (user?.uid) {
        try {
          await fetchUser(user.uid);
          await fetchTournaments();
          
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
          setAiInsight(prev => ({ ...prev, message: "Ready for your next tournament?" }));
        } finally {
          setLoading(false);
        }
      } else {
        setTimeout(() => setLoading(false), 2000);
      }
    };
    
    initDashboard();
  }, [user?.uid, fetchUser, fetchTournaments]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-yellow-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)]"></div>
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
        className="glass-card p-6 rounded-3xl relative overflow-hidden border border-yellow-500/20 cursor-pointer bg-gradient-to-br from-yellow-500/10 to-[#0a0a0a] shadow-[0_0_30px_rgba(250,204,21,0.05)]"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-yellow-500/20 px-2 py-1 rounded-md flex items-center gap-1 border border-yellow-500/30">
              <Zap size={12} className="text-yellow-500 fill-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Real-time Analysis</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-black mb-2 tracking-tight text-white">
             Elite Status: <span className="text-yellow-500">{user?.stats?.ai_rank || 'Scout'}</span>
          </h2>
          
          <p className="text-sm text-gray-400 mb-6 italic border-l-2 border-yellow-500/50 pl-4">
             "{aiInsight.message}"
          </p>

          {/* Performance Graph - Updated to Gold/Yellow Theme */}
          {aiInsight.data.length > 0 && (
            <div className="h-32 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={aiInsight.data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="kills" stroke="#facc15" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  <XAxis dataKey="created_at" hide />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#111', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(250,204,21,0.3)',
                      color: '#facc15',
                      fontWeight: 'bold'
                    }} 
                    itemStyle={{ color: '#facc15' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="inline-flex items-center gap-2 text-yellow-500 font-bold text-sm hover:text-yellow-400 transition-colors">
            Launch Deep Analysis <ArrowRight size={16} />
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 blur-xl rounded-full"></div>
          <div className="flex items-center justify-between mb-1 relative z-10">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">AI Skill Rating</span>
            <BarChart3 size={14} className="text-yellow-500" />
          </div>
          <div className="flex items-end gap-2 mt-1 relative z-10">
            <span className="text-2xl font-black text-yellow-500">{user?.stats?.ai_rating || '0'}</span>
            <span className="text-[10px] text-green-400 mb-1 font-bold">+2.4%</span>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-2xl border border-white/5 bg-[#111]">
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Scout Interest</span>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-black text-white">High</span>
            <Users size={14} className="text-yellow-500 mb-1.5" />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Dashboard;
