import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  CreditCard, 
  Plus, 
  Zap,
  Trophy,
  X,
  Smartphone
} from 'lucide-react';
import { useStore } from '../store';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const WalletPage = () => {
  const { user, fetchUser } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState('500');
  const [isProcessing, setIsProcessing] = useState(false);

  // Demo Transactions
  const transactions = [
    { id: '1', type: 'payout', amount: '+₹1,200', title: 'BGMI Pro Series Win', date: 'Oct 12, 2026', status: 'completed' },
    { id: '2', type: 'entry', amount: '-₹500', title: 'Valorant Spike Rush Entry', date: 'Oct 10, 2026', status: 'completed' },
    { id: '3', type: 'deposit', amount: '+₹450', title: 'Welcome Bonus', date: 'Oct 08, 2026', status: 'completed' },
  ];

  // Simulated Payment Gateway (Updates Firebase)
  const handlePayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    setIsProcessing(true);
    
    // Simulate Bank/UPI Delay (2 seconds)
    setTimeout(async () => {
      try {
        const newBalance = (user?.wallet?.balance || 0) + Number(amount);
        const userRef = doc(db, 'users', user.uid);
        
        // Update Live Database
        await updateDoc(userRef, {
          'wallet.balance': newBalance
        });

        // Update Local State
        await fetchUser(user.uid);
        
        setShowAddModal(false);
        setAmount('500');
      } catch (error) {
        console.error("Payment Failed:", error);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 py-4 pb-10 max-w-4xl mx-auto px-4"
    >
      {/* Wallet Balance Card (DARK & GOLD) */}
      <section className="glass-card p-8 rounded-[32px] border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-[#0a0a0a] to-[#111] relative overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.1)]">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} className="text-yellow-500" />
        </div>
        <div className="relative z-10 text-center space-y-2">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Total Balance</p>
          <h2 className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]">
            ₹{user?.wallet?.balance || 0}
          </h2>
          <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-bold">
            <ArrowUpRight size={14} />
            <span>Ready for Next Match</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.4)] uppercase text-sm tracking-wider"
          >
            <Plus size={18} /> Add Money
          </button>
          <button className="bg-[#111] border border-white/10 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all hover:bg-white/5 active:scale-95 uppercase text-sm tracking-wider">
            <ArrowDownLeft size={18} className="text-gray-400" /> Withdraw
          </button>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: History, label: 'History' },
          { icon: CreditCard, label: 'KYC & Cards' },
          { icon: Zap, label: 'Rewards' },
        ].map(action => (
          <button key={action.label} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center group-hover:border-yellow-500/50 transition-all shadow-sm">
              <action.icon size={24} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <History size={16} className="text-yellow-500" />
            Recent Transactions
          </h3>
          <button className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest hover:text-yellow-400">View All</button>
        </div>
        <div className="space-y-3">
          {transactions.map(tx => (
            <div key={tx.id} className="bg-[#111] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-yellow-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  tx.type === 'payout' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  tx.type === 'entry' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {tx.type === 'payout' ? <Trophy size={18} /> : 
                   tx.type === 'entry' ? <ArrowDownLeft size={18} /> : 
                   <Plus size={18} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">{tx.title}</h4>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black tracking-wide ${
                  tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'
                }`}>{tx.amount}</p>
                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-0.5">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Banner */}
      <section className="glass-card p-6 rounded-3xl border border-yellow-500/20 bg-gradient-to-r from-[#111] to-yellow-500/10 relative overflow-hidden group cursor-pointer">
        <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
          <Zap size={100} className="text-yellow-500" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-black mb-1 text-white">Refer & Earn ₹100</h3>
          <p className="text-xs text-gray-400 mb-4 font-medium max-w-[80%]">Invite your teammates to Espire and get ₹100 for each successful referral.</p>
          <button className="bg-yellow-500 text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:bg-yellow-400 transition-colors">
            Invite Now
          </button>
        </div>
      </section>

      {/* --- ADD MONEY MODAL (PAYMENT GATEWAY UI) --- */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 pb-8"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-[400px] bg-[#0a0a0a] border border-yellow-500/20 rounded-[32px] p-6 relative shadow-2xl"
            >
              <button onClick={() => !isProcessing && setShowAddModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <X size={24} />
              </button>
              
              <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Add Funds</h3>
              
              <div className="bg-[#111] rounded-2xl p-4 border border-white/5 mb-6 text-center">
                <span className="text-gray-400 text-sm font-bold">Amount to add</span>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-3xl font-black text-yellow-500">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-4xl font-black text-white w-32 outline-none text-center"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                {['100', '500', '1000'].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${amount === val ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-[#111] border-white/10 text-gray-400 hover:border-white/30'}`}
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pay via UPI</p>
                
                <button onClick={handlePayment} disabled={isProcessing} className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#111] border border-white/5 hover:border-yellow-500/30 transition-all disabled:opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                       <Smartphone size={16} className="text-blue-600" />
                    </div>
                    <span className="font-bold text-white">Google Pay / PhonePe</span>
                  </div>
                  <span className="text-xs font-bold text-green-400">Instant</span>
                </button>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-yellow-500 text-black font-black py-4 rounded-2xl uppercase tracking-wider flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none transition-all"
              >
                {isProcessing ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                ) : (
                  `PAY ₹${amount || 0}`
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WalletPage;
