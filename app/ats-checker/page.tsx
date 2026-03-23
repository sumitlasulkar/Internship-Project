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

  const springConfig = { type: "spring" as const, stiffness: 400, damping: 30 };
  const smoothHover = { scale: 1.02, transition: { type: "spring" as const, stiffness: 400, damping: 25 } };

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
      <div className="flex flex-col items-center gap-8 relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full animate-pulse" />
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="w-16 h-16 border-y-2 border-cyan-400 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] relative z-10" />
        <span className="text-cyan-400 font-black tracking-[0.4em] text-xs uppercase animate-pulse relative z-10">Initializing_Core...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans overflow-x-hidden selection:bg-cyan-500/30 relative">
      
      {/* 🚀 STICKY HEADER */}
      <div className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.04] bg-[#000000]/80 backdrop-blur-xl">
        <Header />
      </div>
      
      {/* 🌌 DYNAMIC BACKGROUND: Moving Grid & Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] animate-grid-flow"></div>
        <motion.div 
          animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-500/30 blur-[180px] rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.02, 0.06, 0.02], scale: [1.1, 1, 1.1], x: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/30 blur-[180px] rounded-full" 
        />
      </div>

      <main className="max-w-7xl mx-auto pt-32 md:pt-44 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* --- LEFT NAVIGATION: SLEEK GLASS PANEL --- */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={springConfig}
            className="md:sticky md:top-36 space-y-8"
          >
            {/* User Profile Card */}
            <motion.div whileHover={smoothHover} className="bg-[#050505] border border-white/[0.04] rounded-3xl p-8 flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <motion.div className="relative z-10">
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center p-1 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative">
                        <div className="absolute inset-0 rounded-full border-t border-r border-cyan-400 animate-spin-slow opacity-60" />
                        <div className="absolute inset-2 rounded-full border-b border-l border-indigo-500 animate-spin-slow-reverse opacity-40" />
                        <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center relative z-10">
                           <UserCircle className="w-10 h-10 text-zinc-400 group-hover:text-cyan-400 transition-colors duration-500" />
                        </div>
                    </div>
                </motion.div>
                <h3 className="font-bold text-lg tracking-tight mt-5 text-white z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-indigo-400 transition-all duration-500">{user?.displayName || "Elite User"}</h3>
                <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-bold uppercase mt-2 tracking-widest bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 z-10 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                  <ShieldCheck className="w-3 h-3" /> Secure Node
                </div>
            </motion.div>
            
            {/* Navigation Tabs */}
            <div className="bg-[#050505] border border-white/[0.04] rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-1">
                {[
                  { id: 'feed', icon: Activity, label: 'Main Stream' },
                  { id: 'queries', icon: HelpCircle, label: 'Node Queries' }
                ].map((tab) => {
                  const isActive = activeTab === tab.id && !isFilterMyPosts;
                  return (
                    <motion.button 
                      key={tab.id}
                      whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                      onClick={() => {setActiveTab(tab.id as any); setOpenItem(null); setIsFilterMyPosts(false);}} 
                      className={`w-full relative flex items-center gap-4 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                        isActive ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {isActive && <motion.div layoutId="navTab" className="absolute inset-0 bg-white/[0.05] border border-white/[0.05] rounded-2xl shadow-inner" transition={springConfig} />}
                      <tab.icon className={`w-4 h-4 relative z-10 transition-colors duration-500 ${isActive ? 'text-cyan-400' : 'group-hover:text-zinc-300'}`} /> 
                      <span className="relative z-10">{tab.label}</span>
                    </motion.button>
                  )
                })}

                <div className="pt-3 mt-3 border-t border-white/[0.04]">
                   <motion.button 
                    whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setIsFilterMyPosts(!isFilterMyPosts)} 
                    className={`w-full relative flex items-center gap-4 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      isFilterMyPosts ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                   >
                      {isFilterMyPosts && <motion.div layoutId="navTab" className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl shadow-[0_0_15px_rgba(99,102,241,0.15)]" transition={springConfig} />}
                      <Folders className="w-4 h-4 relative z-10" /> 
                      <span className="relative z-10">{isFilterMyPosts ? 'Showing Mine' : 'My Archive'}</span>
                   </motion.button>
                </div>
            </div>
          </motion.div>
        </div>

        {/* --- CENTER FEED: MODERN GLASS CARDS --- */}
        <div className="lg:col-span-6 space-y-10">
          
          {/* Input Console */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springConfig} 
            className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/[0.08] to-transparent overflow-hidden group focus-within:from-cyan-500/50 transition-colors duration-500 shadow-2xl"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-indigo-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
             <div className="relative bg-[#050505] rounded-[calc(2.5rem-1px)] p-6 md:p-8 h-full">
               <div className="flex items-center gap-3 mb-4">
                  <Orbit className="w-4 h-4 text-cyan-500 animate-spin-slow" />
                  <span className="text-[9px] text-cyan-500/70 font-black uppercase tracking-[0.4em]">Broadcast_Console</span>
               </div>
               <textarea 
                  value={newInput} onChange={(e) => setNewInput(e.target.value)}
                  placeholder={activeTab === 'feed' ? "Initialize a new thought stream..." : "Query the neural network..."}
                  className="w-full bg-transparent border-none outline-none text-base md:text-lg font-medium h-24 resize-none text-zinc-100 placeholder:text-zinc-700 scrollbar-hide focus:placeholder:text-zinc-800 transition-colors duration-300"
               />
               <div className="flex justify-end items-center pt-2">
                  <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleMainPost} 
                      className={`relative group/btn overflow-hidden px-8 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 border border-white/[0.1] text-zinc-100 shadow-[0_10px_40px_rgba(0,0,0,0.5)]`}
                  >
                      <div className={`absolute inset-0 opacity-90 group-hover/btn:opacity-100 transition-opacity ${activeTab === 'feed' ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600'}`} />
                      <div className="absolute inset-[1px] bg-black/20 rounded-2xl" />
                      <span className="relative z-10 group-hover/btn:text-white transition-colors">Deploy</span> 
                      <Zap className="w-3.5 h-3.5 relative z-10 fill-current group-hover/btn:text-cyan-300 transition-colors" />
                  </motion.button>
               </div>
             </div>
          </motion.div>

          <LayoutGroup>
            <motion.div layout className="space-y-8 pb-32">
              <AnimatePresence mode="popLayout">
                {displayedItems.map((item, idx) => {
                  const itemLikes = Array.isArray(item.likes) ? item.likes : [];
                  const isLiked = itemLikes.includes(user?.uid);
                  return (
                    <motion.div 
                      layout initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} transition={{ delay: idx * 0.05, ...springConfig }}
                      key={item.id} 
                      className="relative p-[1px] rounded-[3rem] bg-gradient-to-b from-white/[0.08] to-white/[0.01] overflow-hidden group hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500"
                    >
                      {/* ANIMATED GLOWING BORDER EFFECT */}
                      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(6,182,212,0.4)_360deg)] opacity-0 group-hover:opacity-100 animate-spin-slow transition-opacity duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative bg-[#050505]/95 backdrop-blur-2xl rounded-[calc(3rem-1px)] p-8 md:p-10 h-full flex flex-col">
                        
                        {/* Delete Button */}
                        {item.authorId === user?.uid && (
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteItem(item.id)} className="absolute top-8 right-8 p-2 text-zinc-600 hover:text-red-400 bg-white/[0.02] hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                             <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}

                        {/* Header */}
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-[#050505] flex items-center justify-center text-sm font-bold text-zinc-400 border border-white/[0.05] group-hover:border-cyan-500/30 transition-colors shadow-inner relative overflow-hidden">
                              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className="relative z-10">{item.authorName?.[0]}</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2 group-hover:text-cyan-300 transition-colors duration-300">
                                  {item.authorName} <Sparkles className="w-3 h-3 text-cyan-500 opacity-50" />
                                </h4>
                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1 flex items-center gap-1">
                                  Verified_Data_Node
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-[15px] md:text-base text-zinc-300 leading-relaxed mb-10 whitespace-pre-wrap font-medium">{item.content}</p>

                        {/* Actions */}
                        <div className="flex gap-8 border-t border-white/[0.04] pt-6 mt-auto">
                            <motion.button 
                              whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.8 }} 
                              onClick={() => handleLike(item.id, itemLikes)} 
                              className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${isLiked ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-zinc-500 hover:text-zinc-200'}`}
                            >
                                <ThumbsUp className={`w-4 h-4 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} /> 
                                <span className="font-mono text-sm">{itemLikes.length}</span>
                            </motion.button>
                            
                            <motion.button 
                              whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 0.95 }}
                              onClick={() => setOpenItem(openItem === item.id ? null : item.id)} 
                              className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors ${openItem === item.id ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-200'}`}
                            >
                                <MessageSquare className="w-4 h-4" /> 
                                {activeTab === 'feed' ? 'Discuss' : 'Provide Answer'}
                            </motion.button>
                        </div>

                        {/* Comments / Replies Section */}
                        <AnimatePresence>
                          {openItem === item.id && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0, filter: "blur(10px)" }} animate={{ opacity: 1, height: 'auto', filter: "blur(0px)" }} exit={{ opacity: 0, height: 0, filter: "blur(10px)" }} transition={springConfig}
                              className="mt-8 pt-8 border-t border-white/[0.04] space-y-5 overflow-hidden"
                            >
                               <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                  {subItems.length === 0 && <p className="text-zinc-600 text-xs font-medium italic text-center py-4">No data fragments found. Be the first to deploy.</p>}
                                  {subItems.map((sub, subIdx) => (
                                     <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: subIdx * 0.05, ...springConfig }} key={sub.id} className="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.02] flex justify-between items-start hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group/sub">
                                        <div className="flex-1">
                                           <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">{sub.authorName}</p>
                                           <p className="text-sm text-zinc-300 font-medium leading-relaxed">{sub.text}</p>
                                        </div>
                                        {sub.authorId === user?.uid && (
                                          <button onClick={() => handleDeleteSubItem(item.id, sub.id)} className="text-zinc-600 hover:text-red-400 p-2 opacity-0 group-hover/sub:opacity-100 transition-opacity bg-white/[0.02] hover:bg-red-500/10 rounded-lg">
                                             <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                     </motion.div>
                                  ))}
                               </div>
                               
                               {/* Reply Input */}
                               <div className="flex gap-3 items-center bg-[#000000] p-1.5 rounded-2xl border border-white/[0.05] focus-within:border-cyan-500/40 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300 mt-6">
                                  <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type a response payload..." className="flex-1 bg-transparent px-5 py-3 text-sm outline-none font-medium text-zinc-200 placeholder:text-zinc-600" />
                                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleSubPost(item.id)} className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl hover:bg-cyan-500 hover:text-white transition-colors shadow-lg">
                                      <Send className="w-4 h-4 relative -ml-0.5" />
                                  </motion.button>
                               </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>

        {/* --- RIGHT PANEL: DATA STREAM --- */}
        <div className="lg:col-span-3 hidden lg:block space-y-8">
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={springConfig} className="bg-[#050505] border border-white/[0.04] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] md:sticky md:top-36 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-duration-700" />
                <h3 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-2 relative z-10">
                    <Layers className="w-4 h-4 text-indigo-400" /> Trending Nodes
                </h3>
                <div className="space-y-6 relative z-10">
                    {[
                      { tag: '#DeepSeek_v3', color: 'text-indigo-400', glow: 'from-indigo-500' },
                      { tag: '#NextJS_16', color: 'text-zinc-100', glow: 'from-zinc-500' },
                      { tag: '#Turbopack', color: 'text-rose-400', glow: 'from-rose-500' },
                      { tag: '#Tailwind_v4', color: 'text-cyan-400', glow: 'from-cyan-500' }
                    ].map((item, i) => (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, ...springConfig }} key={item.tag} className="flex flex-col gap-2 group/tag cursor-pointer">
                            <div className={`flex justify-between items-center text-[11px] font-bold text-zinc-500 group-hover/tag:${item.color} transition-colors duration-300`}>
                              <span className="group-hover/tag:translate-x-1 transition-transform duration-300">{item.tag}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover/tag:opacity-100 -translate-x-2 group-hover/tag:translate-x-0 transition-all duration-300" />
                            </div>
                            <div className="w-full h-[2px] bg-white/[0.02] rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: "0%" }} animate={{ width: "100%" }} 
                                 transition={{ duration: 2.5 + i, repeat: Infinity, ease: "easeInOut" }}
                                 className={`h-full bg-gradient-to-r transparent via-white/20 to-transparent group-hover/tag:${item.glow}`} 
                               />
                            </div>
                        </motion.div>
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
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 10s linear infinite;
        }
        @keyframes grid-flow {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        .animate-grid-flow {
          animation: grid-flow 3s linear infinite;
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