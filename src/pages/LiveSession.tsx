import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Users, 
  User,
  Zap, 
  Cpu,
  Volume2,
  Settings,
  Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveSession = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsConnecting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[60] flex flex-col"
    >
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">LIVE</div>
          <h2 className="font-bold text-sm">Pro Coaching: Advanced Rotations</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={14} />
            <span>1.2k</span>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {isConnecting ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-primary font-bold animate-pulse">Connecting to Coach...</p>
          </div>
        ) : (
          <>
            {/* Coach Stream (Placeholder) */}
            <img 
              src="https://picsum.photos/seed/coach-live/1280/720" 
              alt="Coach Stream" 
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            
            {/* AI Overlay / Data */}
            <div className="absolute top-10 right-6 space-y-3">
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="glass-card p-3 rounded-xl border-primary/30 bg-primary/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Cpu size={14} className="text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase">AI Analysis</span>
                </div>
                <p className="text-[10px] text-white font-medium">Enemy spotted at 240° NW</p>
              </motion.div>
              
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-3 rounded-xl border-secondary/30 bg-secondary/10 backdrop-blur-md"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={14} className="text-secondary" />
                  <span className="text-[10px] font-bold text-secondary uppercase">Strategy</span>
                </div>
                <p className="text-[10px] text-white font-medium">Rotate through South Ridge</p>
              </motion.div>
            </div>

            {/* Self View (Small Overlay) */}
            <div className="absolute bottom-24 right-4 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-muted">
              {isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <User size={24} className="text-muted-foreground" />
                </div>
              ) : (
                <img 
                  src="https://picsum.photos/seed/user-cam/200/300" 
                  alt="Self" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="absolute bottom-1 left-1 bg-black/40 px-1 rounded text-[8px]">You</div>
            </div>
          </>
        )}
      </div>

      {/* Controls Bar */}
      <div className="p-6 bg-gradient-to-t from-black to-transparent flex items-center justify-center gap-6">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={() => navigate(-1)}
          className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all active:scale-90"
        >
          <PhoneOff size={28} />
        </button>

        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button 
          onClick={() => setShowChat(!showChat)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${showChat ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'}`}
        >
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Chat Overlay */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-24 left-4 right-4 h-64 glass-card rounded-3xl border-white/10 flex flex-col overflow-hidden z-50"
          >
            <div className="p-3 border-bottom border-white/5 bg-white/5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest">Live Chat</span>
              <button onClick={() => setShowChat(false)} className="text-muted-foreground">×</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-[11px]">
              <p><span className="text-primary font-bold">GamerX:</span> How to control AKM recoil?</p>
              <p><span className="text-secondary font-bold">Coach:</span> Pull down slightly and to the left.</p>
              <p><span className="text-accent font-bold">Legend:</span> This rotation is insane!</p>
            </div>
            <div className="p-2 bg-black/40">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiveSession;
