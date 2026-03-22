import React from 'react';
import { motion } from 'motion/react';
import { Star, Zap, Trophy, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Premium = () => {
  const navigate = useNavigate();

  const features = [
    { id: 1, title: 'Advanced AI Analysis', description: 'Get deep insights into your gameplay.', icon: Zap, color: 'text-primary' },
    { id: 2, title: 'Exclusive Tournaments', description: 'Join high-prize pool events.', icon: Trophy, color: 'text-yellow-500' },
    { id: 3, title: 'Custom Training Drills', description: 'Personalized drills for your skill level.', icon: Star, color: 'text-accent' },
    { id: 4, title: 'Priority Support', description: 'Get help from our expert coaches.', icon: Shield, color: 'text-secondary' },
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
        <h2 className="text-2xl font-black tracking-tighter uppercase">Premium</h2>
      </div>

      <div className="glass-card p-8 rounded-3xl border-primary/30 bg-primary/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Star size={80} className="text-primary" />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-2 tracking-tight">GO PRO</h3>
          <p className="text-sm text-muted-foreground mb-6">Unlock your full potential with Espire Premium.</p>
          <div className="text-4xl font-black mb-1">₹499<span className="text-sm font-medium text-muted-foreground">/month</span></div>
          <button className="w-full bg-primary hover:bg-primary/80 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/40 transition-all active:scale-95">
            Subscribe Now
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Premium Features</h4>
        {features.map((feat) => (
          <div key={feat.id} className="glass-card p-4 rounded-3xl border-white/5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center`}>
              <feat.icon className={feat.color} size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">{feat.title}</h4>
              <p className="text-[10px] text-muted-foreground">{feat.description}</p>
            </div>
            <CheckCircle2 size={20} className="text-primary" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Premium;
