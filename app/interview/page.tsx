'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Star, RefreshCw, Terminal, BrainCircuit, ArrowLeft, CheckCircle2, Zap, BarChart, Briefcase, FileText, Sparkles, Play } from 'lucide-react';
import Link from 'next/link';

type Difficulty = 'Low' | 'Moderate' | 'Pro';

export default function InterviewMode() {
    const [userData, setUserData] = useState<any>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    
    // UI States
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [userAnswer, setUserAnswer] = useState("");
    const [evaluation, setEvaluation] = useState<{ score: number, feedback: string } | null>(null);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);

    // Job Description State
    const [jobDescription, setJobDescription] = useState("");
    const [isSessionStarted, setIsSessionStarted] = useState(false);

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

    // 🔴 UPDATED: GENERATOR (Logic is the same, just wrapped in session check)
    const generateQuestion = async (selectedLevel: Difficulty = difficulty!) => {
        setIsGenerating(true);
        setEvaluation(null);
        setUserAnswer("");
        
        const puter = (window as any).puter;
        const skills = userData?.skills?.map((s: any) => s.category).join(", ") || "General Full Stack";

        const contextType = jobDescription.trim() ? "Job Description" : "Candidate Profile";
        const contextData = jobDescription.trim() ? jobDescription : skills;

        const prompt = `
            Act as a Senior Technical Interviewer. 
            Level: ${selectedLevel}.
            Primary Source (${contextType}): [${contextData}].
            
            Task: Ask ONLY ONE short, direct technical interview question (max 15 words) based on the requirements in this ${contextType}. 
            Do NOT give problem statements or scenarios. Just a direct question.
        `;

        try {
            const response = await puter.ai.chat(prompt);
            setCurrentQuestion(response.toString());
            setQuestionCount(prev => prev + 1);
            setIsSessionStarted(true); // 🔴 Start the UI transition
        } catch (err) {
            setCurrentQuestion("Error generating question. Try again.");
        }
        setIsGenerating(false);
    };

    const submitAnswer = async () => {
        if (!userAnswer.trim()) return;
        setIsEvaluating(true);
        
        const puter = (window as any).puter;
        const evalPrompt = `
            Difficulty: ${difficulty}
            Question: "${currentQuestion}"
            Answer: "${userAnswer}"
            Score this answer (0-100) and give a 1-sentence feedback.
            Format: Score: [num] | Feedback: [text]
        `;

        try {
            const response = await puter.ai.chat(evalPrompt);
            const resText = response.toString();
            const scoreMatch = resText.match(/Score:\s*(\d+)/i);
            const feedbackMatch = resText.match(/Feedback:\s*(.*)/i);

            setEvaluation({
                score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
                feedback: feedbackMatch ? feedbackMatch[1] : "Response recorded."
            });
        } catch (err) {
            console.error(err);
        }
        setIsEvaluating(false);
    };

    if (isAuthLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-indigo-500 font-mono tracking-widest animate-pulse">SYNCHRONIZING_NEURAL_DATA...</div>;

    return (
        <div className="min-h-screen bg-[#000] text-zinc-100 font-sans p-4 md:p-10 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,transparent_50%)] opacity-30 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <Link href="/analytics">
                    <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest mb-10 transition-colors">
                        <ArrowLeft size={14} /> System Exit
                    </motion.button>
                </Link>

                {!isSessionStarted ? (
                    // 🔴 UPDATED SELECTION UI WITH JD & RUN BUTTON
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-6 max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight">AI Interview Uplink</h2>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">Configure Session Parameters</p>
                        </div>

                        {/* Job Description Input Area */}
                        <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 mb-8 group focus-within:border-indigo-500/30 transition-all shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-focus-within:opacity-30 transition-opacity">
                                <FileText size={60} className="text-indigo-400" />
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Briefcase className="text-indigo-400 w-4 h-4" />
                                </div>
                                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Target Job Description</span>
                            </div>
                            <textarea 
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste your target JD here... (AI will generate questions strictly from this text)"
                                className="w-full bg-transparent border-none outline-none text-sm text-zinc-300 min-h-[120px] resize-none placeholder:text-zinc-800 leading-relaxed"
                            />
                        </div>

                        {/* Difficulty Selector */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {(['Low', 'Moderate', 'Pro'] as Difficulty[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                        difficulty === level 
                                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                                        : 'bg-[#050505] border-white/5 text-zinc-500 hover:border-white/20'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>

                        {/* 🔴 THE RUN BUTTON 🔴 */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => generateQuestion()}
                            disabled={!difficulty || isGenerating}
                            className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${
                                difficulty 
                                ? 'bg-white text-black shadow-[0_10px_40px_rgba(255,255,255,0.15)] hover:bg-cyan-400' 
                                : 'bg-white/5 text-zinc-700 cursor-not-allowed'
                            }`}
                        >
                            {isGenerating ? (
                                <>Analyzing Parameters <RefreshCw size={16} className="animate-spin" /></>
                            ) : (
                                <>Initialize Simulation <Play size={16} fill="currentColor" /></>
                            )}
                        </motion.button>

                        <div className="mt-8 text-center">
                            <p className="text-zinc-700 text-[9px] uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                                <Sparkles size={12} /> Neural Processing Powered by Puter.js
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    // 🔴 ACTIVE INTERVIEW UI
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                            <Bot className="text-indigo-400" size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">{difficulty} Level</span>
                                            <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                                                {jobDescription.trim() ? "JD Targeted Session" : "Profile Based Session"}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                        Q: {questionCount} / 10
                                    </div>
                                </div>

                                <AnimatePresence mode='wait'>
                                    {currentQuestion && (
                                        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <p className="text-2xl font-medium text-zinc-100 leading-tight border-l-2 border-indigo-500 pl-6">"{currentQuestion}"</p>
                                            
                                            <div className="relative group">
                                                <textarea 
                                                    value={userAnswer}
                                                    onChange={(e) => setUserAnswer(e.target.value)}
                                                    placeholder="Type your technical response here..."
                                                    className="w-full bg-[#080808] border border-white/5 rounded-3xl p-6 min-h-[150px] text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-zinc-800 resize-none shadow-inner"
                                                />
                                                <motion.button 
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={submitAnswer}
                                                    disabled={isEvaluating || !userAnswer.trim()}
                                                    className="absolute bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-2xl shadow-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                                                >
                                                    <Send size={20} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {isEvaluating && (
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-10 h-10 border-t-2 border-indigo-400 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 animate-pulse">Analyzing Technical Depth...</span>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {evaluation && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] p-8 relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={16} className="text-indigo-400" />
                                                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Response Matrix</span>
                                            </div>
                                            <div className="px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-xl font-black text-white">
                                                {evaluation.score}%
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 italic text-sm leading-relaxed mb-8 border-l border-white/10 pl-4">"{evaluation.feedback}"</p>
                                        <motion.button 
                                            whileHover={{ gap: '15px' }}
                                            onClick={() => generateQuestion()}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600/20 px-8 py-4 rounded-xl border border-indigo-500/30 hover:bg-indigo-600 transition-all"
                                        >
                                            <RefreshCw size={14} /> Next Technical Challenge
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT: Session Information */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-8 shadow-xl">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-2"><Zap size={14} className="text-indigo-500" /> Session Node</h3>
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-2">
                                            {jobDescription.trim() ? "Active Context: JD" : "Active Context: Profile"}
                                        </span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {jobDescription.trim() ? (
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-indigo-300">
                                                    <FileText size={12}/> Custom Logic Loaded
                                                </div>
                                            ) : (
                                                userData?.skills?.slice(0, 4).map((s: any, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-indigo-500/10 text-[9px] font-bold text-indigo-300 rounded-md border border-indigo-500/10">{s.category}</span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-t border-white/5 pt-6">
                                        <button 
                                            onClick={() => { 
                                                setDifficulty(null); 
                                                setIsSessionStarted(false); 
                                                setQuestionCount(0); 
                                                setEvaluation(null);
                                            }} 
                                            className="w-full py-3 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            Terminate Session
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}