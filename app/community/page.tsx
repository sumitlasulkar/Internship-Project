'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc 
} from 'firebase/firestore';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Send, MessageSquare, ThumbsUp, UserCircle, Activity, HelpCircle, Flame, ExternalLink, ShieldCheck, Sparkles, Trash2, Folders, Layers, Zap, Orbit } from 'lucide-react';
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

  // --- ACTIONS (NO CHANGES TO LOGIC) ---
  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm("Bhai, delete karna hai?")) return;
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
    <div className="min-h-screen bg-[#020202] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="w-16 h-16 border-t-2 border-orange-600 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.5)]" />
        <span className="text-orange-500 font-black tracking-[0.5em] text-[10px] uppercase animate-pulse">Initializing_OS...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-orange-600/30 font-sans overflow-x-hidden">
      
      {/* 🚀 STICKY HEADER WRAPPER */}
      <div className="fixed top-0 left-0 w-full z-[100]">
        <Header />
      </div>
      
      {/* 🌌 Cyber Background - Frosted Glass Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ repeat: Infinity, duration: 10 }}
            className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full" 
        />
        <motion.div 
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 10 }}
            className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
      </div>

      {/* content-top added to ensure space for header */}
      <main className="max-w-7xl mx-auto pt-32 md:pt-48 p-4 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* --- LEFT NAVIGATION: FLOATING GLASS --- */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ x: -30, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:sticky md:top-40 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col items-center mb-10">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative group">
                    <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-yellow-400 rounded-full flex items-center justify-center p-[2px] shadow-[0_0_30px_rgba(234,88,12,0.3)]">
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                           <UserCircle className="w-12 h-12 text-orange-500" />
                        </div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                <h3 className="font-black italic text-lg uppercase tracking-tighter mt-4">{user?.displayName || "Pro_User"}</h3>
                <div className="flex items-center gap-1.5 text-[8px] text-green-400 font-bold uppercase mt-2 tracking-widest bg-green-400/10 px-4 py-1.5 rounded-full border border-green-400/20">
                  <ShieldCheck className="w-3 h-3" /> Encrypted_Access
                </div>
            </div>
            
            <div className="space-y-3">
                {[
                  { id: 'feed', icon: Activity, label: 'Main Stream', color: 'orange' },
                  { id: 'queries', icon: HelpCircle, label: 'Node Queries', color: 'blue' }
                ].map((tab) => (
                  <motion.button 
                    key={tab.id}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {setActiveTab(tab.id as any); setOpenItem(null); setIsFilterMyPosts(false);}} 
                    className={`w-full flex items-center gap-4 p-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab.id && !isFilterMyPosts ? `bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.2)]` : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white hover:border-white/20'}`}
                  >
                     <tab.icon className="w-5 h-5" /> {tab.label}
                  </motion.button>
                ))}

                <div className="pt-6 mt-6 border-t border-white/10">
                   <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFilterMyPosts(!isFilterMyPosts)} 
                    className={`w-full flex items-center gap-4 p-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all border ${isFilterMyPosts ? 'bg-orange-600 border-orange-500 shadow-[0_0_25px_rgba(234,88,12,0.4)] text-white' : 'bg-white/5 border-white/5 text-zinc-500 hover:text-white'}`}
                   >
                      <Folders className="w-5 h-5" /> {isFilterMyPosts ? 'Showing Mine' : 'My Archive'}
                   </motion.button>
                </div>
            </div>
          </motion.div>
        </div>

        {/* --- CENTER FEED: GLOW CARDS --- */}
        <div className="lg:col-span-6 space-y-10">
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white/[0.04] border border-white/10 rounded-[3.5rem] p-8 md:p-10 backdrop-blur-2xl shadow-2xl relative group overflow-hidden">
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-600/10 blur-[100px] group-hover:opacity-100 opacity-50 transition-opacity" />
             <textarea 
                value={newInput} onChange={(e) => setNewInput(e.target.value)}
                placeholder={activeTab === 'feed' ? "Broadcast your neural thoughts..." : "Ask the network, bhai..."}
                className="w-full bg-transparent border-none outline-none text-base font-medium h-24 resize-none placeholder:text-zinc-700 scrollbar-hide"
             />
             <div className="flex justify-between items-center border-t border-white/10 pt-8 mt-4">
                <div className="flex items-center gap-3">
                    <Orbit className="w-5 h-5 text-orange-600 animate-spin-slow" />
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em]">Node_v6.0</span>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: '0 0_30px_rgba(234,88,12,0.4)' }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={handleMainPost} 
                    className={`${activeTab === 'feed' ? 'bg-orange-600' : 'bg-blue-600'} px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3`}
                >
                    Deploy <Zap className="w-4 h-4 fill-white" />
                </motion.button>
             </div>
          </motion.div>

          <LayoutGroup>
            <motion.div layout className="space-y-8 pb-32">
              <AnimatePresence mode="popLayout">
                {displayedItems.map((item) => {
                  const itemLikes = Array.isArray(item.likes) ? item.likes : [];
                  const isLiked = itemLikes.includes(user?.uid);
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      key={item.id} 
                      className="bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[4rem] p-8 md:p-10 transition-all duration-500 shadow-2xl backdrop-blur-xl relative group"
                    >
                      {item.authorId === user?.uid && (
                        <motion.button whileHover={{ scale: 1.2, color: '#ef4444' }} onClick={() => handleDeleteItem(item.id)} className="absolute top-10 right-10 p-2 text-zinc-700">
                           <Trash2 className="w-5 h-5" />
                        </motion.button>
                      )}

                      <div className="flex items-center gap-5 mb-8">
                          <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-xs font-black italic text-zinc-500 border border-white/10 group-hover:border-orange-500/50 transition-colors">
                            {item.authorName?.[0]}
                          </div>
                          <div className="flex-1">
                              <h4 className="text-sm font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
                                {item.authorName} <Sparkles className="w-3 h-3 text-orange-500" />
                              </h4>
                              <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.4em] mt-1">Verified_Data_Node</p>
                          </div>
                      </div>

                      <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-10 font-medium whitespace-pre-wrap">{item.content}</p>

                      <div className="flex gap-10 border-t border-white/5 pt-8">
                          <motion.button 
                            whileTap={{ scale: 0.8 }}
                            onClick={() => handleLike(item.id, itemLikes)} 
                            className={`flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest ${isLiked ? (activeTab === 'feed' ? 'text-orange-500' : 'text-blue-500') : 'text-zinc-600 hover:text-white'}`}
                          >
                              <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} /> <span className="font-mono text-xs">{itemLikes.length}</span>
                          </motion.button>
                          
                          <button onClick={() => setOpenItem(openItem === item.id ? null : item.id)} className={`flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest ${openItem === item.id ? 'text-white underline underline-offset-8 decoration-orange-500' : 'text-zinc-600 hover:text-white'}`}>
                              <MessageSquare className="w-5 h-5" /> {activeTab === 'feed' ? 'Resolve_Comments' : 'Resolve_Answers'}
                          </button>
                      </div>

                      <AnimatePresence>
                        {openItem === item.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }} 
                            className="mt-10 pt-10 border-t border-white/5 space-y-6 overflow-hidden"
                          >
                             <div className="space-y-5 max-h-[400px] overflow-y-auto pr-3 scrollbar-hide">
                                {subItems.map((sub, idx) => (
                                   <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} key={sub.id} className="bg-white/[0.03] p-6 rounded-[2.2rem] border border-white/5 flex justify-between items-start hover:bg-white/[0.06] transition-colors group/sub">
                                      <div className="flex-1">
                                         <p className="text-[10px] text-orange-500 font-black mb-2 uppercase italic tracking-widest">{sub.authorName}</p>
                                         <p className="text-sm text-zinc-400 font-medium leading-relaxed">{sub.text}</p>
                                      </div>
                                      {sub.authorId === user?.uid && (
                                        <button onClick={() => handleDeleteSubItem(item.id, sub.id)} className="text-zinc-800 hover:text-red-500 p-2 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                           <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                   </motion.div>
                                ))}
                             </div>
                             <div className="flex gap-4 items-center bg-white/[0.02] p-2 rounded-[2.5rem] border border-white/10">
                                <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your response..." className="flex-1 bg-transparent px-6 py-4 text-xs outline-none font-medium text-white" />
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSubPost(item.id)} className="p-4 bg-orange-600 text-white rounded-full hover:bg-orange-500 shadow-xl shadow-orange-900/40">
                                    <Send className="w-5 h-5" />
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
        <div className="lg:col-span-3 hidden lg:block space-y-10">
            <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 shadow-2xl backdrop-blur-3xl md:sticky md:top-40">
                <h3 className="text-[10px] text-orange-500 font-black uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                    <Layers className="w-5 h-5" /> Data_Grid
                </h3>
                <div className="space-y-8">
                    {['#DeepSeek_v3', '#NextJS_16', '#Turbopack', '#Tailwind_v4'].map((tag) => (
                        <div key={tag} className="flex flex-col gap-2 group cursor-pointer">
                            <div className="flex justify-between items-center text-[11px] font-black text-zinc-500 group-hover:text-white transition-colors">
                              <span>{tag}</span>
                              <Zap className="w-3 h-3 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="w-full h-[1px] bg-white/5">
                               <motion.div 
                                 initial={{ width: "0%" }} 
                                 animate={{ width: "100%" }} 
                                 transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                 className="h-full bg-gradient-to-r from-transparent via-orange-600 to-transparent" 
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
      `}</style>
      <Footer/>
    </div>
  );
}