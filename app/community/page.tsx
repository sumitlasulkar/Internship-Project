'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc 
} from 'firebase/firestore';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Send, MessageSquare, ThumbsUp, UserCircle, Activity, HelpCircle, Flame, ExternalLink, ShieldCheck, Sparkles, Trash2, Folders, Layers, Zap, Orbit, ArrowRight } from 'lucide-react';
import Header from '../Home/header';
import { useRouter } from 'next/navigation';
import Footer from '../Home/Footer';

export default function CommunityPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'queries'>('feed');
  const [isFilterMyPosts, setIsFilterMyPosts] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [newInput, setNewInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [openItem, setOpenItem] = useState<string | null>(null); 
  const [replyText, setReplyText] = useState("");
  const [subItems, setSubItems] = useState<any[]>([]); 
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  const springConfig = { type: "spring" as const, stiffness: 300, damping: 30 };

  // --------------------------------------------------------
  // BACKEND LOGIC - 100% UNTOUCHED
  // --------------------------------------------------------
  useEffect(() => {
    setHasMounted(true);
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!hasMounted || !user) return;
    const colName = activeTab === 'feed' ? 'posts' : 'queries';
    const q = query(collection(db, colName), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [activeTab, hasMounted, user]);

  useEffect(() => {
    if (!openItem || !user || !hasMounted) { setSubItems([]); return; }
    const subColName = activeTab === 'feed' ? 'comments' : 'replies';
    const parentCol = activeTab === 'feed' ? 'posts' : 'queries';
    const subQ = query(collection(db, parentCol, openItem, subColName), orderBy('timestamp', 'asc'));
    const unsubSub = onSnapshot(subQ, (snapshot) => {
      setSubItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubSub();
  }, [openItem, activeTab, user, hasMounted]);

  const displayedItems = isFilterMyPosts 
    ? items.filter(item => item.authorId === user?.uid) 
    : items;

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Confirm deletion of this node?")) return;
    await deleteDoc(doc(db, activeTab === 'feed' ? 'posts' : 'queries', itemId));
  };

  const handleDeleteSubItem = async (itemId: string, subId: string) => {
    const subColName = activeTab === 'feed' ? 'comments' : 'replies';
    await deleteDoc(doc(db, activeTab === 'feed' ? 'posts' : 'queries', itemId, subColName, subId));
  };

  const handleMainPost = async () => {
    if (!newInput.trim() || !user) return;
    const colName = activeTab === 'feed' ? 'posts' : 'queries';
    await addDoc(collection(db, colName), {
      content: newInput,
      authorId: user.uid,
      authorName: user.displayName || "Anonymous",
      timestamp: serverTimestamp(),
      likes: []
    });
    setNewInput("");
  };

  const handleLike = async (itemId: string, currentLikes: any) => {
    if (!user) return;
    const likes = Array.isArray(currentLikes) ? currentLikes : [];
    const isLiked = likes.includes(user.uid);
    const itemRef = doc(db, activeTab === 'feed' ? 'posts' : 'queries', itemId);
    await updateDoc(itemRef, { likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) });
  };

  const handleSubPost = async (itemId: string) => {
    if (!replyText.trim() || !user) return;
    const subColName = activeTab === 'feed' ? 'comments' : 'replies';
    await addDoc(collection(db, activeTab === 'feed' ? 'posts' : 'queries', itemId, subColName), {
      text: replyText,
      authorName: user.displayName || "Anonymous",
      authorId: user.uid,
      timestamp: serverTimestamp()
    });
    setReplyText("");
  };

  if (!hasMounted) return null;
  if (isAuthLoading) return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="w-12 h-12 border-t-2 border-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
        <span className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase animate-pulse">Authenticating...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans overflow-x-hidden selection:bg-cyan-500/30 relative">
      
      {/* 🚀 STICKY HEADER */}
      <div className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.04] bg-[#000000]/80 backdrop-blur-xl">
        <Header />
      </div>
      
      {/* 🌌 ULTRA-MINIMAL AMBIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-600/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 blur-[150px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <main className="max-w-7xl mx-auto pt-32 md:pt-40 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* --- LEFT NAVIGATION: SLEEK GLASS PANEL --- */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={springConfig}
            className="md:sticky md:top-36 space-y-8"
          >
            {/* User Profile Card */}
            <div className="bg-[#050505] border border-white/[0.04] rounded-3xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div whileHover={{ scale: 1.05 }} className="relative z-10">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center p-1 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
                        <div className="absolute inset-0 rounded-full border-t border-cyan-400 animate-spin-slow opacity-50" />
                        <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
                           <UserCircle className="w-10 h-10 text-zinc-400" />
                        </div>
                    </div>
                </motion.div>
                <h3 className="font-medium text-lg tracking-tight mt-5 text-white z-10">{user?.displayName || "Elite User"}</h3>
                <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-bold uppercase mt-2 tracking-widest bg-cyan-400/10 px-3 py-1 rounded border border-cyan-400/20 z-10">
                  <ShieldCheck className="w-3 h-3" /> Secure Node
                </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="bg-[#050505] border border-white/[0.04] rounded-3xl p-2 shadow-2xl space-y-1">
                {[
                  { id: 'feed', icon: Activity, label: 'Main Stream' },
                  { id: 'queries', icon: HelpCircle, label: 'Node Queries' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id && !isFilterMyPosts;
                  return (
                    <button 
                      key={tab.id}
                      onClick={() => {setActiveTab(tab.id as any); setOpenItem(null); setIsFilterMyPosts(false);}} 
                      className={`w-full relative flex items-center gap-4 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                      }`}
                    >
                      {isActive && <motion.div layoutId="navTab" className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-2xl shadow-inner" transition={springConfig} />}
                      <tab.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-cyan-400' : ''}`} /> 
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  )
                })}

                <div className="pt-4 mt-4 border-t border-white/[0.04]">
                   <button 
                    onClick={() => setIsFilterMyPosts(!isFilterMyPosts)} 
                    className={`w-full relative flex items-center gap-4 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      isFilterMyPosts ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                    }`}
                   >
                      {isFilterMyPosts && <motion.div layoutId="navTab" className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-inner" transition={springConfig} />}
                      <Folders className="w-4 h-4 relative z-10" /> 
                      <span className="relative z-10">{isFilterMyPosts ? 'Showing Mine' : 'My Archive'}</span>
                   </button>
                </div>
            </div>
          </motion.div>
        </div>

        {/* --- CENTER FEED: MODERN GLASS CARDS --- */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Input Console */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springConfig} className="bg-[#050505] border border-white/[0.04] rounded-3xl p-6 md:p-8 shadow-2xl relative group focus-within:border-cyan-500/30 transition-colors duration-500">
             <div className="flex items-center gap-3 mb-4">
                <Orbit className="w-4 h-4 text-cyan-500 animate-spin-slow" />
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Network_Console</span>
             </div>
             <textarea 
                value={newInput} onChange={(e) => setNewInput(e.target.value)}
                placeholder={activeTab === 'feed' ? "Broadcast a thought to the network..." : "Ask a technical query..."}
                className="w-full bg-transparent border-none outline-none text-sm md:text-base font-medium h-20 resize-none text-zinc-200 placeholder:text-zinc-700 scrollbar-hide"
             />
             <div className="flex justify-end items-center border-t border-white/[0.04] pt-4 mt-2">
                <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleMainPost} 
                    className={`relative group/btn overflow-hidden px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 border border-white/[0.1] text-zinc-100 shadow-lg`}
                >
                    <div className={`absolute inset-0 opacity-80 group-hover/btn:opacity-100 transition-opacity ${activeTab === 'feed' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600'}`} />
                    <span className="relative z-10">Deploy</span> <ArrowRight className="w-3 h-3 relative z-10" />
                </motion.button>
             </div>
          </motion.div>

          <LayoutGroup>
            <motion.div layout className="space-y-6 pb-32">
              <AnimatePresence mode="popLayout">
                {displayedItems.map((item) => {
                  const itemLikes = Array.isArray(item.likes) ? item.likes : [];
                  const isLiked = itemLikes.includes(user?.uid);
                  return (
                    <motion.div 
                      layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={springConfig}
                      key={item.id} 
                      className="bg-[#050505] border border-white/[0.04] hover:border-white/[0.1] rounded-3xl p-6 md:p-8 transition-all duration-500 shadow-xl relative group"
                    >
                      {/* Delete Button */}
                      {item.authorId === user?.uid && (
                        <button onClick={() => handleDeleteItem(item.id)} className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                           <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Header */}
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-400 group-hover:border-cyan-500/30 transition-colors">
                            {item.authorName?.[0]}
                          </div>
                          <div className="flex-1">
                              <h4 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                                {item.authorName} <Sparkles className="w-3 h-3 text-cyan-500 opacity-50" />
                              </h4>
                              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-0.5">Verified User</p>
                          </div>
                      </div>

                      {/* Content */}
                      <p className="text-sm text-zinc-300 leading-relaxed mb-8 whitespace-pre-wrap">{item.content}</p>

                      {/* Actions */}
                      <div className="flex gap-6 border-t border-white/[0.04] pt-5">
                          <motion.button 
                            whileTap={{ scale: 0.9 }} onClick={() => handleLike(item.id, itemLikes)} 
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${isLiked ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                          >
                              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> 
                              <span>{itemLikes.length}</span>
                          </motion.button>
                          
                          <button onClick={() => setOpenItem(openItem === item.id ? null : item.id)} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${openItem === item.id ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>
                              <MessageSquare className="w-4 h-4" /> 
                              {activeTab === 'feed' ? 'Discuss' : 'Provide Answer'}
                          </button>
                      </div>

                      {/* Comments / Replies Section */}
                      <AnimatePresence>
                        {openItem === item.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} 
                            className="mt-6 pt-6 border-t border-white/[0.04] space-y-4 overflow-hidden"
                          >
                             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {subItems.map((sub, idx) => (
                                   <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} key={sub.id} className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.02] flex justify-between items-start hover:bg-white/[0.04] transition-colors group/sub">
                                      <div className="flex-1">
                                         <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">{sub.authorName}</p>
                                         <p className="text-xs text-zinc-300 font-medium leading-relaxed">{sub.text}</p>
                                      </div>
                                      {sub.authorId === user?.uid && (
                                        <button onClick={() => handleDeleteSubItem(item.id, sub.id)} className="text-zinc-600 hover:text-red-400 p-1.5 opacity-0 group-hover/sub:opacity-100 transition-opacity bg-white/[0.02] rounded-md">
                                           <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                   </motion.div>
                                ))}
                             </div>
                             
                             {/* Reply Input */}
                             <div className="flex gap-3 items-center bg-black p-1.5 rounded-2xl border border-white/[0.05] focus-within:border-cyan-500/30 transition-colors mt-4 shadow-inner">
                                <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type a response..." className="flex-1 bg-transparent px-4 py-2.5 text-xs outline-none font-medium text-zinc-200 placeholder:text-zinc-600" />
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSubPost(item.id)} className="p-2.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl hover:bg-cyan-500 hover:text-white transition-colors">
                                    <Send className="w-4 h-4" />
                                </motion.button>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>

        {/* --- RIGHT PANEL: DATA STREAM --- */}
        <div className="lg:col-span-3 hidden lg:block space-y-8">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={springConfig} className="bg-[#050505] border border-white/[0.04] rounded-3xl p-8 shadow-2xl md:sticky md:top-40">
                <h3 className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" /> Trending Nodes
                </h3>
                <div className="space-y-6">
                    {[
                      { tag: '#DeepSeek_v3', color: 'text-blue-400' },
                      { tag: '#NextJS_16', color: 'text-zinc-100' },
                      { tag: '#Turbopack', color: 'text-red-400' },
                      { tag: '#Tailwind_v4', color: 'text-cyan-400' }
                    ].map((item) => (
                        <div key={item.tag} className="flex flex-col gap-2 group cursor-pointer">
                            <div className={`flex justify-between items-center text-xs font-bold text-zinc-500 group-hover:${item.color} transition-colors`}>
                              <span>{item.tag}</span>
                              <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="w-full h-[2px] bg-white/[0.03] rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: "0%" }} animate={{ width: "100%" }} 
                                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                 className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                               />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

      </main>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
      <Footer/>
    </div>
  );
}