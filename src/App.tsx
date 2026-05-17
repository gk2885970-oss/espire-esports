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
    // FIX: Mac par nav bar ko stretch hone se rokne ke liye w-full aur max-w-[430px] lagaya hai
    <nav className="fixed bottom-0 w-full max-w-[430px] mx-auto left-0 right-0 nav-blur flex items-center justify-around px-4 pb-4 pt-2 z-50 border-t border-white/5 bg-background/80 backdrop-blur-lg">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
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
  // FIX: Header ko bhi max-width diya taaki desktop par ye frame ke andar rahe
  <header className="w-full flex items-center justify-between px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-white/5">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Espire Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
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
      {/* THE BIG FIX: 
        1. bg-black poori Mac screen ko dark karega.
        2. max-w-[430px] + mx-auto app ko Mac ke center mein ek phone ki tarah lock kar dega.
        3. border-x Mac par dono side ek patli line dega jisse mobile frame clear dikhe.
      */}
      <div className="min-h-screen w-full bg-black flex justify-center">
        <div className="w-full max-w-[430px] bg-background relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x border-white/10 flex flex-col overflow-x-hidden">
          
          {isLoggedIn() && <Header />}

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto pb-24 px-4 no-scrollbar">
            <AnimatePresence mode="wait">
               {/* TUMHARE SAARE ROUTES YAHAN RAHENGE WAISE HI JAISY THE */}
               <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
                  <Route path="/home" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />} />
                  {/* ... baaki routes copy paste rakhna ... */}
                  <Route path="/pointcalc" element={isLoggedIn() ? <PointCalc /> : <Navigate to="/login" />} />
                  <Route path="/ai-coach" element={isLoggedIn() ? <AICoach /> : <Navigate to="/login" />} />
                  {/* ... */}
               </Routes>
            </AnimatePresence>
          </main>

          {isLoggedIn() && <BottomNav />}
          
        </div>
      </div>
    </Router>
  );
}
