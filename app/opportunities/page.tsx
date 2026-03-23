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
  FileText, CheckCircle2, Eye, X, Sparkles, DollarSign, Activity, SearchX, ArrowRight
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

  // --------------------------------------------------------
  // BACKEND LOGIC - 100% UNTOUCHED
  // --------------------------------------------------------
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
    if (!user) return alert("Please Login to apply!");
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
      alert("Application Sent Successfully! 🚀");
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

  // --------------------------------------------------------
  // ULTRA-PREMIUM UI/UX
  // --------------------------------------------------------
  const springConfig = { type: "spring", stiffness: 300, damping: 30 };

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full z-[100] border-b border-white/[0.04] backdrop-blur-2xl bg-black/60"><Header /></div>

      {/* 🌌 ULTRA-MINIMAL AMBIENT GLOWS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-500/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.02, 0.05, 0.02] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/20 blur-[150px] rounded-full" 
        />
      </div>

      <main className="max-w-7xl mx-auto pt-32 md:pt-40 p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* --- SIDEBAR: SLEEK CONTROL PANEL --- */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={springConfig}
            className="md:sticky md:top-36 space-y-8"
          >
             {/* Market Filters */}
             <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Explore Hub
                </p>
                <div className="space-y-1 bg-[#09090B] border border-white/[0.04] p-1.5 rounded-2xl shadow-2xl">
                  {[
                    { id: 'all', label: 'Global Feed', icon: Globe },
                    { id: 'job', label: 'Direct Jobs', icon: Briefcase },
                    { id: 'referral', label: 'Referrals', icon: ShieldCheck },
                    { id: 'squad', label: 'Startup Squad', icon: Rocket }
                  ].map((t) => {
                    const isActive = filter === t.id && viewMode === 'global';
                    return (
                      <button 
                        key={t.id} 
                        onClick={() => {setFilter(t.id as any); setViewMode('global');}} 
                        className={`w-full relative flex items-center gap-3 p-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          isActive ? 'text-cyan-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                        }`}
                      >
                        {isActive && <motion.div layoutId="activeFilter" className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/20 rounded-xl" transition={springConfig} />}
                        <t.icon className="w-4 h-4 relative z-10" /> 
                        <span className="relative z-10">{t.label}</span>
                      </button>
                    )
                  })}
                </div>
             </div>

             {/* Personal Desk */}
             <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <FolderHeart className="w-3 h-3" /> Personal Desk
                </p>
                <div className="space-y-1 bg-[#09090B] border border-white/[0.04] p-1.5 rounded-2xl shadow-2xl">
                   <button 
                     onClick={() => setViewMode('mine')} 
                     className={`w-full relative flex items-center gap-3 p-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                       viewMode === 'mine' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                     }`}
                   >
                     {viewMode === 'mine' && <motion.div layoutId="activePersonal" className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-xl" transition={springConfig} />}
                     <Target className="w-4 h-4 relative z-10" /> 
                     <span className="relative z-10">My Postings</span>
                   </button>
                   
                   <button 
                     onClick={() => setViewMode('apps')} 
                     className={`w-full relative flex items-center gap-3 p-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                       viewMode === 'apps' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
                     }`}
                   >
                     {viewMode === 'apps' && <motion.div layoutId="activePersonal" className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl" transition={springConfig} />}
                     <FileText className="w-4 h-4 relative z-10" /> 
                     <span className="relative z-10">My Applications</span>
                   </button>
                </div>
             </div>
          </motion.div>
        </div>

        {/* --- MAIN FEED --- */}
        <div className="lg:col-span-9 space-y-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={springConfig}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/[0.04]"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                {viewMode === 'apps' ? 'My Applications' : viewMode === 'mine' ? 'Managed Gigs' : 'Opportunity Hub'}
              </h1>
              <div className="flex items-center gap-2 mt-4 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Activity className="w-3 h-3 animate-pulse" /> Network Sync Active
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setIsEditing(null); setShowModal(true); }} 
              className="relative group px-6 py-3.5 rounded-full overflow-hidden font-bold text-xs uppercase tracking-widest text-white"
            >
               <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-emerald-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
               <div className="absolute inset-[1px] bg-black rounded-full" />
               <div className="relative flex items-center gap-2 z-10 group-hover:text-cyan-300 transition-colors">
                 <Plus className="w-4 h-4" /> Deploy Gig
               </div>
            </motion.button>
          </motion.div>

          <LayoutGroup>
            <motion.div layout className="pb-32">
              <AnimatePresence mode="popLayout">
                {displayedGigs.length === 0 ? (
                  // ULTRA-PREMIUM EMPTY STATE
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="w-full py-32 flex flex-col items-center justify-center bg-[#050505] border border-white/[0.03] rounded-[2rem] text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />
                    <SearchX className="w-12 h-12 text-zinc-700 mb-6 relative z-10" />
                    <h3 className="text-xl font-medium text-zinc-300 relative z-10 tracking-tight">No Opportunities Found</h3>
                    <p className="text-zinc-600 text-sm mt-2 relative z-10">Adjust your filters or initiate a new deployment.</p>
                  </motion.div>
                ) : (
                  // BENTO BOX STYLE GIG GRID
                  <div className="grid grid-cols-1 gap-6">
                    {displayedGigs.map((gig, idx) => {
                      const applicants = allIncomingApps.filter(a => a.gigId === gig.id);
                      const isOwner = gig.authorId === user?.uid;
                      const hasApplied = apps.includes(gig.id);

                      return (
                        <motion.div 
                          layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05, ...springConfig }}
                          key={gig.id} 
                          className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-transparent overflow-hidden group hover:from-cyan-500/30 transition-colors duration-500"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          
                          <div className="relative bg-[#050505] p-6 md:p-8 rounded-[calc(2rem-1px)] h-full">
                            
                            {/* Owner Controls */}
                            {isOwner && (
                              <div className="absolute top-6 right-6 flex gap-2 z-20">
                                <button onClick={() => setSelectedApplicants(applicants)} className="bg-white/[0.03] text-zinc-300 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/[0.05] hover:bg-white/[0.1] transition-all">
                                  <Users className="w-3 h-3" /> {applicants.length}
                                </button>
                                <button onClick={() => {setNewGig({title: gig.title, desc: gig.desc, type: gig.type, budget: gig.budget || "", tags: gig.tags?.join(", ") || ""}); setIsEditing(gig.id); setShowModal(true);}} className="p-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => deleteDoc(doc(db, "opportunities", gig.id))} className="p-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border ${
                                gig.type === 'job' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                                gig.type === 'squad' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {gig.type}
                              </div>
                              <span className="text-[10px] text-zinc-600 font-medium">{new Date(gig.timestamp?.toDate()).toLocaleDateString() || 'Just now'}</span>
                            </div>

                            <h3 className="text-2xl font-medium tracking-tight text-zinc-100 mb-3 pr-16 group-hover:text-cyan-300 transition-colors">{gig.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2 max-w-4xl">{gig.desc}</p>

                            <div className="flex flex-wrap gap-2 mb-8">
                              {gig.tags?.map((tag: string, i: number) => (
                                 <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-[#0A0A0A] px-3 py-1.5 rounded-lg border border-white/[0.03]">#{tag}</span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
                               <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Posted By</span>
                                  <span className="text-xs font-medium text-zinc-300">{gig.authorName}</span>
                                  <span className="text-[10px] text-emerald-400 font-bold mt-1 uppercase flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> {gig.budget || "Competitive"}
                                  </span>
                               </div>
                               
                               {hasApplied ? (
                                 <div className="flex items-center gap-2 text-emerald-400 font-bold text-[10px] uppercase tracking-widest">
                                    <CheckCircle2 className="w-4 h-4" /> Application Sent
                                 </div>
                               ) : !isOwner && (
                                 <motion.button 
                                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                                  onClick={() => handleApply(gig)} 
                                  className="group/btn relative px-6 py-2.5 rounded-xl overflow-hidden font-bold text-[10px] uppercase tracking-widest text-zinc-300 border border-white/[0.1] hover:border-cyan-500/50 transition-colors"
                                 >
                                    <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    <div className="relative flex items-center gap-2 z-10 group-hover/btn:text-cyan-300">
                                      Apply Now <ArrowRight className="w-3 h-3" />
                                    </div>
                                 </motion.button>
                               )}
                            </div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedApplicants(null)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={springConfig}
              className="bg-[#050505] border border-white/[0.08] p-8 rounded-[2rem] max-w-lg w-full relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/[0.04]">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" /> Incoming Applications
                  </h2>
                  <button onClick={() => setSelectedApplicants(null)} className="bg-white/[0.05] p-1.5 rounded-full hover:bg-white/[0.1] transition-colors"><X className="w-4 h-4 text-zinc-400" /></button>
               </div>
               <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedApplicants.length === 0 ? (
                    <p className="text-center text-zinc-600 text-sm py-10 font-medium tracking-tight">No applications yet. Hang tight!</p>
                  ) : (
                    selectedApplicants.map((app) => (
                      <div key={app.id} className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/[0.03] flex justify-between items-center group hover:border-cyan-500/30 transition-all">
                         <div className="flex-1">
                            <p className="text-zinc-200 font-medium text-sm tracking-tight">{app.applicantName}</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{app.applicantEmail}</p>
                         </div>
                         <a 
                           href={app.portfolioURL?.startsWith('http') ? app.portfolioURL : `https://${app.portfolioURL}`} 
                           target="_blank" rel="noopener noreferrer"
                           className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-4 py-2 border border-cyan-500/20 rounded-xl hover:bg-cyan-500 hover:text-white transition-all"
                         >
                           Profile
                         </a>
                      </div>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={springConfig}
              className="bg-[#050505] border border-white/[0.08] p-8 md:p-10 rounded-[2rem] max-w-2xl w-full relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-medium tracking-tight flex items-center gap-3 text-zinc-100">
                   {isEditing ? <><Edit3 className="text-amber-400 w-5 h-5"/> Update Configuration</> : <><Rocket className="text-cyan-400 w-5 h-5"/> Deploy Opportunity</>}
                 </h2>
                 <button onClick={() => setShowModal(false)} className="bg-white/[0.05] p-2 rounded-full hover:bg-white/[0.1] transition-colors"><X className="w-4 h-4 text-zinc-400" /></button>
               </div>

               {/* Segmented Control */}
               <div className="flex bg-[#0A0A0A] p-1.5 rounded-xl border border-white/[0.04] mb-8">
                  {['job', 'referral', 'squad'].map(t => (
                    <button 
                      key={t} onClick={() => setNewGig({...newGig, type: t})} 
                      className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 relative ${
                        newGig.type === t ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    >
                      {newGig.type === t && <motion.div layoutId="gigType" className="absolute inset-0 bg-white/[0.08] border border-white/[0.05] rounded-lg" transition={springConfig} />}
                      <span className="relative z-10">{t}</span>
                    </button>
                  ))}
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Opportunity Title</label>
                    <input value={newGig.title} onChange={e => setNewGig({...newGig, title: e.target.value})} placeholder="e.g. Senior Full Stack Engineer" className="w-full bg-[#0A0A0A] border border-white/[0.04] p-4 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/[0.02] text-sm font-medium text-zinc-200 transition-all placeholder:text-zinc-700" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Budget / Compensation</label>
                      <input value={newGig.budget} onChange={e => setNewGig({...newGig, budget: e.target.value})} placeholder="e.g. $10k-$15k / Equity" className="w-full bg-[#0A0A0A] border border-white/[0.04] p-4 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/[0.02] text-sm font-medium text-zinc-200 transition-all placeholder:text-zinc-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Tags (Comma Separated)</label>
                      <input value={newGig.tags} onChange={e => setNewGig({...newGig, tags: e.target.value})} placeholder="React, Node.js, Remote" className="w-full bg-[#0A0A0A] border border-white/[0.04] p-4 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/[0.02] text-sm font-medium text-zinc-200 transition-all placeholder:text-zinc-700" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Description</label>
                    <textarea value={newGig.desc} onChange={e => setNewGig({...newGig, desc: e.target.value})} placeholder="Describe the role, responsibilities, and requirements..." className="w-full h-32 bg-[#0A0A0A] border border-white/[0.04] p-4 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/[0.02] text-sm font-medium text-zinc-200 resize-none transition-all placeholder:text-zinc-700 custom-scrollbar" />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePostOrUpdate} 
                    className="w-full relative group px-6 py-4 rounded-xl overflow-hidden font-bold text-[11px] uppercase tracking-widest text-zinc-100 mt-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-emerald-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex justify-center items-center gap-2 z-10">
                      {isEditing ? 'Save Configuration' : 'Execute Deployment'} <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>

      <Footer/>
    </div>
  );
}