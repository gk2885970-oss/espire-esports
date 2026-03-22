import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Target, Timer, Trophy, RotateCcw, Play, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useStore } from '../../store';

interface TargetObj {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
}

const AimTrainerGame = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const updateTrainingStats = useStore((state) => state.updateTrainingStats);

  const targetsRef = useRef<TargetObj[]>([]);
  const requestRef = useRef<number>(0);

  const spawnTarget = (canvas: HTMLCanvasElement) => {
    const radius = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 12;
    const speed = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 4;
    
    return {
      id: Math.random(),
      x: Math.random() * (canvas.width - radius * 2) + radius,
      y: Math.random() * (canvas.height - radius * 2) + radius,
      radius,
      color: '#8B5CF6',
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
    };
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setClicks(0);
    setTimeLeft(30);
    targetsRef.current = Array.from({ length: 5 }, () => spawnTarget(canvasRef.current!));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    
    setClicks(prev => prev + 1);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hitIndex = targetsRef.current.findIndex(t => {
      const dist = Math.sqrt((x - t.x) ** 2 + (y - t.y) ** 2);
      return dist < t.radius;
    });

    if (hitIndex !== -1) {
      setScore(prev => prev + 100);
      targetsRef.current[hitIndex] = spawnTarget(canvas);
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('finished');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'finished') {
      const accuracy = clicks > 0 ? Math.round((score / 100 / clicks) * 100) : 0;
      const reactionTime = score > 0 ? Number((30 / (score / 100)).toFixed(2)) : 0; // Rough average reaction time
      
      updateTrainingStats({
        aimScore: score,
        accuracy,
        reactionTime,
        targetsHit: score / 100,
        lastDrill: `Aim Trainer (${difficulty})`,
      });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#D946EF', '#06B6D4']
      });
    }
  }, [gameState, score, clicks, difficulty, updateTrainingStats]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gameState === 'playing') {
        targetsRef.current.forEach(t => {
          // Update position
          t.x += t.speedX;
          t.y += t.speedY;

          // Bounce off walls
          if (t.x - t.radius < 0 || t.x + t.radius > canvas.width) t.speedX *= -1;
          if (t.y - t.radius < 0 || t.y + t.radius > canvas.height) t.speedY *= -1;

          // Draw target
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          ctx.fillStyle = t.color;
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Inner circle
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.radius * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = '#EF4444';
          ctx.fill();
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-background p-4"
    >
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black tracking-tighter uppercase">Aim Trainer</h2>
        <div className="w-10" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-3 rounded-2xl flex flex-col items-center">
          <Trophy size={16} className="text-primary mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Score</span>
          <span className="text-lg font-black">{score}</span>
        </div>
        <div className="glass-card p-3 rounded-2xl flex flex-col items-center">
          <Timer size={16} className="text-secondary mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Time</span>
          <span className="text-lg font-black">{timeLeft}s</span>
        </div>
        <div className="glass-card p-3 rounded-2xl flex flex-col items-center">
          <Target size={16} className="text-accent mb-1" />
          <span className="text-[10px] text-muted-foreground uppercase font-bold">Accuracy</span>
          <span className="text-lg font-black">
            {clicks > 0 ? Math.round((score / 100 / clicks) * 100) : 0}%
          </span>
        </div>
      </div>

      <div className="flex-1 relative glass-card rounded-3xl overflow-hidden border-white/10 bg-black/20 mb-6">
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 32}
          height={window.innerHeight - 400}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <Target size={64} className="text-primary mb-4 animate-pulse" />
            <h3 className="text-2xl font-black mb-6">Ready to train?</h3>
            <div className="flex gap-2 mb-8">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    difficulty === d ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-white/5 text-muted-foreground'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={startGame}
              className="bg-primary hover:bg-primary/80 px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
            >
              <Play size={20} fill="currentColor" />
              Start Session
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <Trophy size={64} className="text-accent mb-4" />
            <h3 className="text-3xl font-black mb-2">Session Complete!</h3>
            <p className="text-muted-foreground mb-8">You scored {score} points with {clicks > 0 ? Math.round((score / 100 / clicks) * 100) : 0}% accuracy.</p>
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="bg-primary px-6 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Retry
              </button>
              <button
                onClick={() => navigate('/training')}
                className="bg-white/10 px-6 py-3 rounded-xl font-bold uppercase tracking-widest"
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AimTrainerGame;
