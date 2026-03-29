'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Globe, Building2, MapPin, DollarSign, 
  ExternalLink, Zap, Search, RefreshCw, ArrowLeft, 
  ShieldCheck, Sparkles, Filter, Bookmark, ChevronDown, Plus
} from 'lucide-react';
import Link from 'next/link';

interface Job {
  id: string;
  role: string;
  company: string;
  location: string;
  salary: string;
  match_score: number;
  description: string;
  apply_link: string;
  posted: string;
}

export default function JobAggregator() {
    const [userData, setUserData] = useState<any>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [page, setPage] = useState(1); // 🔴 Page Tracking for Pagination

    // 1. Fetch User Skills
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                onSnapshot(doc(db, "portfolios", user.uid), (docSnap) => {
                    setUserData(docSnap.data() || {});
                    setIsAuthLoading(false);
                });
            } else {
                setIsAuthLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // 2. AI Job Fetcher (Appends to existing list)
    const fetchJobs = async (isInitial = false) => {
        setIsFetching(true);
        const puter = (window as any).puter;
        
        const skills = userData?.skills?.map((s: any) => s.category).join(", ") || "Full Stack Development, React, Node.js";
        const currentPage = isInitial ? 1 : page + 1;

        const prompt = `
            Act as an AI Job Aggregator (Year 2026).
            Skills: [${skills}].
            Page Offset: ${currentPage}.
            
            Task: Generate 6 UNIQUE tech job openings. Do not repeat previous ones.
            Vary the companies (Big Tech vs Unicorn Startups).
            
            Output strictly as JSON array:
            [{ "id": "uuid-${currentPage}-\${index}", "role": "", "company": "", "location": "", "salary": "", "match_score": 95, "description": "", "apply_link": "", "posted": "Just Now" }]
        `;

        try {
            const response = await puter.ai.chat(prompt);
            const cleanJson = response.toString().replace(/```json|```/g, "").trim();
            const newJobs = JSON.parse(cleanJson);
            
            if (isInitial) {
                setJobs(newJobs);
                setPage(1);
            } else {
                setJobs(prev => [...prev, ...newJobs]);
                setPage(currentPage);
            }
        } catch (err) {
            console.error("Aggregation Error:", err);
        }
        setIsFetching(false);
    };

    useEffect(() => {
        if (!isAuthLoading && userData) fetchJobs(true);
    }, [isAuthLoading, userData]);

    if (isAuthLoading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] animate-pulse">CONNECTING_TO_GLOBAL_FEED...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#000] text-zinc-100 font-sans p-4 md:p-10 relative selection:bg-cyan-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
                    <div className="space-y-4">
                        <Link href="/analytics">
                            <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <ArrowLeft size={14} /> Neural Hub
                            </motion.button>
                        </Link>
                        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none">
                            Career <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Pipeline.</span>
                        </h1>
                    </div>
                    
                    <button 
                        onClick={() => fetchJobs(true)} 
                        disabled={isFetching}
                        className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all hover:bg-cyan-400 shadow-[0_10px_40px_rgba(255,255,255,0.1)] disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isFetching ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} /> 
                        Refresh Stream
                    </button>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left: Jobs Stream */}
                    <div className="lg:col-span-8 space-y-8">
                        <AnimatePresence mode="popLayout">
                            {jobs.map((job, index) => (
                                <motion.div 
                                    key={job.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (index % 6) * 0.1 }}
                                    className="group relative bg-[#050505] border border-white/5 hover:border-cyan-500/30 rounded-[3rem] p-8 md:p-12 transition-all duration-700 overflow-hidden"
                                >
                                    {/* Glass Highlight */}
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex flex-col gap-8">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="px-4 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                                                        <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">{job.match_score}% Skill Match</span>
                                                    </div>
                                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{job.posted}</span>
                                                </div>
                                                <h3 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">{job.role}</h3>
                                            </div>
                                            <div className="hidden sm:block">
                                                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-cyan-500/30 transition-all">
                                                    <Building2 className="text-zinc-600 group-hover:text-cyan-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Match Progress Bar */}
                                        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${job.match_score}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500" 
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
                                            <div className="space-y-1">
                                                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Company</p>
                                                <p className="font-bold text-zinc-300">{job.company}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Location</p>
                                                <p className="font-bold text-zinc-300">{job.location}</p>
                                            </div>
                                            <div className="space-y-1 col-span-2 md:col-span-1">
                                                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Package (Est)</p>
                                                <p className="font-bold text-emerald-400">{job.salary}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                            <a 
                                                href={job.apply_link} 
                                                target="_blank" 
                                                className="flex-1 bg-white/[0.03] border border-white/10 hover:bg-white hover:text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all flex items-center justify-center gap-3"
                                            >
                                                Initiate Application <ExternalLink size={14} />
                                            </a>
                                            <button className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-cyan-500/20 hover:text-cyan-400 transition-all">
                                                <Bookmark size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* 🔴 LOAD MORE BUTTON */}
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => fetchJobs()}
                            disabled={isFetching}
                            className="w-full py-10 border-2 border-dashed border-white/5 rounded-[3rem] text-zinc-600 hover:text-cyan-500 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all flex flex-col items-center justify-center gap-4 group"
                        >
                            {isFetching ? (
                                <RefreshCw className="animate-spin text-cyan-500" />
                            ) : (
                                <>
                                    <Plus className="group-hover:rotate-90 transition-transform" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Expand Neural Feed</span>
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Right: Insights Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-8 sticky top-10">
                            <div className="flex items-center gap-3 mb-8">
                                <Sparkles className="text-cyan-400" size={18} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Stream Insights</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase">Trending Skills in Feed</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['TypeScript', 'AI/ML', 'Next.js', 'System Design'].map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 text-[9px] font-bold text-zinc-400">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldCheck className="text-cyan-400" size={16} />
                                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Verified Nodes</p>
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-relaxed italic">"All listings are processed through our AI node to filter out low-affinity roles based on your verified portfolio data."</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-600">
                                        <span>Total Fetched</span>
                                        <span>{jobs.length} Nodes</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full">
                                        <div className="h-full bg-cyan-500 w-2/3 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.2); }
            `}</style>
        </div>
    );
}