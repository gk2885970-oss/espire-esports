import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Trophy,
  Wallet,
  Cpu,
  Bell,
  BarChart2,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

// Training Pages
import TrainingModuleContainer from './pages/training/TrainingModuleContainer';
import DrillDetail from './pages/training/DrillDetail';
import AimTrainerGame from './pages/training/AimTrainerGame';

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
    <nav className="nav-blur flex items-center justify-around px-4 pb-2">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <item.icon size={24} className={isActive ? 'neon-text-purple' : ''} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-40">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <img
          src="https://raw.githubusercontent.com/EspireEsports/assets/main/logo.png"
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
      <div className="mobile-container bg-background">
        <Header />

        <main className="flex-1 overflow-y-auto pb-24 px-4">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/play" element={<TournamentList />} />
              <Route path="/ai" element={<AICoach />} />
              <Route path="/ai-coach" element={<AICoach />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/stats" element={<Performance />} />
              <Route path="/profile/tournaments" element={<TournamentList />} />
              <Route path="/profile/achievements" element={<Achievements />} />
              <Route path="/tournament/:id" element={<TournamentAutomation />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/live-session" element={<LiveSession />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/community" element={<Community />} />
              <Route path="/live-coaching" element={<LiveCoaching />} />
              <Route path="/pointcalc" element={<PointCalc />} />
              {/* Training Routes */}
              <Route path="/training/:moduleId" element={<TrainingModuleContainer />} />
              <Route path="/training/drill/:id" element={<DrillDetail />} />
              <Route path="/training/aim" element={<AimTrainerGame />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
}
