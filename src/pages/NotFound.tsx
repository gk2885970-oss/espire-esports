import React from 'react';
import { motion } from 'motion/react';
import { Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <div>
        <h2 className="text-3xl font-black tracking-tighter mb-2">404 - LOST IN ZONE</h2>
        <p className="text-muted-foreground text-sm max-w-[240px] mx-auto">
          The page you're looking for has been eliminated or doesn't exist.
        </p>
      </div>
      <Link 
        to="/" 
        className="bg-primary px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
      >
        <Home size={18} />
        Back to Base
      </Link>
    </motion.div>
  );
};

export default NotFound;
