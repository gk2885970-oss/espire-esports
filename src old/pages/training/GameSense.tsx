import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Brain, Play, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GameSense = () => {
  const navigate = useNavigate();

  const drills = [
    { id: 'zone-pred', title: 'Zone Prediction', duration: '15m', difficulty: 'Intermediate', rating: 4.8 },
    { id: 'sound-loc', title: 'Sound Localization', duration: '10m', difficulty: 'Advanced', rating: 4.9 },
    { id: 'clutch-play', title: 'Clutch Situation Mastery', duration: '20m', difficulty: 'Beginner', rating: 4.7 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 py-4 pb-24"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
          <Brain className="text-secondary" />
          Game Sense
        </h2>
      </div>

      <div className="space-y-4">
        {drills.map((drill) => (
          <div 
            key={drill.id}
            onClick={() => navigate(`/training/drill/${drill.id}`)}
            className="glass-card p-4 rounded-3xl border-white/5 hover:border-secondary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-lg">{drill.title}</h4>
              <Play size={16} className="text-secondary group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span className="text-[10px] font-bold uppercase">{drill.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-secondary fill-secondary" />
                <span className="text-[10px] font-bold uppercase">{drill.rating}</span>
              </div>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded font-bold uppercase">{drill.difficulty}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GameSense;
