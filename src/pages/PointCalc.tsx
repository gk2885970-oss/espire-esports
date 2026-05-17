import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, UploadCloud, Bot, Crosshair, Crown, 
  RefreshCw, Shield, Gamepad2, AlertCircle 
} from 'lucide-react';

// Games List
const GAMES = ['BGMI', 'Free Fire', 'Valorant', 'Stumble Guys'];

export default function PointCalc() {
  // --- STATES ---
  const [isAdmin, setIsAdmin] = useState(false); // FOR DEMO: Toggle to see admin vs user view
  const [selectedGame, setSelectedGame] = useState('BGMI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  
  // Mock Data (AI jab image read karega toh aisa data return karega)
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, team: "Team ESPIRE", kills: 14, points: 25, total: 39 },
    { rank: 2, team: "GodL Esports", kills: 10, points: 15, total: 25 },
    { rank: 3, team: "Soul Gaming", kills: 8, points: 12, total: 20 },
    { rank: 4, team: "Blind Elite", kills: 5, points: 10, total: 15 },
    { rank: 5, team: "XSpark", kills: 3, points: 8, total: 11 },
  ]);

  // --- AI IMAGE PROCESSING SIMULATION ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    // Simulate AI reading the image line-by-line (takes 3 seconds)
    setTimeout(() => {
      // AI extracts new random data for demo
      const aiExtractedData = [
        { rank: 1, team: "GodL Esports", kills: 18, points: 25, total: 43 },
        { rank: 2, team: "Team ESPIRE", kills: 12, points: 15, total: 27 },
        { rank: 3, team: "Soul Gaming", kills: 9, points: 12, total: 21 },
        { rank: 4, team: "Gladiators", kills: 7, points: 10, total: 17 },
        { rank: 5, team: "Blind Elite", kills: 6, points: 8, total: 14 },
      ];
      setLeaderboard(aiExtractedData);
      setIsProcessing(false);
      setLastUpdated('Updated seconds ago');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-20">
      
      {/* HEADER: DARK & YELLOW THEME */}
      <div className="bg-[#111] border-b border-yellow-500/20 px-4 pt-6 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 p-2 rounded-lg">
              <Trophy size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-yellow-500 tracking-tight uppercase">Live Leaderboard</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time Sync</span>
              </div>
            </div>
          </div>
          
          {/* TEMP ADMIN TOGGLE (Remove in production) */}
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`text-[10px] px-2 py-1 rounded border ${isAdmin ? 'border-yellow-500 text-yellow-500' : 'border-gray-600 text-gray-500'}`}
          >
            {isAdmin ? 'Admin Mode' : 'User Mode'}
          </button>
        </div>

        {/* GAME SELECTOR TABS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {GAMES.map(game => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedGame === game 
                  ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                  : 'bg-[#1a1a1a] text-gray-400 border border-white/5 hover:border-yellow-500/30'
              }`}
            >
              {game}
            </button>
          ))}
        </div>
      </div>

      {/* --- ADMIN ONLY: AI OCR UPLOAD SECTION --- */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-4"
          >
            <div className="border-2 border-dashed border-yellow-500/30 bg-yellow-500/5 rounded-2xl p-6 text-center relative overflow-hidden transition-all hover:border-yellow-500/50">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <RefreshCw size={32} className="text-yellow-500 animate-spin mb-3" />
                  <p className="text-sm font-bold text-yellow-400">AI Vision Analyzing...</p>
                  <p className="text-[10px] text-gray-400 mt-1">Reading player names & calculating points line-by-line</p>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Bot size={36} className="text-yellow-500 mx-auto mb-3" />
                  <h3 className="text-sm font-black text-white mb-1">Upload Match Result</h3>
                  <p className="text-[11px] text-gray-400 max-w-[200px] mx-auto">
                    AI will automatically read the screenshot and update the live scoreboard.
                  </p>
                  <div className="mt-4 bg-yellow-500 text-black text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-2">
                    <UploadCloud size={16} /> Select Image
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LIVE SCORECARD TABLE --- */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">{selectedGame} Standings</h2>
          <span className="text-[10px] text-gray-500">{lastUpdated}</span>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 bg-[#1a1a1a] p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-5">Team / Player</div>
            <div className="col-span-2 text-center"><Crosshair size={12} className="mx-auto" /></div>
            <div className="col-span-3 text-center text-yellow-500">Total</div>
          </div>

          {/* Table Rows (Animated) */}
          <div className="flex flex-col">
            <AnimatePresence>
              {leaderboard.map((team, index) => (
                <motion.div
                  key={team.team}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`grid grid-cols-12 gap-2 p-3 items-center border-b border-white/5 last:border-0 ${
                    index === 0 ? 'bg-yellow-500/10' : 'hover:bg-[#1a1a1a]'
                  } transition-colors`}
                >
                  {/* Rank */}
                  <div className="col-span-2 text-center flex justify-center">
                    {index === 0 ? (
                      <Crown size={18} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                    ) : (
                      <span className="text-sm font-black text-gray-500">#{team.rank}</span>
                    )}
                  </div>
                  
                  {/* Name */}
                  <div className="col-span-5 font-bold text-sm text-white truncate pr-2">
                    {team.team}
                  </div>
                  
                  {/* Kills */}
                  <div className="col-span-2 text-center text-xs font-medium text-gray-400">
                    {team.kills}
                  </div>
                  
                  {/* Total Points */}
                  <div className="col-span-3 text-center">
                    <span className={`text-sm font-black ${index === 0 ? 'text-yellow-500' : 'text-white'}`}>
                      {team.total}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Admin Info Banner */}
      {!isAdmin && (
        <div className="mx-4 mt-6 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-start gap-3">
          <Shield size={20} className="text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Scores are updated automatically by <span className="text-yellow-500 font-bold">Espire Vision AI</span> from official match screenshots to ensure 100% accuracy and fairness.
          </p>
        </div>
      )}

    </div>
  );
}
