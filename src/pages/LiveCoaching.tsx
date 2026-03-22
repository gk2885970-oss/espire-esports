import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Target, AlertTriangle, Map, Crosshair, ArrowLeft, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveCoaching = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<{ id: number; type: string; message: string; icon: any; color: string }[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const alertTypes = [
    { type: 'ENEMY', message: 'Enemy Spotted: 240 NW', icon: Crosshair, color: 'bg-red-500' },
    { type: 'STRATEGY', message: 'Rotate to Zone: South East', icon: Map, color: 'bg-secondary' },
    { type: 'TACTICAL', message: 'High Ground Advantage: 150m', icon: Zap, color: 'bg-accent' },
    { type: 'WARNING', message: 'Third Party Risk: High', icon: AlertTriangle, color: 'bg-orange-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const newAlert = { ...randomAlert, id: Date.now() };
      setAlerts(prev => [newAlert, ...prev].slice(0, 3));
      
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== newAlert.id));
      }, 5000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Simulated Gameplay Background */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://picsum.photos/seed/gameplay/1920/1080" 
          alt="Gameplay" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* HUD Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col pointer-events-none">
        {/* Top Bar */}
        <div className="flex justify-between items-start pointer-events-auto">
          <button onClick={() => navigate(-1)} className="p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex flex-col items-end gap-2">
            <div className="bg-red-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
              Live Coaching Active
            </div>
            <div className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold">Coach Aryan</span>
              </div>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/50">
                <img src="https://picsum.photos/seed/coach/100/100" alt="Coach" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>

        {/* Center Crosshair Simulation */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-primary/50" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-primary/50" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/50" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-primary/50" />
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
          </div>
        </div>

        {/* Alerts Sidebar */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-4 w-64">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`${alert.color} p-4 rounded-2xl shadow-lg shadow-black/40 flex items-center gap-4 border border-white/20`}
              >
                <div className="bg-white/20 p-2 rounded-xl">
                  <alert.icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{alert.type}</p>
                  <p className="text-xs font-bold text-white">{alert.message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <div className="mt-auto flex justify-center gap-4 pointer-events-auto">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-2xl border border-white/10 backdrop-blur-md transition-all ${isMicOn ? 'bg-black/60 text-white' : 'bg-red-500/80 text-white'}`}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button 
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-2xl border border-white/10 backdrop-blur-md transition-all ${isVideoOn ? 'bg-black/60 text-white' : 'bg-red-500/80 text-white'}`}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button className="bg-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/40">
            Tactical Map
          </button>
        </div>
      </div>

      {/* Mini Map Simulation */}
      <div className="absolute bottom-6 right-6 w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden bg-black/40 backdrop-blur-md">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#8B5CF6]" />
          <div className="absolute top-4 left-10 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <div className="absolute bottom-10 right-8 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        </div>
        <div className="absolute inset-0 border-[1px] border-white/5 grid grid-cols-4 grid-rows-4">
          {Array.from({ length: 16 }).map((_, i) => <div key={i} className="border-[0.5px] border-white/5" />)}
        </div>
      </div>
    </div>
  );
};

export default LiveCoaching;
