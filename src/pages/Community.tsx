import React from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Users, 
  Instagram, 
  Globe, 
  Send, 
  Heart, 
  MessageCircle, 
  Share2,
  Plus
} from 'lucide-react';

const Community = () => {
  const posts = [
    { 
      id: '1', 
      user: 'Pro_Gamer_24', 
      avatar: 'https://picsum.photos/seed/p1/100/100',
      time: '2h ago',
      content: 'Just qualified for the ESPIRE ULTIMATE CUP! Who else is in? 🏆🔥',
      image: 'https://picsum.photos/seed/post1/600/400',
      likes: '1.2k',
      comments: '240'
    },
    { 
      id: '2', 
      user: 'Coach_Vicky', 
      avatar: 'https://picsum.photos/seed/p2/100/100',
      time: '5h ago',
      content: 'New strategy video for Valorant Map: Haven is out now in the Training Hub. Check it out! 🧠🎮',
      image: 'https://picsum.photos/seed/post2/600/400',
      likes: '850',
      comments: '112'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6 py-4 pb-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-secondary" />
          Community
        </h2>
        <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Plus size={24} className="text-white" />
        </button>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-3 gap-3">
        <button className="glass-card p-3 rounded-2xl border-white/5 flex flex-col items-center gap-2 hover:border-primary/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <MessageSquare size={20} className="text-indigo-500" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Discord</span>
        </button>
        <button className="glass-card p-3 rounded-2xl border-white/5 flex flex-col items-center gap-2 hover:border-accent/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
            <Instagram size={20} className="text-accent" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Instagram</span>
        </button>
        <button className="glass-card p-3 rounded-2xl border-white/5 flex flex-col items-center gap-2 hover:border-secondary/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <Globe size={20} className="text-secondary" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Website</span>
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="glass-card rounded-3xl overflow-hidden border-white/5">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="text-sm font-bold">{post.user}</h4>
                  <p className="text-[10px] text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-white transition-colors">
                <Send size={18} />
              </button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
            </div>

            {/* Post Image */}
            <div className="aspect-video relative">
              <img src={post.image} alt="Post content" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Post Actions */}
            <div className="p-4 flex items-center justify-between border-t border-white/5">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors group">
                  <Heart size={20} className="group-hover:fill-accent" />
                  <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors">
                  <MessageCircle size={20} />
                  <span className="text-xs font-bold">{post.comments}</span>
                </button>
              </div>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default Community;
