'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, Compass, Target, ChevronRight, ExternalLink, 
  Youtube, BookOpen, CheckCircle2, Trophy, ArrowLeft, 
  Sparkles, Loader2, Flag, Milestone 
} from 'lucide-react';
import Link from 'next/link';

interface RoadmapStep {
  title: string;
  description: string;
  resource_type: 'Video' | 'Documentation';
  link: string;
  duration: string;
}

export default function CareerPathfinder() {
    const [userData, setUserData] = useState<any>(null);
    const [targetGoal, setTargetGoal] = useState("");
    const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // 1. Fetch Profile Context
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

    // 2. The AI Pathfinder Logic
    const generatePath = async () => {
        if (!targetGoal.trim()) return;
        setIsGenerating(true);
        setRoadmap([]);

        const puter = (window as any).puter;
        const currentSkills = userData?.skills?.map((s: any) => s.category).join(", ") || "Beginner Web Dev";

        const prompt = `
            You are an expert Career Mentor & Tech Architect.
            Current Skills: [${currentSkills}].
            Target Goal: "${targetGoal}".

            Task: Create a 5-step detailed roadmap to bridge the gap.
            For each step, provide:
            1. Title (The Skill/Technology to learn)
            2. Description (Why this is needed for the target goal)
            3. Resource Link (Specific high-quality Documentation or YouTube search link)
            4. Resource Type (Video or Documentation)
            5. Estimated Time to Master.

            Output format strictly JSON:
            [{ "title": "", "description": "", "resource_type": "", "link": "", "duration": "" }]
        `;

        try {
            const response = await puter.ai.chat(prompt);
            // Handling both raw string and JSON-like strings
            const cleanJson = response.toString().replace(/```json|```/g, "").trim();
            const parsedData = JSON.parse(cleanJson);
            setRoadmap(parsedData);
        } catch (err) {
            console.error("AI Error:", err);
            alert("Neural Link failed. Ensure valid JSON output.");
        }
        setIsGenerating(false);
    };

    if (isAuthLoading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <Loader2 className="text-indigo-500 animate-spin mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Mapping_Identity...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#000] text-zinc-100 font-sans p-4 md:p-12 relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <Link href="/analytics">
                    <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest mb-12 transition-colors">
                        <ArrowLeft size={14} /> Back to Hub
                    </motion.button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT SIDE: Input & Info */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-4">AI Career<br/><span className="text-indigo-500">Pathfinder.</span></h1>
                            <p className="text-zinc-500 text-sm leading-relaxed">Our neural engine analyzes your current skill-set and generates a personalized trajectory to your dream role.</p>
                        </div>

                        <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                    <Target size={14} className="text-indigo-500" /> Target Destination
                                </label>
                                <input 
                                    value={targetGoal}
                                    onChange={(e) => setTargetGoal(e.target.value)}
                                    placeholder="e.g., Senior DevOps at Google"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500/50 transition-all text-white"
                                />
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generatePath}
                                disabled={isGenerating || !targetGoal.trim()}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(255,255,255,0.1)] disabled:opacity-50 transition-all"
                            >
                                {isGenerating ? (
                                    <>Processing Map <Loader2 className="animate-spin" size={16} /></>
                                ) : (
                                    <>Analyze & Generate <Compass size={16} /></>
                                )}
                            </motion.button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {userData?.skills?.slice(0, 5).map((s: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-zinc-500">{s.category}</span>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Interactive Roadmap */}
                    <div className="lg:col-span-7 relative">
                        {!roadmap.length && !isGenerating ? (
                            <div className="h-[400px] border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-zinc-800">
                                <Map size={60} strokeWidth={1} />
                                <p className="mt-4 text-[10px] font-black uppercase tracking-widest">No Active Path Detected</p>
                            </div>
                        ) : isGenerating ? (
                            <div className="space-y-6">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-32 bg-white/[0.02] animate-pulse rounded-3xl border border-white/5" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-8 relative">
                                {/* Timeline Line */}
                                <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-indigo-500/50 via-white/10 to-transparent hidden sm:block" />

                                {roadmap.map((step, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative pl-0 sm:pl-20 group"
                                    >
                                        {/* Milestone Marker */}
                                        <div className="absolute left-[26px] top-1 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1] hidden sm:block z-10" />
                                        
                                        <div className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] group-hover:border-indigo-500/30 transition-all shadow-xl">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Step {index + 1} • {step.duration}</span>
                                                    <h3 className="text-xl font-bold text-white tracking-tight">{step.title}</h3>
                                                </div>
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                                    {step.resource_type === 'Video' ? <Youtube size={14} className="text-red-500" /> : <BookOpen size={14} className="text-blue-400" />}
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{step.resource_type}</span>
                                                </div>
                                            </div>

                                            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                                                {step.description}
                                            </p>

                                            <a 
                                                href={step.link} 
                                                target="_blank" 
                                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-indigo-400 transition-colors bg-white/5 px-6 py-3 rounded-xl border border-white/5"
                                            >
                                                Start Learning <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Goal Marker */}
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: 0.8 }}
                                    className="relative pl-0 sm:pl-20 flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_#6366f1] absolute left-[7px] hidden sm:flex">
                                        <Flag size={20} fill="white" className="text-white" />
                                    </div>
                                    <div className="sm:ml-4">
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Destination Reached</p>
                                        <h4 className="text-lg font-bold text-white uppercase">{targetGoal}</h4>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 20px; }
            `}</style>
        </div>
    );
}