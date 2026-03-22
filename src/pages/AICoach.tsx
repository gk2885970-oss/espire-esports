import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
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
      const response = await api.getAICoachAdvice(input, user.stats);
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
      className="flex flex-col h-[calc(100vh-180px)]"
    >
      {/* AI Header */}
      <div className="flex items-center gap-4 p-4 glass-card rounded-2xl mb-4 border-primary/20">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          <Cpu className="text-white" size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            AI Coach
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">Pro Active</span>
          </h2>
          <p className="text-xs text-muted-foreground">Analyzing your gameplay in real-time</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <button 
            onClick={() => navigate('/live-coaching')}
            className="flex items-center gap-2 bg-primary/20 text-primary px-3 py-2 rounded-xl border border-primary/30 hover:bg-primary/30 transition-all font-bold text-xs"
          >
            <Zap size={16} />
            Simulation
          </button>
          <button 
            onClick={() => navigate('/live-session')}
            className="flex items-center gap-2 bg-secondary/20 text-secondary px-3 py-2 rounded-xl border border-secondary/30 hover:bg-secondary/30 transition-all font-bold text-xs"
          >
            <Mic size={16} />
            Live Voice
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 no-scrollbar">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Cpu className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-bold mb-2">Welcome to Espire AI</h3>
            <p className="text-sm text-muted-foreground">Ask me about aim training, strategies, or your recent match performance.</p>
          </div>
        )}
        {chatHistory.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, x: msg.role === 'model' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'model' 
                ? 'bg-muted/50 border border-white/5 rounded-tl-none' 
                : 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
        {['Analyze my aim', 'Training routine', 'Strategy for Valorant', 'How to improve KD?'].map(s => (
          <button 
            key={s}
            onClick={() => setInput(s)}
            className="whitespace-nowrap bg-muted/30 border border-white/5 px-4 py-2 rounded-full text-xs text-muted-foreground hover:text-white hover:border-primary/50 transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask your coach anything..."
          className="w-full bg-muted/50 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="absolute right-2 top-2 bottom-2 w-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary/80 transition-colors disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default AICoach;
