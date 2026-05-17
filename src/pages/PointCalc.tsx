import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, UploadCloud, Cpu, Crosshair, Crown, 
  Shield, CheckCircle, Image as ImageIcon, Zap, AlertCircle 
} from 'lucide-react';

const GAMES = ['BGMI', 'Free Fire', 'Valorant', 'Stumble Guys'];

export default function PointCalc() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedGame, setSelectedGame] = useState('BGMI');
  
  // AI Flow States
  const [lobbyUploaded, setLobbyUploaded] = useState(false);
  const [resultUploaded, setResultUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [lastUpdated, setLastUpdated] = useState('Awaiting screenshots...');

  // Universal Data State
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, team: "No Data Uploaded", kills: '-', points: '-', total: '-' },
  ]);

  // Game-wise Deep Analysis Message Handler
  const getAiMessage = () => {
    switch(selectedGame) {
      case 'BGMI': return 'Analyzing 25 Slots & Cross-referencing IGNs...';
      case 'Valorant': return 'Scanning Riot IDs & Calculating ACS/KDA...';
      case 'Stumble Guys': return 'Tracking Round Eliminations & Crown Winner...';
      default: return 'Reading Slot Names (IGNs) & Positions...';
    }
  };

  // --- UNIVERSAL DEEP ANALYSIS ENGINE SIMULATION ---
  const runDeepAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStatus(`[AI Engine] ${getAiMessage()}`);

    setTimeout(() => {
      setAnalysisStatus('[AI Engine] Cross-referencing Lobby data with match statistics...');
    }, 2000);

    setTimeout(() => {
      setAnalysisStatus('[AI Engine] Calculating dynamic algorithm points & applying anti-cheat check...');
    }, 4000);
    
    setTimeout(() => {
      let accurateData = [];
      
      // Dynamic Mock Data according to Game Type
      if (selectedGame === 'Valorant') {
        accurateData = [
          { rank: 1, team: "Viper#999 (MVP)", kills: 26, points: 'ACS: 340', total: 25 },
          { rank: 2, team: "Jett#IND", kills: 19, points: 'ACS: 280', total: 20 },
          { rank: 3, team: "Reyna#OP", kills: 15, points: 'ACS: 210', total: 15 },
        ];
      } else if (selectedGame === 'Stumble Guys') {
        accurateData = [
          { rank: 1, team: "Gamer_Golu", kills: 'Winner', points: 'Crown', total: 50 },
          { rank: 2, team: "NinjaStumble", kills: 'Round 3', points: 'Finalist', total: 30 },
          { rank: 3, team: "ProPlayer", kills: 'Round 2', points: 'Qualified', total: 15 },
        ];
      } else {
        // For BGMI & Free Fire (Squad battle royale style)
        accurateData = [
          { rank: 1, team: "Team ESPIRE", kills: 18, points: 15, total: 33 },
          { rank: 2, team: "GodL Esports", kills: 12, points: 12, total: 24 },
          { rank: 3, team: "Soul Gaming", kills: 8, points: 10, total: 18 },
          { rank: 4, team: "XSpark", kills: 6, points: 8, total: 14 },
        ];
      }

      setLeaderboard(accurateData);
      setIsAnalyzing(false);
      setLobbyUploaded(false); 
      setResultUploaded(false);
      setLastUpdated(`Live: ${selectedGame} Verified Scorecard`);
    }, 6000); 
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      
      {/* HEADER: PREMIUM DARK & YELLOW THEME */}
      <div className="bg-[#111] border-b border-yellow-500/20 px-4 pt-6 pb-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              <Trophy size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-yellow-500 tracking-tight uppercase">PointCalc</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Multi-Game OCR</span>
              </div>
            </div>
          </div>
          
          {/* ADMIN TOGGLE */}
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold uppercase tracking-wider transition-colors ${isAdmin ? 'bg-yellow-500 text-black border-yellow-500' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}
          >
            {isAdmin ? 'Admin View' : 'User View'}
          </button>
        </div>

        {/* GAME TABS */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {GAMES.map(game => (
            <button
              key={game}
              onClick={() => {
                setSelectedGame(game);
                setLeaderboard([{ rank: 1, team: `Waiting for ${game} Upload...`, kills: '-', points: '-', total: '-' }]);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedGame === game 
                  ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]' 
                  : 'bg-[#1a1a1a] text-gray-400 border border-white/5 hover:border-yellow-500/30'
              }`}
            >
              {game}
            </button>
          ))}
        </div>
      </div>

      {/* --- ADMIN DASHBOARD --- */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-4"
          >
            <div className="bg-[#111] border border-yellow-500/30 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={16} className="text-yellow-500" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">{selectedGame} AI Engine</h3>
              </div>

              {isAnalyzing ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
                  <h4 className="text-sm font-bold text-yellow-500 mb-1 animate-pulse">Deep Processing Active</h4>
                  <p className="text-xs text-gray-400 font-medium px-4">{analysisStatus}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${lobbyUploaded ? 'bg-green-500/10 border-green-500/30' : 'bg-[#1a1a1a] border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${lobbyUploaded ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                        <ImageIcon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Step 1: Room/Match Lobby</p>
                        <p className="text-[10px] text-gray-500">Maps player slots & IGN configurations</p>
                      </div>
                    </div>
                    {!lobbyUploaded && (
                      <button onClick={() => setLobbyUploaded(true)} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded-lg text-[10px] font-bold transition-all">
                        Upload
                      </button>
                    )}
                  </div>

                  {/* Step 2 */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${resultUploaded ? 'bg-green-500/10 border-green-500/30' : 'bg-[#1a1a1a] border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${resultUploaded ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                        <ImageIcon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Step 2: Post-Match End Screen</p>
                        <p className="text-[10px] text-gray-500">Extracts points, kills or crown records</p>
                      </div>
                    </div>
                    {!resultUploaded && (
                      <button onClick={() => setResultUploaded(true)} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded-lg text-[10px] font-bold transition-all">
                        Upload
                      </button>
                    )}
                  </div>

                  {/* Run Button */}
                  <button 
                    disabled={!lobbyUploaded || !resultUploaded}
                    onClick={runDeepAnalysis}
                    className={`w-full mt-2 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                      lobbyUploaded && resultUploaded 
                        ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Zap size={16} /> Analyze & Cross-Reference Data
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LIVE TABLE --- */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{selectedGame} Standings</h2>
          <span className="text-[9px] text-gray-500 font-bold uppercase">{lastUpdated}</span>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {/* Dynamic Table Header */}
          <div className="grid grid-cols-12 gap-2 bg-[#1a1a1a] p-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">{selectedGame === 'Valorant' ? 'Player ID' : 'Team Name'}</div>
            <div className="col-span-2 text-center">{selectedGame === 'Valorant' ? 'Kills' : selectedGame === 'Stumble Guys' ? 'Round' : <Crosshair size={12} className="mx-auto" />}</div>
            <div className="col-span-2 text-center text-yellow-500">{selectedGame === 'Valorant' ? 'ACS' : 'Pts'}</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            <AnimatePresence mode="popLayout">
              {leaderboard.map((team, index) => (
                <motion.div
                  key={team.team}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid grid-cols-12 gap-2 p-3 items-center border-b border-white/5 last:border-0 ${
                    index === 0 && team.total !== '-' ? 'bg-yellow-500/10' : 'hover:bg-[#1a1a1a]'
                  } transition-colors`}
                >
                  <div className="col-span-2 text-center flex justify-center items-center">
                    {index === 0 && team.total !== '-' ? (
                      <Crown size={16} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                    ) : (
                      <span className="text-xs font-black text-gray-500">
                        {team.rank === 1 && team.total === '-' ? '-' : `#${team.rank}`}
                      </span>
                    )}
                  </div>
                  
                  <div className="col-span-6 font-bold text-xs text-white truncate pr-2">
                    {team.team}
                  </div>
                  
                  <div className="col-span-2 text-center text-[11px] font-medium text-gray-400">
                    {team.kills}
                  </div>
                  
                  <div className="col-span-2 text-center">
                    <span className={`text-xs font-black ${index === 0 && team.total !== '-' ? 'text-yellow-500' : 'text-white'}`}>
                      {team.total}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Trust Badge */}
      <div className="mx-4 mt-6 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex items-center justify-center gap-2">
        <Shield size={14} className="text-yellow-500" />
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          Secure Cross-Verification Active
        </p>
      </div>

    </div>
  );
}
