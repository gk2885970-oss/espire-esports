import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, UploadCloud, Cpu, Crosshair, Crown, 
  Shield, CheckCircle, Image as ImageIcon, Zap, Target 
} from 'lucide-react';

const GAMES = ['BGMI', 'Free Fire', 'Valorant', 'Stumble Guys'];

export default function PointCalc() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedGame, setSelectedGame] = useState('BGMI');
  
  // AI Flow States (Updated with filenames for simulation)
  const [lobbyFile, setLobbyFile] = useState<string | null>(null);
  const [resultFile, setResultFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [lastUpdated, setLastUpdated] = useState('Awaiting match screens...');

  // Refs for file inputs
  const lobbyInputRef = useRef<HTMLInputElement>(null);
  const resultInputRef = useRef<HTMLInputElement>(null);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, team: "Waiting for Data...", kills: '-', points: '-', total: '-' },
  ]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFileState: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileState(file.name); // Store filename for demo
    }
  };

  // --- GAME-SPECIFIC STEP TEXT ---
  const getGameSteps = () => {
    switch(selectedGame) {
      case 'BGMI':
        return {
          step1Title: 'Custom Lobby Screen',
          step1Desc: 'Reads 25 Slots & IGN Configurations',
          step2Title: 'Match Result Screen',
          step2Desc: 'Extracts Kills & Slot Rank'
        };
      case 'Free Fire':
        return {
          step1Title: 'Clash Squad/Battle Lobby',
          step1Desc: 'Maps Slot Numbers & Player Lists',
          step2Title: 'Match End Result',
          step2Desc: 'Reads Positions & Finishing Points'
        };
      case 'Valorant':
        return {
          step1Title: 'Match Lobby (Pre-game)',
          step1Desc: 'Maps Riot IDs (e.g., Name#IND)',
          step2Title: 'Final Scoreboard',
          step2Desc: 'Calculates ACS, KDA & Econ Points'
        };
      case 'Stumble Guys':
        return {
          step1Title: 'Party Room (up to 32 players)',
          step1Desc: 'Creates initial player match state',
          step2Title: 'Round/Elimination Screen',
          step2Desc: 'Tracks Round Qualified or Crown Winner'
        };
      default:
        return {
          step1Title: 'Lobby Setup',
          step1Desc: 'Maps players and slots',
          step2Title: 'End Results',
          step2Desc: 'Kills/Ranks or points'
        };
    }
  };

  const stepsText = getGameSteps();

  // --- AI PROCESSING SIMULATION ---
  const runDeepAnalysis = () => {
    if (!lobbyFile || !resultFile) return;
    
    setIsAnalyzing(true);
    setAnalysisStatus(`[AI Engine] Selected Game: ${selectedGame}. Reading specific UI elements...`);

    // Simulate multi-step processing based on game type
    setTimeout(() => {
      setAnalysisStatus(`[AI Engine] Extracting Player IGNs/Riot IDs from Lobby...`);
    }, 1500);

    setTimeout(() => {
      setAnalysisStatus(`[AI Engine] Cross-referencing results screen with Lobby data using ${selectedGame} rule-set...`);
    }, 3500);
    
    setTimeout(() => {
      let accurateData = [];
      
      // MOCK DATA based on selected game
      if (selectedGame === 'Valorant') {
        accurateData = [
          { rank: 1, team: "Viper#999", kills: 24, points: '320', total: 320 },
          { rank: 2, team: "Jett#IND", kills: 18, points: '260', total: 260 },
          { rank: 3, team: "Sova#SQUAD", kills: 12, points: '190', total: 190 },
        ];
      } else if (selectedGame === 'Stumble Guys') {
        accurateData = [
          { rank: 1, team: "Gamer_Golu", kills: 'Crown', points: 'Winner', total: 50 },
          { rank: 2, team: "ProPlayer", kills: 'Round 3', points: 'Finalist', total: 30 },
          { rank: 3, team: "NinjaBoy", kills: 'Round 2', points: 'Qualified', total: 15 },
        ];
      } else {
        // For Battle Royale like BGMI/Free Fire
        accurateData = [
          { rank: 1, team: "Team ESPIRE", kills: 16, points: 15, total: 31 },
          { rank: 2, team: "GodL Esports", kills: 10, points: 12, total: 22 },
          { rank: 3, team: "Soul Gaming", kills: 8, points: 10, total: 18 },
          { rank: 4, team: "XSpark", kills: 5, points: 8, total: 13 },
        ];
      }

      setLeaderboard(accurateData);
      setIsAnalyzing(false);
      setLobbyFile(null); 
      setResultFile(null);
      setLastUpdated(`Live: ${selectedGame} Verified Scorecard`);
    }, 6000); 
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      
      {/* HEADER: Premium Dark & Yellow Theme */}
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
          
          {/* TEMP ADMIN TOGGLE (Remove in Production) */}
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
                // Reset state when changing game
                setLobbyFile(null);
                setResultFile(null);
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
                <h3 className="text-xs font-black text-white uppercase tracking-widest">{selectedGame} AI OCR Engine</h3>
              </div>

              {isAnalyzing ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
                  <h4 className="text-sm font-bold text-yellow-500 mb-1 animate-pulse">Deep Processing Active</h4>
                  <p className="text-[11px] text-gray-400 px-2 leading-relaxed">{analysisStatus}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  
                  {/* Step 1: Functional Upload */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${lobbyFile ? 'bg-green-500/10 border-green-500/30' : 'bg-[#1a1a1a] border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${lobbyFile ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                        {lobbyFile ? <CheckCircle size={16} /> : <ImageIcon size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Step 1: {stepsText.step1Title}</p>
                        <p className="text-[10px] text-gray-500">{stepsText.step1Desc}</p>
                        {lobbyFile && <p className="text-[9px] text-green-400 mt-0.5 truncate max-w-[150px]">{lobbyFile}</p>}
                      </div>
                    </div>
                    {/* Hidden input field */}
                    <input type="file" accept="image/*" ref={lobbyInputRef} className="hidden" onChange={(e) => handleFileChange(e, setLobbyFile)} />
                    {!lobbyFile && (
                      <button onClick={() => lobbyInputRef.current?.click()} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded-lg text-[10px] font-bold transition-all">
                        Upload
                      </button>
                    )}
                  </div>

                  {/* Step 2: Functional Upload */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${resultFile ? 'bg-green-500/10 border-green-500/30' : 'bg-[#1a1a1a] border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${resultFile ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-gray-400'}`}>
                        {resultFile ? <CheckCircle size={16} /> : <ImageIcon size={16} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Step 2: {stepsText.step2Title}</p>
                        <p className="text-[10px] text-gray-500">{stepsText.step2Desc}</p>
                        {resultFile && <p className="text-[9px] text-green-400 mt-0.5 truncate max-w-[150px]">{resultFile}</p>}
                      </div>
                    </div>
                    {/* Hidden input field */}
                    <input type="file" accept="image/*" ref={resultInputRef} className="hidden" onChange={(e) => handleFileChange(e, setResultFile)} />
                    {!resultFile && (
                      <button onClick={() => resultInputRef.current?.click()} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 rounded-lg text-[10px] font-bold transition-all">
                        Upload
                      </button>
                    )}
                  </div>

                  {/* Run Button */}
                  <button 
                    disabled={!lobbyFile || !resultFile}
                    onClick={runDeepAnalysis}
                    className={`w-full mt-2 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                      lobbyFile && resultFile 
                        ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                        : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Zap size={16} /> Generate Accurate Scorecard
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LIVE TABLE --- */}
      <div className="px-4 py-2 mt-2">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{selectedGame} Standings</h2>
          <span className="text-[9px] text-gray-500 font-bold uppercase">{lastUpdated}</span>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Table Header (Updated to dynamic headers like Valorant ACS) */}
          <div className="grid grid-cols-12 gap-2 bg-[#1a1a1a] p-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">{selectedGame === 'Valorant' ? 'Riot ID (Tag)' : selectedGame === 'Stumble Guys' ? 'Player IGN' : 'Team Name'}</div>
            <div className="col-span-2 text-center">{selectedGame === 'Valorant' || selectedGame === 'Stumble Guys' ? 'Kills' : <Crosshair size={12} className="mx-auto" />}</div>
            <div className="col-span-2 text-center text-yellow-500">{selectedGame === 'Valorant' ? 'ACS' : 'Pts'}</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            <AnimatePresence>
              {leaderboard.map((team, index) => (
                <motion.div
                  key={team.team}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`grid grid-cols-12 gap-2 p-3 items-center border-b border-white/5 last:border-0 ${
                    index === 0 && team.rank !== 1 && team.kills !== '-' ? 'bg-yellow-500/10' : 'hover:bg-[#1a1a1a]'
                  } transition-colors`}
                >
                  <div className="col-span-2 text-center flex justify-center items-center">
                    {index === 0 && team.total !== '-' ? (
                      <Crown size={16} className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                    ) : (
                      <span className="text-xs font-black text-gray-500">
                        {team.total === '-' ? '-' : `#${team.rank}`}
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
          Verified by Espire AI OCR Engine
        </p>
      </div>

    </div>
  );
}
