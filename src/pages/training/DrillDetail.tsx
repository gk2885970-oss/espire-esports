import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Play, Clock, Star, Trophy, Target, Zap, Shield } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const DrillDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock drill data
  const drill = {
    id: id || '1',
    title: 'Perfecting Your Spray',
    category: 'Aim Training',
    level: 'Intermediate',
    duration: '12m',
    description: 'Master the recoil patterns of various weapons in BGMI and Valorant. This drill focuses on vertical and horizontal spray control at medium range.',
    videoUrl: 'https://picsum.photos/seed/drill-video/800/450',
    objectives: [
      'Maintain 80% accuracy on static targets',
      'Control recoil for 30-round bursts',
      'Switch between targets while spraying'
    ]
  };

  // Dynamic navigation based on drill ID or category
  const startTraining = () => {
    // Map specific drills to their respective modules
    const moduleMap: Record<string, string> = {
      'close-range': 'close-range',
      'flick-shots': 'aim-trainer',
      'recoil-control': 'aim-trainer',
      'zone-prediction': 'zone-prediction',
      'utility-master': 'utility-master'
    };

    const targetModule = moduleMap[id || ''] || 'aim-trainer';
    navigate(`/training/${targetModule}`);
  };

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
        <h2 className="text-xl font-black tracking-tighter uppercase">Drill Details</h2>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border-white/5">
        <div className="aspect-video relative">
          <img src={drill.videoUrl} alt={drill.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
              <Play size={32} className="text-white ml-1" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{drill.category}</span>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold uppercase">{drill.level}</span>
          </div>
          <h3 className="text-2xl font-black mb-3">{drill.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {drill.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-secondary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Duration</p>
                <p className="text-sm font-bold">{drill.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy size={18} className="text-accent" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">XP Reward</p>
                <p className="text-sm font-bold">250 XP</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-bold uppercase tracking-widest">Objectives</h4>
            {drill.objectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">{obj}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={startTraining}
            className="w-full bg-primary hover:bg-primary/80 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play size={20} fill="currentColor" />
            Start Training Session
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DrillDetail;
