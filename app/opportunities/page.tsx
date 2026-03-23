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
  FileText, CheckCircle2, Eye, X, Sparkles, DollarSign, Activity, SearchX
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

  // BACKEND LOGIC - UNTOUCHED
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
    const portLink = window.prompt("Drop your Portfolio or Resume link to apply:");
    if (!portLink || portLink.trim() === "") return alert("Application cancelled: Link is required!");

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
    <div className="min-h-screen bg-[#030014] text-white selection:bg-orange-500/30 font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 backdrop-blur-xl bg-[#030014]/80"><Header /></div>

      {/* 🌌 ANIMATED AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-orange-600/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-violet-600/20 blur-[120px] rounded-full" 
        />
      </div>

      <main className="max-w-7xl mx-auto pt-32 md:pt-40 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* --- SIDEBAR: NAVIGATION & FILTERS --- */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ x: -30, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 md:sticky md:top-36 backdrop-blur-2xl shadow-2xl"
          >
             <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4 ml-2 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Market Filters
                </p>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'Global Feed', icon: Globe },
                    { id: 'job', label: 'Direct Jobs', icon: Briefcase },
                    { id: 'referral', label: 'Referrals', icon: ShieldCheck },
                    { id: 'squad', label: 'Startup Squad', icon: Rocket }
                  ].map((t) => (
                    <motion.button 
                      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
                      whileTap={{ scale: 0.98 }}
                      key={t.id} 
                      onClick={() => {setFilter(t.id as any); setViewMode('global');}} 
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                        filter === t.id && viewMode === 'global' 
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                        : 'text-zinc-400 border-transparent hover:text-white'
                      }`}
                    >
                      <t.icon className={`w-4 h-4 ${filter === t.id && viewMode === 'global' ? 'text-orange-400' : 'text-zinc-500'}`} /> {t.label}
                    </motion.button>
                  ))}
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.05] space-y-1">
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-3 ml-2 flex items-center gap-2">
                     <FolderHeart className="w-3 h-3" /> Personal Desk
                   </p>
                   <motion.button 
                     whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                     onClick={() => setViewMode('mine')} 
                     className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                       viewMode === 'mine' ? 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'text-zinc-400 border-transparent hover:text-white hover:bg-white/[0.03]'
                     }`}
                   >
                     <Target className="w-4 h-4" /> My Postings
                   </motion.button>
                   <motion.button 
                     whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                     onClick={() => setViewMode('apps')} 
                     className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                       viewMode === 'apps' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'text-zinc-400 border-transparent hover:text-white hover:bg-white/[0.03]'
                     }`}
                   >
                     <FileText className="w-4 h-4" /> My Applications
                   </motion.button>
                </div>
             </div>
          </motion.div>
        </div>

        {/* --- MAIN FEED --- */}
        <div className="lg:col-span-9 space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/[0.02] p-8 rounded-3xl border border-white/[0.05] backdrop-blur-md shadow-lg"
          >
            <div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 drop-shadow-sm">
                {viewMode === 'apps' ? 'MY APPLICATIONS' : viewMode === 'mine' ? 'MANAGED GIGS' : 'OPPORTUNITY HUB'}<span className="text-orange-500">.</span>
              </h1>
              <div className="flex items-center gap-2 mt-4 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] bg-orange-500/10 w-fit px-3 py-1 rounded-full border border-orange-500/20">
                <Activity className="w-3 h-3 animate-pulse" /> Live Neural Network
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsEditing(null); setShowModal(true); }} 
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.5)] transition-all border border-orange-500/30"
            >
               <Plus className="w-4 h-4" /> Deploy Gig
            </motion.button>
          </motion.div>

          <LayoutGroup>
            <motion.div layout className="pb-32">
              <AnimatePresence mode="popLayout">
                {displayedGigs.length === 0 ? (
                  // EMPTY STATE
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="w-full py-20 flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/[0.1] rounded-3xl text-center"
                  >
                    <SearchX className="w-16 h-16 text-zinc-600 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-300">No Opportunities Found</h3>
                    <p className="text-zinc-500 text-sm mt-2">Try changing your filters or deploy a new gig to the network.</p>
                  </motion.div>
                ) : (
                  // GIG GRID
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedGigs.map((gig, idx) => {
                      const applicants = allIncomingApps.filter(a => a.gigId === gig.id);
                      const isOwner = gig.authorId === user?.uid;
                      const hasApplied = apps.includes(gig.id);

                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: idx * 0.05 }}
                          key={gig.id} 
                          className={`bg-white/[0.02] border ${isOwner ? 'border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.05)]' : 'border-white/[0.05]'} p-8 rounded-3xl backdrop-blur-xl relative group overflow-hidden hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}
                        >
                          {/* Owner Controls */}
                          {isOwner && (
                            <div className="absolute top-6 right-6 flex gap-2 z-20">
                              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSelectedApplicants(applicants)} className="bg-violet-500/10 text-violet-400 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-violet-500/30 hover:bg-violet-500 hover:text-white transition-all shadow-lg">
                                <Users className="w-3 h-3" /> {applicants.length} Apps
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} onClick={() => {setNewGig({title: gig.title, desc: gig.desc, type: gig.type, budget: gig.budget || "", tags: gig.tags?.join(", ") || ""}); setIsEditing(gig.id); setShowModal(true);}} className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"><Edit3 className="w-3.5 h-3.5" /></motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteDoc(doc(db, "opportunities", gig.id))} className="p-1.5 bg-white/5 border border-white/10 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></motion.button>
                            </div>
                          )}
                          
                          <div className={`w-fit px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-5 border ${
                            gig.type === 'job' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                            gig.type === 'squad' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-orange-500/10 text-orange-400 border-orange-500/20'
                          }`}>
                            {gig.type}
                          </div>

                          <h3 className="text-xl md:text-2xl font-black text-white mb-3 pr-16 leading-tight group-hover:text-orange-400 transition-colors">{gig.title}</h3>
                          <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[4.5rem]">{gig.desc}</p>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {gig.tags?.map((tag: string, i: number) => (
                               <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 bg-black/40 px-3 py-1.5 rounded-lg border border-white/[0.05]">#{tag}</span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Posted By</span>
                                <span className="text-xs font-bold text-white tracking-wide">{gig.authorName}</span>
                                <span className="text-[10px] text-green-400 font-bold mt-1 uppercase flex items-center gap-1 bg-green-400/10 w-fit px-2 py-0.5 rounded border border-green-400/20">
                                  <DollarSign className="w-3 h-3" /> {gig.budget || "Competitive"}
                                </span>
                             </div>
                             
                             {hasApplied ? (
                               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-5 py-2.5 rounded-xl">
                                  <CheckCircle2 className="w-4 h-4" /> Applied
                               </motion.div>
                             ) : !isOwner && (
                               <motion.button 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }} 
                                onClick={() => handleApply(gig)} 
                                className="bg-white text-black hover:bg-zinc-200 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transition-colors"
                               >
                                  Apply <Zap className="w-3 h-3 fill-current" />
                               </motion.button>
                             )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </main>

      {/* --- APPLICANTS MODAL --- */}
      <AnimatePresence>
        {selectedApplicants && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApplicants(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-950 border border-white/10 p-8 rounded-3xl max-w-lg w-full relative z-10 shadow-2xl overflow-hidden"
            >
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                  <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-violet-500" /> Incoming Applications
                  </h2>
                  <button onClick={() => setSelectedApplicants(null)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X className="w-4 h-4 text-zinc-400" /></button>
               </div>
               <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedApplicants.length === 0 ? (
                    <p className="text-center text-zinc-500 text-sm py-10 font-medium">No applications yet. Hang tight!</p>
                  ) : (
                    selectedApplicants.map((app) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={app.id} className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-violet-500/50 hover:bg-white/[0.04] transition-all">
                         <div className="flex-1">
                            <p className="text-white font-bold text-sm">{app.applicantName}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">{app.applicantEmail}</p>
                         </div>
                         <a 
                           href={app.portfolioURL?.startsWith('http') ? app.portfolioURL : `https://${app.portfolioURL}`} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-[10px] font-bold uppercase tracking-widest text-violet-400 bg-violet-500/10 px-4 py-2 border border-violet-500/20 rounded-xl hover:bg-violet-500 hover:text-white transition-all"
                         >
                           View Profile
                         </a>
                      </motion.div>
                    ))
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DEPLOY MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 p-8 rounded-3xl max-w-2xl w-full relative z-10 shadow-2xl"
            >
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                   {isEditing ? <><Edit3 className="text-orange-500"/> Update Gig</> : <><Rocket className="text-orange-500"/> Deploy Gig</>}
                 </h2>
                 <button onClick={() => setShowModal(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors"><X className="w-5 h-5 text-zinc-400" /></button>
               </div>

               {/* Segmented Control for Gig Type */}
               <div className="flex bg-black p-1.5 rounded-xl border border-white/10 mb-6">
                  {['job', 'referral', 'squad'].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setNewGig({...newGig, type: t})} 
                      className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        newGig.type === t ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
               </div>

               <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Opportunity Title</label>
                    <input value={newGig.title} onChange={e => setNewGig({...newGig, title: e.target.value})} placeholder="e.g. Senior Full Stack Engineer" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white/[0.04] text-sm font-medium text-white transition-all shadow-inner" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Budget / Compensation</label>
                      <input value={newGig.budget} onChange={e => setNewGig({...newGig, budget: e.target.value})} placeholder="e.g. $10k-$15k / Equity" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white/[0.04] text-sm font-medium text-white transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Tags (Comma Separated)</label>
                      <input value={newGig.tags} onChange={e => setNewGig({...newGig, tags: e.target.value})} placeholder="React, Node.js, Remote" className="w-full bg-white/[0.02] border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white/[0.04] text-sm font-medium text-white transition-all shadow-inner" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Full Description</label>
                    <textarea value={newGig.desc} onChange={e => setNewGig({...newGig, desc: e.target.value})} placeholder="Describe the role, responsibilities, and requirements..." className="w-full h-32 bg-white/[0.02] border border-white/10 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white/[0.04] text-sm font-medium text-white resize-none transition-all shadow-inner custom-scrollbar" />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePostOrUpdate} 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-5 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] border border-orange-500/30 mt-2"
                  >
                    {isEditing ? 'Save Changes' : 'Execute Broadcast'}
                  </motion.button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <Footer/>
    </div>
  );
}