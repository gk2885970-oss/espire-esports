import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Zap, Shield, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useStore } from '../store';

const Achievements = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await api.getAchievements(user.uid);
        setAchievements(data);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [user.uid]);

  const getIcon = (title: string) => {
    if (title.includes('Win')) return Trophy;
    if (title.includes('Match')) return Zap;
    if (title.includes('Pro')) return Shield;
    return Star;
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

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
        <h2 className="text-2xl font-black tracking-tighter uppercase">Achievements</h2>
      </div>

      <div className="space-y-4">
        {achievements.map((ach) => {
          const Icon = getIcon(ach.title);
          return (
            <div 
              key={ach.id} 
              className={`glass-card p-4 rounded-3xl border-white/5 flex items-center gap-4 ${!ach.unlocked && 'opacity-60 grayscale'}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center`}>
                <Icon className={ach.unlocked ? "text-primary" : "text-muted-foreground"} size={32} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{ach.title}</h4>
                <p className="text-[10px] text-muted-foreground mb-2">{ach.description}</p>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(ach.progress / ach.unlock_condition) * 100}%` }}
                  />
                </div>
              </div>
              {ach.unlocked ? (
                <CheckCircle2 size={20} className="text-emerald-500" />
              ) : (
                <Lock size={16} className="text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Achievements;
