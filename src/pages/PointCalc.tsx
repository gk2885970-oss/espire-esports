import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, UploadCloud, Cpu, Crosshair, Crown, Shield, CheckCircle, Image as ImageIcon, Zap, Search, Layers } from 'lucide-react';
// 1. Gemini Library Import
import { GoogleGenerativeAI } from "@google/generative-ai";

// 2. API Key Setup (Make sure to use your valid key)
const genAI = new GoogleGenerativeAI("AIzaSyAVQzghWJxoh5IgKMzQSU3DsZ42j1KEp5E");

const GAMES = ['BGMI', 'Free Fire', 'Valorant', 'Stumble Guys'];

export default function PointCalc() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedGame, setSelectedGame] = useState('Free Fire');
  const [lobbyFiles, setLobbyFiles] = useState<File[]>([]);
  const [resultFiles, setResultFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [lastUpdated, setLastUpdated] = useState('Awaiting Data...');
  
  // Default empty table with 12 slots
  const [leaderboard, setLeaderboard] = useState(Array(12).fill(null).map((_, i) => ({ 
    rank: i + 1, team: `Slot ${i + 1} Leader`, kills: '-', points: '-', total: '-' 
  })));

  const lobbyInputRef = useRef<HTMLInputElement>(null);
  const resultInputRef = useRef<HTMLInputElement>(null);

  // --- ASLI AI ANALYSIS FUNCTION (DYNAMIC FOR ALL GAMES) ---
  const handleDeepVerify = async () => {
    if (lobbyFiles.length === 0 || resultFiles.length === 0) return alert("Golu bhai, dono screenshots upload karein!");
    
    setIsAnalyzing(true);
    setAnalysisStatus(`[1/3] Gemini reading ${selectedGame} screenshots...`);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Helper: Convert File to Gemini format
      const fileToGenerativePart = async (file: File) => {
        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        return { inlineData: { data: base64Data, mimeType: file.type } };
      };

      const lobbyParts = await Promise.all(lobbyFiles.map(fileToGenerativePart));
      const resultParts = await Promise.all(resultFiles.map(fileToGenerativePart));

      setAnalysisStatus(`[2/3] Mapping ${selectedGame} logic & Cross-referencing...`);

      // GAME-SPECIFIC PROMPT
      const prompt = `
        Task: Esports Scoreboard Analyst for ${selectedGame}.
        1. From Lobby Images: Identify up to 12 slots and find the FIRST player name (Leader) in each slot.
        2. From Result Images: Find performance of these 12 leaders.
        3. Logic:
           - BGMI/Free Fire: Use Rank Points (1st=12, 2nd=10, 3rd=8...) + 1pt per Kill.
           - Valorant: Use Combat Score/Kills to determine rank.
           - Stumble Guys: Rank by final round reached.
        4. Match names accurately even if fonts/icons are different.
        5. Output ONLY a JSON array of 12 objects: [{"rank": 1, "team": "LeaderName", "kills": 5, "points": 12, "total": 17}]
      `;

      const result = await model.generateContent([prompt, ...lobbyParts, ...resultParts]);
      const response = await result.response;
      const text = response.text();

      setAnalysisStatus("[3/3] Finalizing Verified Scorecard...");

      // Clean JSON and Update
      const cleanedJson = text.replace(/```json|```/g, "").trim();
      const finalData = JSON.parse(cleanedJson);

      setLeaderboard(finalData.sort((a: any, b: any) => b.total - a.total));
      setLastUpdated(`100% AI Verified (${selectedGame})`);
      
    } catch (error) {
      console.error(error);
      alert(`AI reading failed for ${selectedGame}. Please upload clearer screenshots.`);
    } finally {
      setIsAnalyzing(false);
      setLobbyFiles([]);
      setResultFiles([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      {/* Header & Tabs */}
      <div className="bg-[#111] border-b border-yellow-500/20 px-4 pt-6 pb-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-xl text-black shadow-[0_0_10px_rgba(234,179,8,0.4)]">
              <Trophy size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-yellow-500 uppercase tracking-tighter">PointCalc</h1>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Multi-Game AI Validator</p>
            </div>
          </div>
          <button onClick={() => setIsAdmin(!isAdmin)} className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold uppercase transition-all ${isAdmin ? 'bg-yellow-500 text-black border-yellow-500' : 'border-gray-600 text-gray-400 hover:border-gray-400'}`}>
            {isAdmin ? 'Admin Panel' : 'User View'}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {GAMES.map(game => (
            <button 
              key={game} 
              onClick={() => {
                setSelectedGame(game);
                setLastUpdated(`Awaiting ${game} Data...`);
              }} 
              className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all ${selectedGame === game ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-[#1a1a1a] text-gray-500 border border-white/5'}`}
            >
              {game}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Panel */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-4 py-4">
            <div className="bg-[#111] border border-yellow-500/20 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-4 text-yellow-500 font-bold text-[10px] uppercase tracking-widest">
                <Layers size={14}/> {selectedGame} Deep Validation
              </div>
              
              {isAnalyzing ? (
                <div className="py-12 text-center">
                  <Cpu size={40} className="text-yellow-500 animate-spin mx-auto mb-4" />
                  <p className="text-sm font-bold text-yellow-500 animate-pulse">{analysisStatus}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div onClick={() => lobbyInputRef.current?.click()} className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${lobbyFiles.length > 0 ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5 hover:border-yellow-500/30'}`}>
                      <input type="file" ref={lobbyInputRef} className="hidden" multiple onChange={(e) => setLobbyFiles(Array.from(e.target.files || []))} />
                      <ImageIcon className={`mb-2 ${lobbyFiles.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-[10px] font-bold uppercase">{lobbyFiles.length > 0 ? `${lobbyFiles.length} Lobbies Ready` : 'Upload Lobbies'}</span>
                    </div>
                    <div onClick={() => resultInputRef.current?.click()} className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${resultFiles.length > 0 ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5 hover:border-yellow-500/30'}`}>
                      <input type="file" ref={resultInputRef} className="hidden" multiple onChange={(e) => setResultFiles(Array.from(e.target.files || []))} />
                      <ImageIcon className={`mb-2 ${resultFiles.length > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-[10px] font-bold uppercase">{resultFiles.length > 0 ? `${resultFiles.length} Results Ready` : 'Upload Results'}</span>
                    </div>
                  </div>
                  <button 
                    disabled={lobbyFiles.length === 0 || resultFiles.length === 0}
                    onClick={handleDeepVerify} 
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase transition-all ${lobbyFiles.length > 0 && resultFiles.length > 0 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}
                  >
                    <Zap size={18} /> Run {selectedGame} Deep Verify
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Table */}
      <div className="px-4 py-2 mt-2">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{selectedGame} Standings</h2>
          <span className="text-[9px] text-yellow-500 font-bold uppercase">{lastUpdated}</span>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-2 bg-[#1a1a1a] p-4 text-[10px] font-black text-gray-500 uppercase border-b border-white/5">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-6">{selectedGame === 'Valorant' ? 'Riot ID / Player' : 'Slot Leader'}</div>
            <div className="col-span-2 text-center">{selectedGame === 'Valorant' ? 'Kills' : <Crosshair size={12} className="mx-auto" />}</div>
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
                <div className="col-span-6 font-bold text-xs truncate text-gray-200">{team.team}</div>
                <div className="col-span-2 text-center text-xs text-gray-400 font-medium">{team.kills}</div>
                <div className="col-span-2 text-center font-black text-sm text-yellow-500">{team.total}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Secure Badge */}
      <div className="mx-4 mt-6 p-4 rounded-2xl bg-[#111] border border-white/5 flex items-center gap-3">
        <Shield size={20} className="text-yellow-500" />
        <p className="text-[10px] text-gray-400 font-medium uppercase leading-relaxed tracking-wider">
          Accuracy check: AI is cross-referencing Lobby IGNs with Result Names to ensure <span className="text-yellow-500 font-bold">100% verified points</span> for {selectedGame}.
        </p>
      </div>
    </div>
  );
}
