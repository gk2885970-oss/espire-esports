import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Home,
  Trophy,
  Wallet,
  Cpu,
  Bell,
  BarChart2,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Dashboard from './pages/Dashboard';
import TournamentList from './pages/TournamentList';
import AICoach from './pages/AICoach';
import PerformanceAnalysis from './pages/PerformanceAnalysis';
import Profile from './pages/Profile';
import Community from './pages/Community';
import WalletPage from './pages/WalletPage';
import LiveSession from './pages/LiveSession';
import NotFound from './pages/NotFound';
import TournamentAutomation from './pages/TournamentAutomation';
import Leaderboard from './pages/Leaderboard';
import LiveCoaching from './pages/LiveCoaching';
import Performance from './pages/Performance';
import Achievements from './pages/Achievements';
import Privacy from './pages/Privacy';
import Premium from './pages/Premium';
import PointCalc from './pages/PointCalc';
import Login from './pages/Login';

// Training Pages
import TrainingModuleContainer from './pages/training/TrainingModuleContainer';
import DrillDetail from './pages/training/DrillDetail';
import AimTrainerGame from './pages/training/AimTrainerGame';

const isLoggedIn = () => !!localStorage.getItem('token');

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/pointcalc', icon: BarChart2, label: 'Points' },
    { path: '/play', icon: Trophy, label: 'Play' },
    { path: '/ai-coach', icon: Cpu, label: 'AI' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="flex-none w-full flex items-center justify-around px-4 pb-6 pt-3 z-50 border-t border-yellow-500/10 bg-[#0a0a0a]/95 backdrop-blur-lg">
      {navItems.map((item) => {
        const isActive = location.pathname.includes(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all relative ${isActive ? 'text-yellow-500' : 'text-gray-500'}`}
          >
            {/* Active Glow for Icons */}
            <item.icon 
                size={24} 
                className={isActive ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : ''} 
            />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-yellow-500' : 'text-gray-600'}`}>
                {item.label}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#facc15]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

const Header = () => (
  <header className="flex-none w-full flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md z-40 border-b border-yellow-500/10">
    {/* Left Side: Just the Original Logo */}
    <div className="flex items-center">
      <div className="h-8 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Espire Logo"
          className="h-full w-auto object-contain" // Preserves original colors and proportions
          onError={(e) => {
            e.currentTarget.src = "https://picsum.photos/seed/espire-logo/100/100";
          }}
        />
      </div>
    </div>
    
    {/* Right Side: Notifications & Wallet */}
    <div className="flex items-center gap-4">
      <button className="relative p-2 text-gray-400 hover:text-yellow-500 transition-colors">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#0a0a0a]"></span>
      </button>
      <Link to="/wallet" className="flex items-center gap-2 bg-yellow-500/5 px-3 py-1.5 rounded-xl border border-yellow-500/20">
        <Wallet size={16} className="text-yellow-500" />
        <span className="text-sm font-black text-yellow-500 tracking-tighter">₹450</span>
      </Link>
    </div>
  </header>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-[#050505] flex justify-center font-sans text-white overflow-hidden">
        
        {/* MOBILE FRAME: Deep Black Background */}
        <div className="w-full max-w-[430px] h-[100dvh] bg-[#0a0a0a] relative shadow-[0_0_100px_rgba(0,0,0,0.9)] border-x border-white/5 flex flex-col">
          
          {isLoggedIn() && <Header />}

          <main className="flex-1 overflow-y-auto py-4 px-4 scroll-smooth no-scrollbar">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/home" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/play" element={isLoggedIn() ? <TournamentList /> : <Navigate to="/login" />} />
                <Route path="/ai-coach" element={isLoggedIn() ? <AICoach /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn() ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/pointcalc" element={isLoggedIn() ? <PointCalc /> : <Navigate to="/login" />} />
                <Route path="/wallet" element={isLoggedIn() ? <WalletPage /> : <Navigate to="/login" />} />
                {/* Ensure all your other routes are here */}
                <Route path="/profile/stats" element={isLoggedIn() ? <Performance /> : <Navigate to="/login" />} />
                <Route path="/profile/tournaments" element={isLoggedIn() ? <TournamentList /> : <Navigate to="/login" />} />
                <Route path="/profile/achievements" element={isLoggedIn() ? <Achievements /> : <Navigate to="/login" />} />
                <Route path="/tournament/:id" element={isLoggedIn() ? <TournamentAutomation /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={isLoggedIn() ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="/live-session" element={isLoggedIn() ? <LiveSession /> : <Navigate to="/login" />} />
                <Route path="/privacy" element={isLoggedIn() ? <Privacy /> : <Navigate to="/login" />} />
                <Route path="/premium" element={isLoggedIn() ? <Premium /> : <Navigate to="/login" />} />
                <Route path="/community" element={isLoggedIn() ? <Community /> : <Navigate to="/login" />} />
                <Route path="/live-coaching" element={isLoggedIn() ? <LiveCoaching /> : <Navigate to="/login" />} />
                <Route path="/training/:moduleId" element={isLoggedIn() ? <TrainingModuleContainer /> : <Navigate to="/login" />} />
                <Route path="/training/drill/:id" element={isLoggedIn() ? <DrillDetail /> : <Navigate to="/login" />} />
                <Route path="/training/aim" element={isLoggedIn() ? <AimTrainerGame /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>

          {isLoggedIn() && <BottomNav />}

        </div>
      </div>
    </Router>
  );
}
