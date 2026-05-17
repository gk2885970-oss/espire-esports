import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, UploadCloud, Cpu, Crosshair, Crown, Shield, CheckCircle, Image as ImageIcon, Zap, Search, Layers } from 'lucide-react';
// 1. Gemini Library Import
import { GoogleGenerativeAI } from "@google/generative-ai";

// 2. API Key Setup (Yahan apni key dalo)
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY_HERE");

const GAMES = ['BGMI', 'Free Fire', 'Valorant', 'Stumble Guys'];

export default function PointCalc() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedGame, setSelectedGame] = useState('Free Fire');
  const [lobbyFiles, setLobbyFiles] = useState<File[]>([]);
  const [resultFiles, setResultFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [lastUpdated, setLastUpdated] = useState('Awaiting Data...');
  const [leaderboard, setLeaderboard] = useState(Array(12).fill(null).map((_, i) => ({ rank: i + 1, team: `Slot ${i + 1} Leader`, kills: '-', points: '-', total: '-' })));

  const lobbyInputRef = useRef<HTMLInputElement>(null);
  const resultInputRef = useRef<HTMLInputElement>(null);

  // --- ASLI AI ANALYSIS FUNCTION ---
  const handleDeepVerify = async () => {
    if (lobbyFiles.length === 0 || resultFiles.length === 0) return alert("Dono screenshots upload karein!");
    
    setIsAnalyzing(true);
    setAnalysisStatus("[1/3] Reading images with Gemini AI...");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

      setAnalysisStatus("[2/3] Cross-referencing Slots & Kills...");

      const prompt = `You are an Esports Analyst for ${selectedGame}. 
      1. Look at Lobby screenshots, find 12 slots, and identify the FIRST player name of each slot.
      2. Match these leaders with the Result screenshots.
      3. Extract Kills and calculate Points (Rank 1=12pts, 2=10pts, etc.).
      4. Output ONLY a JSON array: [{"rank": 1, "team": "NameFromLobby", "kills": 5, "points": 12, "total": 17}]`;

      const result = await model.generateContent([prompt, ...lobbyParts, ...resultParts]);
      const response = await result.response;
      const text = response.text();

      setAnalysisStatus("[3/3] Finalizing Scoreboard...");

      const cleanedJson = text.replace(/```json|```/g, "").trim();
      const finalData = JSON.parse(cleanedJson);

      setLeaderboard(finalData.sort((a: any, b: any) => b.total - a.total));
      setLastUpdated("100% AI Verified Data");
    } catch (error) {
      console.error(error);
      alert("AI ne reading fail kar di. Photo saaf upload karein.");
    } finally {
      setIsAnalyzing(false);
      setLobbyFiles([]);
      setResultFiles([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24">
      {/* Header aur Tabs pehle jaise hi rahenge */}
      <div className="bg-[#111] border-b border-yellow-500/20 px-4 pt-6 pb-4 sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-xl text-black"><Trophy size={20} /></div>
            <div>
              <h1 className="text-xl font-black text-yellow-500 uppercase tracking-tighter">PointCalc</h1>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Live AI Engine</p>
            </div>
          </div>
          <button onClick={() => setIsAdmin(!isAdmin)} className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold uppercase ${isAdmin ? 'bg-yellow-500 text-black border-yellow-500' : 'border-gray-600 text-gray-400'}`}>
            {isAdmin ? 'Admin View' : 'User View'}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {GAMES.map(game => (
            <button key={game} onClick={() => setSelectedGame(game)} className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold ${selectedGame === game ? 'bg-yellow-500 text-black' : 'bg-[#1a1a1a] text-gray-500'}`}>{game}</button>
          ))}
        </div>
      </div>

      {/* Admin Panel */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="px-4 py-4">
            <div className="bg-[#111] border border-yellow-500/20 rounded-2xl p-4">
              {isAnalyzing ? (
                <div className="py-12 text-center">
                  <Cpu size={40} className="text-yellow-500 animate-spin mx-auto mb-4" />
                  <p className="text-sm font-bold text-yellow-500 animate-pulse">{analysisStatus}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div onClick={() => lobbyInputRef.current?.click()} className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer ${lobbyFiles.length > 0 ? 'border-green-500 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                      <input type="file" ref={lobbyInputRef} className="hidden" multiple onChange={(e) => setLobbyFiles(Array.from(e.target.files || []))} />
                      <ImageIcon className="mb-2 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase">{lobbyFiles.length > 0 ? `${lobbyFiles.length} Lobbies` : 'Upload Lobbies'}</span>
                    </div>
                    <div onClick={() => resultInputRef.current?.click()} className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer ${resultFiles.length > 0 ? 'border-green-500 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                      <input type="file" ref={resultInputRef} className="hidden" multiple onChange={(e) => setResultFiles(Array.from(e.target.files || []))} />
                      <ImageIcon className="mb-2 text-gray-400" />
                      <span className="text-[10px] font-bold uppercase">{resultFiles.length > 0 ? `${resultFiles.length} Results` : 'Upload Results'}</span>
                    </div>
                  </div>
                  <button onClick={handleDeepVerify} className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase ${lobbyFiles.length > 0 && resultFiles.length > 0 ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-600'}`}>
                    <Zap size={18} /> Deep Verify Match Data
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
            <div className="col-span-6">Slot Leader</div>
            <div className="col-span-2 text-center">Kills</div>
            <div className="col-span-2 text-center text-yellow-500">Total</div>
          </div>
          <div className="flex flex-col">
            {leaderboard.map((team, index) => (
              <div key={index} className={`grid grid-cols-12 gap-2 p-4 items-center border-b border-white/5 last:border-0 ${index === 0 && team.total !== '-' ? 'bg-yellow-500/5' : ''}`}>
                <div className="col-span-2 text-center flex justify-center">
                  {index === 0 && team.total !== '-' ? <Crown size={16} className="text-yellow-500" /> : <span className="text-xs font-black text-gray-600">#{team.rank}</span>}
                </div>
                <div className="col-span-6 font-bold text-xs truncate">{team.team}</div>
                <div className="col-span-2 text-center text-xs text-gray-400 font-medium">{team.kills}</div>
                <div className="col-span-2 text-center font-black text-sm text-yellow-500">{team.total}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
