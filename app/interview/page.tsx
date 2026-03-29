'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Star, RefreshCw, Terminal, Code2, BrainCircuit, Layout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InterviewMode() {
    const [userData, setUserData] = useState<any>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [evaluation, setEvaluation] = useState<{ score: number, feedback: string } | null>(null);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);

    // 1. Fetch real profile data for Contextual Questions
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

    // 2. Generate Question based on Profile
    const generateQuestion = async () => {
        setIsGenerating(true);
        setEvaluation(null);
        setUserAnswer("");
        
        const puter = (window as any).puter;
        
        // Extracting profile info for AI context
        const skills = userData?.skills?.map((s: any) => s.category).join(", ") || "Full Stack Development";
        const projects = userData?.projects?.map((p: any) => p.title).join(", ") || "Web Applications";

        const prompt = `
            You are a Senior Technical Interviewer. 
            Candidate Profile: Skills: [${skills}], Projects: [${projects}].
            Ask one highly specific and challenging technical question that tests deep knowledge of these specific skills or project architectures.
            Only output the question text.
        `;

        try {
            const response = await puter.ai.chat(prompt);
            setCurrentQuestion(response.toString());
        } catch (err) {
            setCurrentQuestion("Failed to generate question. Please check Puter integration.");
        }
        setIsGenerating(false);
    };

    // 3. Evaluate typed answer
    const submitAnswer = async () => {
        if (!userAnswer.trim()) return;
        setIsEvaluating(true);
        
        const puter = (window as any).puter;
        const evalPrompt = `
            Technical Question: "${currentQuestion}"
            Candidate's Answer: "${userAnswer}"
            Evaluate this answer like a strict CTO. 
            1. Rate it from 0 to 100.
            2. Provide one sentence of constructive feedback.
            Strict Output Format: Score: [number] | Feedback: [text]
        `;

        try {
            const response = await puter.ai.chat(evalPrompt);
            const resText = response.toString();
            
            const scoreMatch = resText.match(/Score:\s*(\d+)/i);
            const feedbackMatch = resText.match(/Feedback:\s*(.*)/i);

            setEvaluation({
                score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
                feedback: feedbackMatch ? feedbackMatch[1] : "Assessment complete."
            });
        } catch (err) {
            console.error(err);
        }
        setIsEvaluating(false);
    };

    if (isAuthLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-500 font-mono">Syncing Profile...</div>;

    return (
        <div className="min-h-screen bg-[#000] text-zinc-100 font-sans p-4 md:p-10 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,transparent_70%)] opacity-20 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <Link href="/analytics">
                    <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest mb-10 transition-colors">
                        <ArrowLeft size={14} /> Back to Analytics
                    </motion.button>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT: Interview Terminal */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl overflow-hidden relative group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl border border-indigo-500/20 flex items-center justify-center">
                                        <BrainCircuit className="text-indigo-400" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">Neural Interviewer</h2>
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Protocol: V3.Active</p>
                                    </div>
                                </div>
                                {!currentQuestion && (
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={generateQuestion}
                                        disabled={isGenerating}
                                        className="bg-white text-black px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    >
                                        {isGenerating ? "Analyzing Profile..." : "Start Session"}
                                    </motion.button>
                                )}
                            </div>

                            {currentQuestion && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                    <div className="bg-white/[0.02] border-l-2 border-indigo-500 p-6 rounded-r-2xl">
                                        <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-2 block">Incoming Query</span>
                                        <p className="text-lg text-zinc-200 leading-relaxed font-medium">{currentQuestion}</p>
                                    </div>

                                    <div className="relative group/input">
                                        <textarea 
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder="Type your technical response here..."
                                            className="w-full bg-[#080808] border border-white/5 rounded-2xl p-5 min-h-[150px] text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700 resize-none shadow-inner"
                                        />
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            onClick={submitAnswer}
                                            disabled={isEvaluating || !userAnswer.trim()}
                                            className="absolute bottom-4 right-4 bg-indigo-600 p-3 rounded-xl text-white shadow-xl hover:bg-indigo-500 disabled:opacity-50"
                                        >
                                            <Send size={18} />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {isEvaluating && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="w-10 h-10 border-t-2 border-indigo-400 rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 animate-pulse">Scanning Logic Depth...</span>
                                </div>
                            )}
                        </div>

                        {/* Feedback Section */}
                        <AnimatePresence>
                            {evaluation && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2rem] p-8 shadow-xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Session Outcome</h3>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                                            <Star size={14} className="text-indigo-400 fill-current" />
                                            <span className="text-xl font-black text-white">{evaluation.score}<span className="text-xs opacity-40 ml-1">/100</span></span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 italic text-sm leading-relaxed mb-6">"{evaluation.feedback}"</p>
                                    <motion.button 
                                        whileHover={{ gap: '12px' }}
                                        onClick={generateQuestion}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-all"
                                    >
                                        <RefreshCw size={14} /> Next Technical Challenge
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: Stats / Context */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                                <Terminal size={14} className="text-cyan-400" /> System Context
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-2">Detected Tech-Stack</span>
                                    <div className="flex flex-wrap gap-2">
                                        {userData?.skills?.map((s: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-white/[0.03] border border-white/5 rounded-lg text-[9px] font-bold text-zinc-400">{s.category}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-3">Interview Guidelines</span>
                                    <ul className="space-y-3">
                                        <li className="text-[10px] text-zinc-400 flex gap-2"><Code2 size={12} className="text-indigo-400 shrink-0" /> Explain complexity (O notation).</li>
                                        <li className="text-[10px] text-zinc-400 flex gap-2"><Layout size={12} className="text-indigo-400 shrink-0" /> Focus on architecture.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
            `}</style>
        </div>
    );
}