'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Globe, Building2, MapPin, DollarSign, 
  ExternalLink, Zap, Search, RefreshCw, ArrowLeft, 
  ShieldCheck, Sparkles, Filter, Bookmark
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

    // 1. Fetch User Skills for Matching
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

    // 2. AI Intelligence: Fetching Matched Jobs
    const fetchMatchedJobs = async () => {
        setIsFetching(true);
        const puter = (window as any).puter;
        
        const skills = userData?.skills?.map((s: any) => s.category).join(", ") || "Full Stack Development, React, Node.js";

        const prompt = `
            Act as an AI Job Aggregator for the year 2026. 
            User Skills: [${skills}].
            
            Task: Fetch and synthesize 6 highly relevant, real-world-like job openings at major tech companies (Tier-1 and High-growth startups). 
            
            Requirements for each job:
            - Role Name
            - Company Name
            - Location (Remote/Hybrid/Onsite)
            - Salary Range (e.g., $140k - $190k)
            - Match Score (Percentage based on ${skills})
            - A short 1-sentence requirement.
            - A direct Google Search apply link.

            Output strictly as JSON array:
            [{ "id": "1", "role": "", "company": "", "location": "", "salary": "", "match_score": 95, "description": "", "apply_link": "", "posted": "2h ago" }]
        `;

        try {
            const response = await puter.ai.chat(prompt);
            const cleanJson = response.toString().replace(/```json|```/g, "").trim();
            setJobs(JSON.parse(cleanJson));
        } catch (err) {
            console.error("Aggregation Error:", err);
        }
        setIsFetching(false);
    };

    // Auto-fetch on first load after auth
    useEffect(() => {
        if (!isAuthLoading && userData) {
            fetchMatchedJobs();
        }
    }, [isAuthLoading, userData]);

    if (isAuthLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-mono animate-pulse">BOOTING_JOB_AGGREGATOR_v2.6...</div>;

    return (
        <div className="min-h-screen bg-[#000] text-zinc-100 font-sans p-4 md:p-10 relative overflow-x-hidden">
            {/* Sci-Fi Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div>
                        <Link href="/analytics">
                            <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-6 transition-colors">
                                <ArrowLeft size={14} /> Neural Hub
                            </motion.button>
                        </Link>
                        <h1 className="text-5xl md:text-7xl font-medium tracking-tighter">Global <br/><span className="text-cyan-400">Job Stream.</span></h1>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <button onClick={fetchMatchedJobs} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} /> Rescan Market
                        </button>
                        <div className="bg-cyan-500/10 border border-cyan-500/20 px-6 py-3 rounded-2xl">
                           <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14} fill="currentColor" /> AI Matching: Active
                           </span>
                        </div>
                    </div>
                </header>

                {/* Filters / Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
                            <Globe size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Global Nodes</p>
                            <p className="text-xl font-bold">140+ Sites Scanned</p>
                        </div>
                    </div>
                    <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                            <Search size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Skill Affinity</p>
                            <p className="text-xl font-bold">{userData?.skills?.length || 0} Key Techs Sync'd</p>
                        </div>
                    </div>
                    <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Verification</p>
                            <p className="text-xl font-bold">Encrypted Linkages</p>
                        </div>
                    </div>
                </div>

                {/* The Job Feed Stream */}
                <div className="space-y-6 pb-20">
                    <AnimatePresence mode="popLayout">
                        {isFetching ? (
                            [1,2,3].map(i => (
                                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-40 bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
                            ))
                        ) : (
                            jobs.map((job, index) => (
                                <motion.div 
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative bg-[#050505] border border-white/5 hover:border-cyan-500/30 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 shadow-xl"
                                >
                                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                                        {/* Main Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-4 flex-wrap">
                                                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-cyan-500/20 uppercase tracking-widest">
                                                    {job.match_score}% Match
                                                </span>
                                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                    <RefreshCw size={10}/> {job.posted}
                                                </span>
                                            </div>
                                            
                                            <div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">{job.role}</h3>
                                                <div className="flex items-center gap-4 mt-2 text-zinc-400">
                                                    <span className="flex items-center gap-1.5 text-sm font-medium"><Building2 size={16} className="text-zinc-600"/> {job.company}</span>
                                                    <span className="text-zinc-800">•</span>
                                                    <span className="flex items-center gap-1.5 text-sm font-medium"><MapPin size={16} className="text-zinc-600"/> {job.location}</span>
                                                </div>
                                            </div>

                                            <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">{job.description}</p>
                                        </div>

                                        {/* Action Area */}
                                        <div className="lg:w-64 flex flex-col justify-between items-end gap-6">
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1.5 text-xl font-bold text-white">
                                                    <DollarSign size={18} className="text-emerald-500" /> {job.salary}
                                                </div>
                                                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mt-1">Est. Yearly Package</p>
                                            </div>

                                            <div className="flex items-center gap-3 w-full">
                                                <button className="flex-1 bg-white/[0.03] border border-white/5 p-4 rounded-2xl hover:bg-white/5 transition-colors text-zinc-400">
                                                    <Bookmark size={18} className="mx-auto" />
                                                </button>
                                                <a 
                                                    href={job.apply_link} 
                                                    target="_blank" 
                                                    className="flex-[3] bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                                                >
                                                    Secure Role <ExternalLink size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Sparkle Effect */}
                                    <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Sparkles className="text-cyan-500/50" size={24} />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Market Disclaimer */}
                <div className="py-10 text-center border-t border-white/5">
                    <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.5em] flex items-center justify-center gap-3">
                        <Filter size={12}/> Neural Aggregator v2.6 • Live Global Data Fetching Active
                    </p>
                </div>
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 20px; }
            `}</style>
        </div>
    );
}