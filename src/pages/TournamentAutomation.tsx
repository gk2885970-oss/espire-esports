import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Users,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TournamentBracket, Match } from '../types';
import { useStore } from '../store';
import confetti from 'canvas-confetti';
import { api } from '../api';

const TournamentAutomation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeRound, setActiveRound] = useState(0);
  const { trackMatch, user } = useStore();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;
      try {
        const data = await api.getTournamentById(id);
        setTournament(data);
      } catch (error) {
        console.error('Failed to fetch tournament:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [id]);

  const handlePlayMatch = async (match: Match) => {
    // Simulate a match result
    const kills = Math.floor(Math.random() * 10) + 2;
    const placement = Math.floor(Math.random() * 20) + 1;
    const damage = kills * 200 + Math.floor(Math.random() * 500);

    try {
      await trackMatch({
        kills,
        placement,
        damage,
        game: tournament?.game || 'BGMI'
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#D946EF']
      });

      alert(`Match Completed!\nKills: ${kills}\nPlacement: ${placement}\nDamage: ${damage}\nStats Updated!`);
    } catch (error) {
      console.error('Failed to track match:', error);
      alert('Failed to update match stats');
    }
  };

  const bracketData: TournamentBracket[] = [
    {
      roundName: 'Quarter Finals',
      matches: [
        { id: 'm1', player1: 'Team Soul', player2: 'GodLike', score1: 15, score2: 12, winner: 'Team Soul', status: 'completed', time: '10:00 AM' },
        { id: 'm2', player1: 'Global Esports', player2: 'Entity', score1: 8, score2: 14, winner: 'Entity', status: 'completed', time: '10:45 AM' },
        { id: 'm3', player1: 'Orange Rock', player2: '8Bit', score1: 10, score2: 10, status: 'live', time: '11:30 AM' },
        { id: 'm4', player1: 'TSM', player2: 'Revenant', status: 'upcoming', time: '12:15 PM' },
      ]
    },
    {
      roundName: 'Semi Finals',
      matches: [
        { id: 'm5', player1: 'Team Soul', player2: 'Entity', status: 'upcoming', time: '02:00 PM' },
        { id: 'm6', player1: 'TBD', player2: 'TBD', status: 'upcoming', time: '02:45 PM' },
      ]
    },
    {
      roundName: 'Grand Finals',
      matches: [
        { id: 'm7', player1: 'TBD', player2: 'TBD', status: 'upcoming', time: '05:00 PM' },
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Live Bracket</h2>
          <p className="text-xs text-muted-foreground">Tournament ID: {id || 'ESP-992'}</p>
        </div>
      </div>

      {/* Round Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {bracketData.map((round, index) => (
          <button
            key={index}
            onClick={() => setActiveRound(index)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeRound === index 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/5 text-muted-foreground hover:bg-white/10'
            }`}
          >
            {round.roundName}
          </button>
        ))}
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {bracketData[activeRound].matches.map((match) => (
          <motion.div
            key={match.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`glass-card p-4 rounded-3xl border-white/5 relative overflow-hidden ${
              match.status === 'live' ? 'border-secondary/30 bg-secondary/5' : ''
            }`}
          >
            {match.status === 'live' && (
              <div className="absolute top-0 right-0 px-3 py-1 bg-secondary text-black text-[8px] font-black uppercase tracking-widest rounded-bl-xl animate-pulse">
                Live Now
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <Clock size={12} />
                {match.time}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                Match #{match.id.toUpperCase()}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Player 1 */}
              <div className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl ${
                match.winner === match.player1 ? 'bg-primary/10 border border-primary/20' : 'bg-white/5'
              }`}>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                  {match.player1[0]}
                </div>
                <span className="text-xs font-bold text-center truncate w-full">{match.player1}</span>
                {match.score1 !== undefined && (
                  <span className="text-xl font-black text-primary">{match.score1}</span>
                )}
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-muted-foreground italic">VS</span>
                {match.status === 'completed' && <CheckCircle2 size={16} className="text-primary" />}
                {match.status === 'live' && <Play size={16} className="text-secondary animate-pulse" />}
              </div>

              {/* Player 2 */}
              <div className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl ${
                match.winner === match.player2 ? 'bg-primary/10 border border-primary/20' : 'bg-white/5'
              }`}>
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs">
                  {match.player2[0]}
                </div>
                <span className="text-xs font-bold text-center truncate w-full">{match.player2}</span>
                {match.score2 !== undefined && (
                  <span className="text-xl font-black text-primary">{match.score2}</span>
                )}
              </div>
            </div>

            {/* Automation Status */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-secondary" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Auto-Progression: Active</span>
              </div>
              {match.status !== 'completed' ? (
                <button 
                  onClick={() => handlePlayMatch(match)}
                  className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase hover:bg-primary/80 transition-all"
                >
                  Play Match
                </button>
              ) : (
                <button className="text-[10px] font-bold text-primary uppercase hover:underline">
                  View Details
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Automation Info */}
      <div className="glass-card p-6 rounded-3xl border-primary/20 bg-primary/5">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
          <Zap size={18} className="text-primary" />
          Espire Automation System
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Our system automatically syncs match results from game servers. Winners are advanced to the next round instantly, and prize pools are distributed to wallets upon tournament completion.
        </p>
      </div>
    </motion.div>
  );
};

export default TournamentAutomation;
