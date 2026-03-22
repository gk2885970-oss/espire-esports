import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  BarChart3, 
  Target, 
  Zap, 
  Brain, 
  Users,
  ChevronRight
} from 'lucide-react';
import { analyzeGameplayScreenshot } from '../services/geminiService';
import { SkillStats } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const PerformanceAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ analysis: string; skills: SkillStats } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeGameplayScreenshot(image);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const radarData = result ? [
    { subject: 'Aim', A: result.skills.aim, fullMark: 100 },
    { subject: 'Sense', A: result.skills.gameSense, fullMark: 100 },
    { subject: 'Strategy', A: result.skills.strategy, fullMark: 100 },
    { subject: 'Team', A: result.skills.teamwork, fullMark: 100 },
    { subject: 'Speed', A: result.skills.reactionSpeed, fullMark: 100 },
  ] : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 py-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="text-secondary" />
          AI Analysis
        </h2>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-xs bg-muted/50 px-3 py-1.5 rounded-full border border-white/5 font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
        >
          Change Image
        </button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-video glass-card rounded-3xl border-dashed border-2 border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-all group"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload className="text-muted-foreground group-hover:text-primary" size={32} />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Upload Match Screenshot</p>
            <p className="text-xs text-muted-foreground">Upload your end-match stats or gameplay</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img src={image} alt="Gameplay" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/20"></div>
            {!result && !isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={startAnalysis}
                  className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <Zap size={20} />
                  Analyze Performance
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-8 rounded-3xl border-primary/20 flex flex-col items-center justify-center gap-6"
              >
                <div className="relative">
                  <Loader2 className="text-primary animate-spin" size={64} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="text-secondary animate-pulse" size={24} />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold neon-text-purple">AI is Thinking...</h3>
                  <p className="text-sm text-muted-foreground">Analyzing kill feed, positioning, and match stats</p>
                </div>
                <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-10"
              >
                {/* Skill Breakdown Chart */}
                <div className="glass-card p-6 rounded-3xl border-white/5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="text-primary" size={20} />
                    Skill Breakdown
                  </h3>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Radar
                          name="Skills"
                          dataKey="A"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="glass-card p-6 rounded-3xl border-white/5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Brain className="text-secondary" size={20} />
                    AI Insights
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "{result.analysis}"
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/30 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Top Strength</p>
                        <p className="text-sm font-bold text-secondary">Team Coordination</p>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Key Weakness</p>
                        <p className="text-sm font-bold text-accent">Reaction Speed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Training */}
                <div className="glass-card p-6 rounded-3xl border-primary/10 bg-primary/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Zap className="text-primary" size={20} />
                      Recommended Drills
                    </h3>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-background/50 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Target className="text-primary" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Reflex Training V2</p>
                        <p className="text-[10px] text-muted-foreground">15 mins • Aim Training</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-background/50 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                        <Users className="text-secondary" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Map Rotation Drills</p>
                        <p className="text-[10px] text-muted-foreground">10 mins • Strategy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default PerformanceAnalysis;
