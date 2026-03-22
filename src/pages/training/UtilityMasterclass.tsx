import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UtilityMasterclass = () => {
  const navigate = useNavigate();

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
        <h2 className="text-2xl font-black tracking-tighter uppercase">Utility Masterclass</h2>
      </div>

      <div className="glass-card p-8 rounded-3xl border-accent/20 bg-accent/5 text-center">
        <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap size={40} className="text-accent" />
        </div>
        <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground mb-6">
          Master grenades, smokes, and flashes to control the battlefield.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-accent text-black px-6 py-3 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-accent/20"
        >
          Go Back
        </button>
      </div>
    </motion.div>
  );
};

export default UtilityMasterclass;
