import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Map, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ZonePrediction = () => {
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
        <h2 className="text-2xl font-black tracking-tighter uppercase">Zone Prediction</h2>
      </div>

      <div className="glass-card p-8 rounded-3xl border-secondary/20 bg-secondary/5 text-center">
        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Map size={40} className="text-secondary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground mb-6">
          Learn how to read the map and predict final circles like a pro analyst.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="bg-secondary text-white px-6 py-3 rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-secondary/20"
        >
          Go Back
        </button>
      </div>
    </motion.div>
  );
};

export default ZonePrediction;
