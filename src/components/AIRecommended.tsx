import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { aiCoachService, Recommendation } from '../services/aiCoachService';
import { useStore } from '../store';

const AIRecommended = () => {
  const navigate = useNavigate();
  const { user, trainingStats } = useStore();
  const [loadingRecs, setLoadingRecs] = useState(true);

  const recommendations = useMemo(() => 
    aiCoachService.getRecommendations(user, trainingStats),
    [user, trainingStats]
  );

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoadingRecs(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="text-accent" size={20} />
          AI Recommended
        </h3>
        <button className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest hover:text-accent transition-colors">Refresh</button>
      </div>
      
      {loadingRecs ? (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-64 h-32 glass-card rounded-3xl animate-pulse bg-white/5 flex-shrink-0" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {recommendations.map((rec) => {
            const module = aiCoachService.getModuleData(rec.moduleId);
            if (!module) return null;

            return (
              <div 
                key={rec.moduleId} 
                onClick={() => navigate(module.path)}
                className="w-64 glass-card p-4 rounded-3xl border-accent/20 bg-accent/5 flex-shrink-0 relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
              >
                <div className="absolute -top-2 -right-2 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles size={40} className="text-accent" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] bg-accent text-black px-1.5 py-0.5 rounded font-black uppercase">{module.title}</span>
                    <span className="text-[8px] text-muted-foreground font-bold uppercase">{rec.priority} priority</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{module.title}</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight mb-3">{rec.reason}</p>
                  <button className="w-full py-2 bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-accent group-hover:text-black transition-all">
                    Start Drill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AIRecommended;
