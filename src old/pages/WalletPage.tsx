import React from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  Plus, 
  ChevronRight,
  Trophy,
  Zap
} from 'lucide-react';

const WalletPage = () => {
  const transactions = [
    { id: '1', type: 'payout', amount: '+₹1,200', title: 'BGMI Pro Series Win', date: 'Oct 12, 2024', status: 'completed' },
    { id: '2', type: 'entry', amount: '-₹500', title: 'Valorant Spike Rush Entry', date: 'Oct 10, 2024', status: 'completed' },
    { id: '3', type: 'deposit', amount: '+₹2,000', title: 'Added to Wallet', date: 'Oct 08, 2024', status: 'completed' },
    { id: '4', type: 'entry', amount: '-₹100', title: 'Free Fire Clash Squad', date: 'Oct 05, 2024', status: 'completed' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 py-4 pb-10"
    >
      {/* Wallet Balance Card */}
      <section className="glass-card p-8 rounded-[32px] border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} className="text-primary" />
        </div>
        <div className="relative z-10 text-center space-y-2">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Total Balance</p>
          <h2 className="text-5xl font-black tracking-tighter neon-text-purple">₹4,500</h2>
          <div className="flex items-center justify-center gap-2 text-emerald-500 text-xs font-bold">
            <ArrowUpRight size={14} />
            <span>+15% this month</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button className="bg-primary hover:bg-primary/80 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
            <Plus size={18} /> Add Money
          </button>
          <button className="bg-muted/50 border border-white/10 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-muted active:scale-95">
            <ArrowDownLeft size={18} /> Withdraw
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: History, label: 'History' },
          { icon: CreditCard, label: 'Cards' },
          { icon: Zap, label: 'Rewards' },
        ].map(action => (
          <button key={action.label} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl glass-card border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-all">
              <action.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-white">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <History size={16} className="text-secondary" />
            Recent Transactions
          </h3>
          <button className="text-[10px] text-primary font-bold uppercase tracking-widest">View All</button>
        </div>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="glass-card p-4 rounded-2xl border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'payout' ? 'bg-emerald-500/20 text-emerald-500' : 
                  tx.type === 'entry' ? 'bg-red-500/20 text-red-500' : 
                  'bg-secondary/20 text-secondary'
                }`}>
                  {tx.type === 'payout' ? <Trophy size={18} /> : 
                   tx.type === 'entry' ? <ArrowDownLeft size={18} /> : 
                   <Plus size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{tx.title}</h4>
                  <p className="text-[10px] text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${
                  tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-white'
                }`}>{tx.amount}</p>
                <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Banner */}
      <section className="glass-card p-6 rounded-3xl border-accent/20 bg-accent/5 relative overflow-hidden group cursor-pointer">
        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
          <Zap size={100} className="text-accent" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-black mb-1">Refer & Earn ₹100</h3>
          <p className="text-xs text-muted-foreground mb-4">Invite your teammates to Espire and get ₹100 for each successful referral.</p>
          <button className="bg-accent text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-accent/20">
            Invite Now
          </button>
        </div>
      </section>
    </motion.div>
  );
};

export default WalletPage;
