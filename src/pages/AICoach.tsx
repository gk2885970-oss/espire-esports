import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Send, Mic, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ChatMessage } from '../types';
import { api } from '../api';

const AICoach = () => {
  const navigate = useNavigate();
  const { chatHistory, addChatMessage, user } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      text: input, 
      timestamp: Date.now() 
    };
    
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      console.log("Calling Gemini with:", input);
      const response = await api.getAICoachAdvice(input, user?.stats);
      const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: response.advice || "I'm here to help you improve!", 
        timestamp: Date.now() 
      };
      addChatMessage(aiMsg);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: "I'm having trouble connecting right now. Let's try again in a moment!", 
        timestamp: Date.now() 
      };
      addChatMessage(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-[calc(100vh-180px)] overflow-hidden"
    >
      {/* AI Header - DARK & GOLD */}
      <div className="flex flex-row items-center justify-between gap-2 p-3 bg-[#111] rounded-2xl mb-4 border border-yellow-500/20 w-full overflow-hidden shadow-lg shadow-black/50">
        
        {/* Left Side: Icon & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.4)] shrink-0">
            <Cpu className="text-black" size={20} />
          </div>
          <div className="hidden sm:block">
            <h2 className="font-black text-base flex items-center gap-2 text-white tracking-wide">
              AI Coach
            </h2>
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest whitespace-nowrap">Real-time analysis</p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-wrap justify-end gap-1.5 shrink min-w-0">
          <button 
            onClick={() => navigate('/live-coaching')}
            className="flex items-center justify-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-2.5 py-1.5 rounded-xl border border-yellow-500/30 hover:bg-yellow-500/20 transition-all font-bold text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
          >
            <Zap size={14} className="fill-yellow-500/50" />
            <span>Simulate</span>
          </button>
          <button 
            onClick={() => navigate('/live-session')}
            className="flex items-center justify-center gap-1.5 bg-white/5 text-gray-300 px-2.5 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 hover:text-white transition-all font-bold text-[10px] sm:text-xs shrink-0 whitespace-nowrap"
          >
            <Mic size={14} />
            <span>Voice</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 no-scrollbar">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4">
              <Cpu className="text-yellow-500" size={28} />
            </div>
            <h3 className="text-lg font-black text-white mb-2 tracking-tight">Welcome to Espire AI</h3>
            <p className="text-sm text-gray-400 max-w-[250px]">Ask me about aim training, strategies, or your match performance.</p>
          </div>
        )}
        
        {chatHistory.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'model' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed font-medium ${
              msg.role === 'model' 
                ? 'bg-[#111] border border-white/5 text-gray-200 rounded-tl-none' 
                : 'bg-yellow-500 text-black rounded-tr-none shadow-lg shadow-yellow-500/20 font-bold'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#111] border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar shrink-0">
        {['Analyze my aim', 'Training routine', 'Strategy for Valorant', 'How to improve KD?'].map(s => (
          <button 
            key={s}
            onClick={() => setInput(s)}
            className="whitespace-nowrap shrink-0 bg-[#111] border border-white/5 px-4 py-2 rounded-full text-[11px] font-bold text-gray-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-all shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative mt-auto shrink-0 pb-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask your coach anything..."
          className="w-full bg-[#111] border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-colors shadow-inner placeholder:text-gray-600"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="absolute right-2 top-2 bottom-2 w-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default AICoach;
