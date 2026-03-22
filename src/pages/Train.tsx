import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Target, 
  Brain, 
  Users, 
  MessageSquare, 
  Play, 
  Star, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Zap,
  Map,
  Compass,
  Cpu,
  Shield,
  BarChart2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AIRecommended from '../components/AIRecommended';
import { TrainingModule, TrainingModuleType } from '../types/training';
import { useStore } from '../store';
import { aiCoachService } from '../services/aiCoachService';

const Train = () => {
  const navigate = useNavigate();
  const { user, trainingStats } = useStore();

  // Get AI Recommendations
  const recommendations = useMemo(() => 
    aiCoachService.getRecommendations(user, trainingStats),
    [user, trainingStats]
  );

  // Scalable Module Model
  const trainingModules: TrainingModule[] = [
    { 
      id: 'aim-trainer', 
      title: 'Aim Trainer', 
      description: 'Master your precision and flick shots.', 
      iconName: 'Target', 
      type: TrainingModuleType.AIM_TRAINER, 
      path: '/training/aim-trainer', 
      lessonCount: 24, 
      color: 'text-primary', 
      bg: 'bg-primary/20' 
    },
    { 
      id: 'close-range', 
      title: 'Close Range', 
      description: 'Master hip-fire and tracking in close combat.', 
      iconName: 'Zap', 
      type: TrainingModuleType.CLOSE_RANGE, 
      path: '/training/close-range', 
      lessonCount: 12, 
      color: 'text-secondary', 
      bg: 'bg-secondary/20' 
    },
    { 
      id: 'zone-prediction', 
      title: 'Zone Prediction', 
      description: 'Predict final circles like a pro analyst.', 
      iconName: 'Map', 
      type: TrainingModuleType.ZONE_PREDICTION, 
      path: '/training/zone-prediction', 
      lessonCount: 8, 
      color: 'text-accent', 
      bg: 'bg-accent/20' 
    },
    { 
      id: 'utility-master', 
      title: 'Utility Master', 
      description: 'Master grenades, smokes, and flashes.', 
      iconName: 'Compass', 
      type: TrainingModuleType.UTILITY_MASTER, 
      path: '/training/utility-master', 
      lessonCount: 15, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/20' 
    },
    { 
      id: 'game-sense', 
      title: 'Game Sense', 
      description: 'Improve your situational awareness.', 
      iconName: 'Brain', 
      type: TrainingModuleType.GAME_SENSE, 
      path: '/training/game-sense', 
      lessonCount: 18, 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/20' 
    },
    { 
      id: 'live-coaching', 
      title: 'Live Coaching', 
      description: '1-on-1 sessions with pro coaches.', 
      iconName: 'Users', 
      type: TrainingModuleType.LIVE_COACHING, 
      path: '/live-coaching', 
      lessonCount: 5, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/20' 
    },
    { 
      id: 'analytics', 
      title: 'Analytics', 
      description: 'Deep dive into your performance stats.', 
      iconName: 'BarChart2', 
      type: TrainingModuleType.ANALYTICS, 
      path: '/performance', 
      lessonCount: 1, 
      color: 'text-pink-500', 
      bg: 'bg-pink-500/20' 
    },
  ];

  // Dynamic Navigation Logic (TrainingNavigator pattern)
  const navigateToModule = (module: TrainingModule) => {
    if (module.path && module.path !== '#') {
      navigate(module.path);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Target': return Target;
      case 'Zap': return Zap;
      case 'Map': return Map;
      case 'Compass': return Compass;
      case 'Brain': return Brain;
      case 'Users': return Users;
      case 'BarChart2': return BarChart2;
      default: return BookOpen;
    }
  };

  const featuredLessons = [
    { id: '1', title: 'Perfecting Your Spray', category: 'Aim Training', level: 'Intermediate', duration: '12m', views: '12.4k', thumb: 'https://picsum.photos/seed/aim/400/225' },
    { id: '2', title: 'Map Control Strategies', category: 'Strategy', level: 'Advanced', duration: '20m', views: '8.2k', thumb: 'https://picsum.photos/seed/strat/400/225' },
    { id: '3', title: 'Clutch Situations', category: 'Game Sense', level: 'Beginner', duration: '15m', views: '15.1k', thumb: 'https://picsum.photos/seed/sense/400/225' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 py-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="text-primary" />
          Training Hub
        </h2>
        <Link to="/performance" className="text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-full font-bold uppercase tracking-widest border border-primary/30">
          Analyze My Stats
        </Link>
      </div>

      {/* Live Classes Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            Live Classes
          </h3>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">3 Active Now</span>
        </div>
        <div className="space-y-4">
          <Link to="/live-session" className="block glass-card p-4 rounded-3xl border-red-500/20 bg-red-500/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Zap size={60} className="text-red-500" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative">
                <img src="https://picsum.photos/seed/live1/200/200" alt="Live" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play size={20} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">Live</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">1.2k Watching</span>
                </div>
                <h4 className="font-bold text-sm">Advanced Rotations & Zone Prediction</h4>
                <p className="text-[10px] text-muted-foreground">Coach: Legend_Aryan</p>
              </div>
              <ChevronRight className="text-muted-foreground group-hover:text-red-500 transition-colors" />
            </div>
          </Link>
        </div>
      </section>

      {/* AI Recommended Section */}
      <AIRecommended />

      {/* Categories Grid */}
      <section>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Training Modules</h3>
        <div className="grid grid-cols-2 gap-4">
          {trainingModules.map(module => {
            const Icon = getIcon(module.iconName);
            return (
              <div 
                key={module.id} 
                onClick={() => navigateToModule(module)}
                className="glass-card p-4 rounded-2xl border-white/5 hover:border-primary/30 transition-all cursor-pointer group active:scale-95"
              >
                <div className={`w-10 h-10 ${module.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={module.color} size={20} />
                </div>
                <h4 className="font-bold text-sm mb-1">{module.title}</h4>
                <p className="text-[10px] text-muted-foreground">{module.lessonCount} Lessons</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Practice Plan */}
      <section className="glass-card p-6 rounded-3xl border-secondary/20 bg-secondary/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Weekly Practice Plan</h3>
            <p className="text-xs text-muted-foreground">Personalized for your current level</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-muted flex items-center justify-center relative">
            <span className="text-xs font-bold">4/7</span>
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-secondary" strokeDasharray="125.6" strokeDashoffset="50.24" />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          <div 
            onClick={() => navigate('/training/aim-trainer')}
            className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-white/5 cursor-pointer hover:border-primary/50 transition-all group"
          >
            <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
            <p className="text-sm font-medium group-hover:text-primary transition-colors">Daily Aim Drill (15 mins)</p>
            <ChevronRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl border border-white/5 opacity-60">
            <div className="w-2 h-2 rounded-full bg-muted"></div>
            <p className="text-sm font-medium">Reaction Speed Test</p>
            <ChevronRight size={16} className="ml-auto text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Featured Lessons */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Featured Lessons</h3>
          <Link to="#" className="text-xs text-muted-foreground font-bold uppercase tracking-widest">View All</Link>
        </div>
        <div className="space-y-4">
          {featuredLessons.map(lesson => (
            <div 
              key={lesson.id} 
              onClick={() => navigate(`/training/drill/${lesson.id}`)}
              className="glass-card flex gap-4 p-3 rounded-2xl border-white/5 group cursor-pointer"
            >
              <div className="w-32 aspect-video rounded-xl overflow-hidden relative flex-shrink-0">
                <img src={lesson.thumb} alt={lesson.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <Play size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[8px] font-bold">{lesson.duration}</div>
              </div>
              <div className="flex flex-col justify-between py-1">
                <div>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{lesson.category}</p>
                  <h4 className="font-bold text-sm leading-tight mb-1">{lesson.title}</h4>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span className="text-[10px]">{lesson.level}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-secondary text-secondary" />
                    <span className="text-[10px]">{lesson.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default Train;
