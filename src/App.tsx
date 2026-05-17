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

// Auth check helper
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
    // FIX 1: 'fixed' hata kar 'flex-none' kiya taaki yeh frame ke andar lock rahe
    <nav className="flex-none w-full flex items-center justify-around px-4 pb-6 pt-3 z-50 border-t border-white/5 bg-background/90 backdrop-blur-lg">
      {navItems.map((item) => {
        const isActive = location.pathname.includes(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors relative ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <item.icon size={24} className={isActive ? 'neon-text-purple' : ''} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

const Header = () => (
  // FIX 2: 'sticky top-0' hata kar 'flex-none' kiya
  <header className="flex-none w-full flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md z-40 border-b border-white/5">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Espire Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
          onError={(e) => {
            e.currentTarget.src = "https://picsum.photos/seed/espire-logo/100/100";
          }}
          referrerPolicy="no-referrer"
        />
      </div>
      <h1 className="text-xl font-black tracking-tighter neon-text-purple uppercase">ESPIRE</h1>
    </div>
    <div className="flex items-center gap-4">
      <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
      </button>
      <Link to="/wallet" className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-white/5">
        <Wallet size={16} className="text-secondary" />
        <span className="text-sm font-bold">₹450</span>
      </Link>
    </div>
  </header>
);

export default function App() {
  return (
    <Router>
      {/* MAC/DESKTOP WRAPPER (Black background with overflow-hidden) */}
      <div className="min-h-screen w-full bg-black flex justify-center font-sans text-white overflow-hidden">
        
        {/* MOBILE FRAME (Centered 430px Box with h-[100dvh]) */}
        <div className="w-full max-w-[430px] h-[100dvh] bg-background relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x border-white/10 flex flex-col">
          
          {isLoggedIn() && <Header />}

          {/* Main content area: flex-1 ensures it takes remaining space, pb-4 instad of pb-24 */}
          <main className="flex-1 overflow-y-auto py-4 px-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Login Route — public */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route path="/" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/home" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/play" element={isLoggedIn() ? <TournamentList /> : <Navigate to="/login" />} />
                <Route path="/ai" element={isLoggedIn() ? <AICoach /> : <Navigate to="/login" />} />
                <Route path="/ai-coach" element={isLoggedIn() ? <AICoach /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn() ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/profile/stats" element={isLoggedIn() ? <Performance /> : <Navigate to="/login" />} />
                <Route path="/profile/tournaments" element={isLoggedIn() ? <TournamentList /> : <Navigate to="/login" />} />
                <Route path="/profile/achievements" element={isLoggedIn() ? <Achievements /> : <Navigate to="/login" />} />
                <Route path="/tournament/:id" element={isLoggedIn() ? <TournamentAutomation /> : <Navigate to="/login" />} />
                <Route path="/leaderboard" element={isLoggedIn() ? <Leaderboard /> : <Navigate to="/login" />} />
                <Route path="/wallet" element={isLoggedIn() ? <WalletPage /> : <Navigate to="/login" />} />
                <Route path="/live-session" element={isLoggedIn() ? <LiveSession /> : <Navigate to="/login" />} />
                <Route path="/privacy" element={isLoggedIn() ? <Privacy /> : <Navigate to="/login" />} />
                <Route path="/premium" element={isLoggedIn() ? <Premium /> : <Navigate to="/login" />} />
                <Route path="/community" element={isLoggedIn() ? <Community /> : <Navigate to="/login" />} />
                <Route path="/live-coaching" element={isLoggedIn() ? <LiveCoaching /> : <Navigate to="/login" />} />
                <Route path="/pointcalc" element={isLoggedIn() ? <PointCalc /> : <Navigate to="/login" />} />
                <Route path="/training/:moduleId" element={isLoggedIn() ? <TrainingModuleContainer /> : <Navigate to="/login" />} />
                <Route path="/training/drill/:id" element={isLoggedIn() ? <DrillDetail /> : <Navigate to="/login" />} />
                <Route path="/training/aim" element={isLoggedIn() ? <AimTrainerGame /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>

          {/* BottomNav */}
          {isLoggedIn() && <BottomNav />}

        </div>
      </div>
    </Router>
  );
}
