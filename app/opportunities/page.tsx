'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, 
  serverTimestamp, doc, updateDoc, deleteDoc, where 
} from 'firebase/firestore';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Target, Briefcase, Users, Zap, Plus, Rocket, 
  ShieldCheck, Globe, Trash2, Edit3, FolderHeart, 
  FileText, CheckCircle2, Eye, X, Sparkles, DollarSign, Activity
} from 'lucide-react';
import Header from '../Home/header';
import Footer from '../Home/Footer';

export default function OpportunitiesPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [gigs, setGigs] = useState<any[]>([]);
  const [apps, setApps] = useState<any[]>([]); 
  const [allIncomingApps, setAllIncomingApps] = useState<any[]>([]); 
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState<any[] | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'job' | 'referral' | 'squad'>('all');
  const [viewMode, setViewMode] = useState<'global' | 'mine' | 'apps'>('global');
  
  const [newGig, setNewGig] = useState({ title: "", desc: "", type: "job", budget: "", tags: "" });

  useEffect(() => {
    setHasMounted(true);
    const unsubAuth = auth.onAuthStateChanged(u => setUser(u));
    const q = query(collection(db, "opportunities"), orderBy("timestamp", "desc"));
    const unsubData = onSnapshot(q, (snap) => {
      setGigs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubAuth(); unsubData(); };
  }, []);

  useEffect(() => {
    if (!user) return;
    const qMyApps = query(collection(db, "applications"), where("applicantId", "==", user.uid));
    const unsubMyApps = onSnapshot(qMyApps, (snap) => {
      setApps(snap.docs.map(doc => doc.data().gigId));
    });
    const qIncoming = query(collection(db, "applications"));
    const unsubIncoming = onSnapshot(qIncoming, (snap) => {
      setAllIncomingApps(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubMyApps(); unsubIncoming(); };
  }, [user]);

  const displayedGigs = gigs.filter(g => {
    if (viewMode === 'mine') return g.authorId === user?.uid;
    if (viewMode === 'apps') return apps.includes(g.id);
    return filter === 'all' || g.type === filter;
  });

  const handleApply = async (gig: any) => {
    if (!user) return alert("Pehle Login karo bhai!");
    const portLink = window.prompt("Bhai, apni Portfolio ya Resume link yahan paste karo:");
    if (!portLink || portLink.trim() === "") return alert("Application cancel: Link zaroori hai!");

    try {
      await addDoc(collection(db, "applications"), {
        gigId: gig.id,
        applicantId: user.uid,
        applicantName: user.displayName || "Elite User",
        applicantEmail: user.email || "N/A",
        portfolioURL: portLink,
        gigTitle: gig.title,
        postedBy: gig.authorId,
        timestamp: serverTimestamp()
      });
      alert("Application Sent! 🚀");
    } catch (e) { console.error(e); }
  };

  const handlePostOrUpdate = async () => {
    if (!newGig.title || !user) return;
    const gigData = { 
      ...newGig, 
      authorId: user.uid, 
      authorName: user.displayName || "Elite Member", 
      timestamp: serverTimestamp(), 
      tags: typeof newGig.tags === 'string' ? newGig.tags.split(',').map(t => t.trim()) : newGig.tags 
    };
    if (isEditing) await updateDoc(doc(db, "opportunities", isEditing), gigData);
    else await addDoc(collection(db, "opportunities"), gigData);
    setIsEditing(null); setShowModal(false);
    setNewGig({ title: "", desc: "", type: "job", budget: "", tags: "" });
  };

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-orange-600/30 font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 backdrop-blur-md"><Header /></div>

      {/* 🌌 ANIMATED BACKGROUND GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-orange-600/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" 
        />
      </div>

      <main className="max-w-7xl mx-auto pt-32 md:pt-44 p-4 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* --- SIDEBAR: GLASS ANIMATION --- */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ x: -50, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 md:sticky md:top-44 backdrop-blur-3xl shadow-2xl"
          >
             <div className="space-y-2">
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-4 ml-2">Market_Filters</p>
                {[
                  { id: 'all', label: 'Global Market', icon: Globe },
                  { id: 'job', label: 'Direct Jobs', icon: Briefcase },
                  { id: 'referral', label: 'Referrals', icon: ShieldCheck },
                  { id: 'squad', label: 'Startup Squad', icon: Rocket }
                ].map((t) => (
                  <motion.button 
                    whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                    whileTap={{ scale: 0.95 }}
                    key={t.id} 
                    onClick={() => {setFilter(t.id as any); setViewMode('global');}} 
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t.id && viewMode === 'global' ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <t.icon className="w-4 h-4" /> {t.label}
                  </motion.button>
                ))}
                <div className="pt-6 mt-6 border-t border-white/10 space-y-2">
                   <motion.button whileHover={{ x: 5 }} onClick={() => setViewMode('mine')} className={`w-full flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase transition-all ${viewMode === 'mine' ? 'bg-orange-600 text-white shadow-orange-900/20' : 'text-zinc-500'}`}><FolderHeart className="w-4 h-4" /> My Postings</motion.button>
                   <motion.button whileHover={{ x: 5 }} onClick={() => setViewMode('apps')} className={`w-full flex items-center gap-3 p-4 rounded-2xl text-[10px] font-black uppercase transition-all ${viewMode === 'apps' ? 'bg-blue-600 text-white shadow-blue-900/20' : 'text-zinc-500'}`}><FileText className="w-4 h-4" /> My Applications</motion.button>
                </div>
             </div>
          </motion.div>
        </div>

        {/* --- MAIN FEED --- */}
        <div className="lg:col-span-9 space-y-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row justify-between items-end gap-6"
          >
            <div>
              <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                {viewMode === 'apps' ? 'APPLIED' : viewMode === 'mine' ? 'MANAGED' : 'MARKET'}<span className="text-orange-600">.</span>
              </h1>
              <div className="flex items-center gap-2 mt-4 text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em]">
                <Activity className="w-3 h-3 text-orange-500 animate-pulse" /> Neural_Network_Active
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsEditing(null); setShowModal(true); }} 
              className="bg-white text-black px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-2xl"
            >
               <Plus className="w-5 h-5" /> Deploy Gig
            </motion.button>
          </motion.div>

          <LayoutGroup>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
              <AnimatePresence mode="popLayout">
                {displayedGigs.map((gig, idx) => {
                  const applicants = allIncomingApps.filter(a => a.gigId === gig.id);
                  const isOwner = gig.authorId === user?.uid;
                  const hasApplied = apps.includes(gig.id);

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      key={gig.id} 
                      className={`bg-white/[0.02] border ${isOwner ? 'border-orange-500/20' : 'border-white/5'} p-8 rounded-[3.5rem] backdrop-blur-xl relative group overflow-hidden hover:bg-white/[0.04] transition-colors`}
                    >
                      {isOwner && (
                        <div className="absolute top-8 right-8 flex gap-2 z-20">
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => setSelectedApplicants(applicants)} className="bg-orange-600/10 text-orange-500 p-2 rounded-xl text-[9px] font-black flex items-center gap-2 border border-orange-500/20 hover:bg-orange-600 hover:text-white transition-all"><Eye className="w-3 h-3" /> {applicants.length}</motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => {setNewGig({title: gig.title, desc: gig.desc, type: gig.type, budget: gig.budget || "", tags: gig.tags?.join(", ") || ""}); setIsEditing(gig.id); setShowModal(true);}} className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-white"><Edit3 className="w-4 h-4" /></motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteDoc(doc(db, "opportunities", gig.id))} className="p-2 bg-white/5 rounded-xl text-zinc-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></motion.button>
                        </div>
                      )}
                      
                      <div className={`w-fit px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-6 ${gig.type === 'job' ? 'bg-zinc-800 text-zinc-400' : 'bg-orange-600/10 text-orange-500'}`}>{gig.type}</div>
                      <h3 className="text-2xl font-black italic text-white mb-4 uppercase line-clamp-1 group-hover:text-orange-500 transition-colors">{gig.title}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{gig.desc}</p>

                      <div className="flex flex-wrap gap-2 mb-10">
                        {gig.tags?.map((tag: string, i: number) => (
                           <span key={i} className="text-[8px] font-black uppercase text-zinc-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">#{tag}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-white/5">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{gig.authorName}</span>
                            <span className="text-[8px] text-zinc-600 font-bold mt-1 uppercase flex items-center gap-1"><DollarSign className="w-3 h-3 text-orange-500" /> {gig.budget || "Competitive"}</span>
                         </div>
                         
                         {hasApplied ? (
                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-500 font-black text-[10px] uppercase tracking-widest bg-green-500/10 px-6 py-2.5 rounded-full">
                              <CheckCircle2 className="w-4 h-4" /> Applied
                           </motion.div>
                         ) : !isOwner && (
                           <motion.button 
                            whileHover={{ scale: 1.1, x: 5 }} 
                            whileTap={{ scale: 0.9 }} 
                            onClick={() => handleApply(gig)} 
                            className="bg-orange-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
                           >
                             Apply Now <Zap className="w-3 h-3 fill-current" />
                           </motion.button>
                         )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </main>

      {/* --- APPLICANTS MODAL: SLIDE IN --- */}
      <AnimatePresence>
        {selectedApplicants && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApplicants(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div 
              initial={{ y: 100, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 100, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 p-10 rounded-[3rem] max-w-md w-full relative z-10 shadow-2xl"
            >
               <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black italic uppercase tracking-widest text-orange-500">Incoming_Apps</h2>
                  <button onClick={() => setSelectedApplicants(null)}><X className="w-6 h-6 text-zinc-500 hover:text-white transition-colors" /></button>
               </div>
               <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-hide">
                  {selectedApplicants.map((app) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={app.id} className="bg-white/5 p-5 rounded-[1.5rem] border border-white/5 flex justify-between items-center group hover:border-orange-500/50 transition-all">
                       <div className="flex-1">
                          <p className="text-white font-black italic text-sm">{app.applicantName}</p>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 line-clamp-1">{app.applicantEmail}</p>
                       </div>
                       <a 
                         href={app.portfolioURL?.startsWith('http') ? app.portfolioURL : `https://${app.portfolioURL}`} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-[9px] font-black uppercase text-orange-500 px-4 py-2 border border-orange-500/20 rounded-lg hover:bg-orange-600 hover:text-white transition-all shadow-lg"
                       >
                         Profile
                       </a>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DEPLOY MODAL: POP UP --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotate: -2 }} 
              animate={{ scale: 1, opacity: 1, rotate: 0 }} 
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 p-10 rounded-[4rem] max-w-2xl w-full relative z-10 shadow-2xl"
            >
               <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-10">{isEditing ? 'SYNC_UPDATE' : 'DEPLOY_GIG'}</h2>
               <div className="grid grid-cols-3 gap-3 mb-6">
                  {['job', 'referral', 'squad'].map(t => (
                    <button key={t} onClick={() => setNewGig({...newGig, type: t})} className={`p-4 rounded-2xl border font-black text-[9px] uppercase tracking-widest transition-all ${newGig.type === t ? 'bg-white text-black' : 'bg-black/50 border-white/5 text-zinc-600 hover:text-white'}`}>{t}</button>
                  ))}
               </div>
               <div className="space-y-4">
                  <input value={newGig.title} onChange={e => setNewGig({...newGig, title: e.target.value})} placeholder="Title (e.g. Senior Backend Dev)" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-500 text-sm font-medium text-white transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={newGig.budget} onChange={e => setNewGig({...newGig, budget: e.target.value})} placeholder="Budget/Salary" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-500 text-sm font-medium text-white transition-colors" />
                    <input value={newGig.tags} onChange={e => setNewGig({...newGig, tags: e.target.value})} placeholder="Skills (comma separated)" className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-500 text-sm font-medium text-white transition-colors" />
                  </div>
                  <textarea value={newGig.desc} onChange={e => setNewGig({...newGig, desc: e.target.value})} placeholder="Full details..." className="w-full h-40 bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-orange-600 text-sm font-medium text-white resize-none transition-colors" />
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePostOrUpdate} 
                    className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase text-[11px] shadow-xl shadow-orange-900/40"
                  >
                    Execute_Broadcast
                  </motion.button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>

      <Footer/>
    </div>
  );
}