// === 1. HEADER COMPONENT ===
const Header = () => (
  // FIX: 'sticky top-0' hata kar 'flex-none' lagaya
  <header className="flex-none w-full flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md z-40 border-b border-white/5">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <img src="/logo.png" alt="Espire Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
      </div>
      <h1 className="text-xl font-black tracking-tighter text-[#7c3aed] uppercase">ESPIRE</h1>
    </div>
    <div className="flex items-center gap-4">
      <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-[#7c3aed] rounded-full border-2 border-black"></span>
      </button>
      <Link to="/wallet" className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 text-white">
        <Wallet size={16} className="text-[#7c3aed]" />
        <span className="text-sm font-bold">₹450</span>
      </Link>
    </div>
  </header>
);

// === 2. BOTTOM NAVIGATION COMPONENT ===
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
    // FIX: 'fixed bottom-0 left-0 right-0' hata kar 'flex-none' lagaya. 
    <nav className="flex-none w-full flex items-center justify-around px-4 pb-6 pt-3 z-50 border-t border-white/5 bg-[#0a0a0a]/90 backdrop-blur-lg">
      {navItems.map((item) => {
        const isActive = location.pathname.includes(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-colors relative ${isActive ? 'text-[#7c3aed]' : 'text-gray-500'}`}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            {isActive && (
              <motion.div layoutId="nav-indicator" className="absolute -bottom-2 w-1 h-1 rounded-full bg-[#7c3aed]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

// === 3. MAIN APP COMPONENT ===
export default function App() {
  return (
    <Router>
      {/* FIX: overflow-hidden on outer div to stop accidental body scrolls */}
      <div className="min-h-screen w-full bg-black flex justify-center text-white font-sans overflow-hidden">
        
        {/* FIX: h-[100dvh] ensures it fits exact screen height like a real phone */}
        <div className="w-full max-w-[430px] h-[100dvh] bg-[#0a0a0a] relative shadow-[0_0_80px_rgba(0,0,0,0.8)] border-x border-[#333] flex flex-col">
          
          {/* Header ek jagah fix rahega box ke andar */}
          <Routes>
            <Route path="*" element={isLoggedIn() ? <Header /> : null} />
          </Routes>
          
          {/* Main content box ke andar scroll hoga bina navbars ko hilaye */}
          <main className="flex-1 overflow-y-auto px-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={isLoggedIn() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                <Route path="/home" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/pointcalc" element={isLoggedIn() ? <PointCalc /> : <Navigate to="/login" />} />
                <Route path="/ai-coach" element={isLoggedIn() ? <AICoach /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isLoggedIn() ? <Profile /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </AnimatePresence>
          </main>

          {/* BottomNav hamesha box ke bottom par rahega */}
          <Routes>
            <Route path="*" element={isLoggedIn() && location.pathname !== '/login' ? <BottomNav /> : null} />
          </Routes>
          
        </div>
      </div>
    </Router>
  );
}
