import React from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, Lock, Eye, Bell, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  const settings = [
    { id: 'profile', title: 'Public Profile', description: 'Allow others to see your stats.', icon: Eye, enabled: true },
    { id: 'data', title: 'Data Collection', description: 'Allow AI to analyze your gameplay.', icon: Lock, enabled: true },
    { id: 'notif', title: 'Notifications', description: 'Receive tournament alerts.', icon: Bell, enabled: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 py-4"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tighter uppercase">Privacy & Security</h2>
      </div>

      <div className="space-y-4">
        {settings.map((set) => (
          <div key={set.id} className="glass-card p-4 rounded-3xl border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                <set.icon className="text-primary" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm">{set.title}</h4>
                <p className="text-[10px] text-muted-foreground">{set.description}</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${set.enabled ? 'bg-primary' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${set.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 p-4 glass-card rounded-2xl border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors">
        <Trash2 size={18} />
        <span className="text-sm font-bold uppercase tracking-widest">Delete Account</span>
      </button>
    </motion.div>
  );
};

export default Privacy;
