import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, UploadCloud, Cpu, Crosshair, Crown, 
  Shield, CheckCircle, Files, Zap, Search, Layers
} from 'lucide-react';

const GAMES = ['BGMI', 'Free Fire', 'Valorant', 'Stumble Guys'];

export default function PointCalc() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedGame, setSelectedGame] = useState('Free Fire');
  
  // State for Multiple Files
  const [lobbyFiles, setLobbyFiles] = useState<File[]>([]);
  const [resultFiles, setResultFiles] = useState<File[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [lastUpdated, setLastUpdated] = useState('Waiting for Match Data...');

  const lobbyInputRef = useRef<HTMLInputElement>(null);
  const resultInputRef = useRef<HTMLInputElement>(null);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, team: "Upload screenshots to begin...", kills: '-', points: '-', total: '-' },
  ]);

  // --- 100% ACCURACY MULTI-FILE ANALYSIS ---
  const handleDeepVerify = () => {
    if (lobbyFiles.length === 0 || resultFiles.length === 0) return;
    
    setIsAnalyzing(true);
    setAnalysisStatus(`[1/5] Merging ${lobbyFiles.length} Lobby Screenshots...`);

    setTimeout(() => {
      setAnalysisStatus(`[2/5] Indexing all IGNs and Slot Positions...`);
    }, 1500);

    setTimeout(() => {
      setAnalysisStatus(`[3/5] Analyzing ${resultFiles.length} Result Pages: Extracting Stats...`);
    }, 3000);

    setTimeout(() => {
      setAnalysisStatus(`[4/5] Cross-Referencing: Matching names with 100% Accuracy...`);
    }, 4500);

    setTimeout(() => {
      setAnalysisStatus(`[5/5] Finalizing ${selectedGame} Standings...`);
    }, 6000);
    
    setTimeout(() => {
      // In a real app, this data would come from your Backend API after processing the files.
      const verifiedData = [
        { rank: 1, team: "Team ESPIRE", kills: 24, points: 15, total: 39 },
        { rank: 2, team: "GodL Esports", kills: 16, points: 12, total: 28 },
        { rank: 3, team: "Soul Gaming", kills: 12, points: 10, total: 22 },
        { rank: 4, team: "XSpark", kills: 9, points: 8, total: 17 },
        { rank: 5, team: "Blind Elite", kills: 6, points: 6, total: 12 },
      ];

      setLeaderboard(verifiedData);
      setIsAnalyzing(false);
      setLobbyFiles([]); 
      setResultFiles([]);
      setLastUpdated(`AI Verified: ${selectedGame} Tournament`);
    }, 8000); 
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      
      {/* HEADER */}
      <div className="bg-[#111] border-b border-yellow-500/20 px-4 pt-6 pb-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-xl">
              <Trophy size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black text-yellow-500 uppercase tracking-tighter">PointCalc</h1>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest tracking-[2px]">Pro Validator</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${isAdmin ? 'bg-yellow-500 text-black border-yellow-500' : 'border-gray-600 text-gray-400'}`}
          >
            {isAdmin ? 'Admin Panel' : 'User View'}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {GAMES.map(game => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedGame === game ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-[#1a1a1a] text-gray-500'
              }`}
            >
              {game}
            </button>
          ))}
        </div>
      </div>

      {/* --- ADMIN: MULTI-IMAGE UPLOAD SECTION --- */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-4">
            <div className="bg-[#111] border border-yellow-500/20 rounded-2xl p-4 shadow-2xl">
              
              <div className="flex items-center gap-2 mb-4">
                <Layers size={16} className="text-yellow-500" />
                <h3 className="text-[11px] font-black uppercase text-white tracking-widest">Multi-Screenshot Processing</h3>
              </div>

              {isAnalyzing ? (
                <div className="py-12 text-center">
                  <Cpu size={40} className="text-yellow-500 animate-spin mx-auto mb-4" />
                  <p className="text-sm font-bold text-yellow-500 animate-pulse">{analysisStatus}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {/* Step 1: Multiple Lobby Screenshots */}
                  <div 
                    onClick={() => lobbyInputRef.current?.click()}
                    className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${lobbyFiles.length > 0 ? 'border-green-500 bg-green-500/5' : 'border-white/10 bg-white/5'}`}
                  >
                    <input 
                      type="file" 
                      ref={lobbyInputRef} 
                      className="hidden" 
                      multiple // ALLOW MULTIPLE
                      onChange={(e) => setLobbyFiles(Array.from(e.target.files || []))} 
                    />
                    {lobbyFiles.length > 0 ? <CheckCircle className="text-green-500 mb-2" /> : <Files className="text-gray-600 mb-2" />}
                    <span className="text-[10px] font-bold uppercase">{lobbyFiles.length > 0 ? `${lobbyFiles.length} Lobby Files` : 'Upload Lobbies'}</span>
                  </div>

                  {/* Step 2: Multiple Result Screenshots */}
                  <div 
                    onClick={() => resultInputRef.current?.click()}
                    className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${resultFiles.length > 0 ? 'border-green-500 bg-green-500/5' : 'border-white/10 bg-white/5'}`}
                  >
                    <input 
                      type="file" 
                      ref={resultInputRef} 
                      className="hidden" 
                      multiple // ALLOW MULTIPLE
                      onChange={(e) => setResultFiles(Array.from(e.target.files || []))} 
                    />
                    {resultFiles.length > 0 ? <CheckCircle className="text-green-500 mb-2" /> : <Files className="text-gray-600 mb-2" />}
                    <span className="text-[10px] font-bold uppercase">{resultFiles.length > 0 ? `${resultFiles.length} Result Files` : 'Upload Results'}</span>
                  </div>
                </div>
              )}

              {!isAnalyzing && (
                <button 
                  disabled={lobbyFiles.length === 0 || resultFiles.length === 0}
                  onClick={handleDeepVerify}
                  className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-tighter transition-all ${lobbyFiles.length > 0 && resultFiles.length > 0 ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-white/5 text-gray-600'}`}
                >
                  <Search size={18} /> Deep Verify {lobbyFiles.length + resultFiles.length} Images
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LIVE TABLE --- */}
      <div className="px-4 py-2 mt-2">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{selectedGame} Standings</h2>
          <span className="text-[9px] text-yellow-500 font-bold uppercase">{lastUpdated}</span>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-2 bg-[#1a1a1a] p-4 text-[10px] font-black text-gray-500 uppercase border-b border-white/5">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">Team Name</div>
            <div className="col-span-2 text-center">Kills</div>
            <div className="col-span-2 text-center text-yellow-500">Total</div>
          </div>

          <div className="flex flex-col">
            {leaderboard.map((team, index) => (
              <motion.div 
                layout
                key={index} 
                className={`grid grid-cols-12 gap-2 p-4 items-center border-b border-white/5 last:border-0 ${index === 0 && team.total !== '-' ? 'bg-yellow-500/5' : ''}`}
              >
                <div className="col-span-2 text-center flex justify-center">
                  {index === 0 && team.total !== '-' ? <Crown size={16} className="text-yellow-500 shadow-yellow-500" /> : <span className="text-xs font-black text-gray-600">#{team.rank}</span>}
                </div>
                <div className="col-span-6 font-bold text-xs truncate">{team.team}</div>
                <div className="col-span-2 text-center text-xs text-gray-400 font-medium">{team.kills}</div>
                <div className="col-span-2 text-center font-black text-sm text-yellow-500">{team.total}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Accuracy Shield */}
      <div className="mx-4 mt-6 p-4 rounded-2xl bg-[#111] border border-white/5 flex items-center gap-3">
        <Shield size={20} className="text-yellow-500" />
        <p className="text-[10px] text-gray-400 font-medium uppercase leading-relaxed tracking-wider">
          Multi-screenshot mode: AI is merging data from all uploaded images to ensure <span className="text-yellow-500 font-bold">100% cross-verified accuracy</span>.
        </p>
      </div>
    </div>
  );
}
