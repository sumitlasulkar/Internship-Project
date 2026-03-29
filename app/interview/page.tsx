'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Star, RefreshCw, Terminal, BrainCircuit, ArrowLeft, CheckCircle2, Zap, BarChart } from 'lucide-react';
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

    // 🔴 NEW: SHORT QUESTION GENERATOR BASED ON LEVEL
    const generateQuestion = async (selectedLevel: Difficulty = difficulty!) => {
        setIsGenerating(true);
        setEvaluation(null);
        setUserAnswer("");
        
        const puter = (window as any).puter;
        const skills = userData?.skills?.map((s: any) => s.category).join(", ") || "General Full Stack";

        // Strict prompt for short, specific questions
        const prompt = `
            Act as a Senior Technical Interviewer. 
            Level: ${selectedLevel} (Low = Basic Syntax, Moderate = Implementation/Logic, Pro = Architecture/Optimization).
            Tech Context: [${skills}].
            Ask ONLY ONE short, direct technical interview question (max 15 words). 
            Do NOT give problem statements or scenarios. Just a direct question.
        `;

        try {
            const response = await puter.ai.chat(prompt);
            setCurrentQuestion(response.toString());
            setQuestionCount(prev => prev + 1);
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
            Level: ${difficulty}
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

    if (isAuthLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-indigo-500 font-mono">Loading Neural Data...</div>;

    return (
        <div className="min-h-screen bg-[#000] text-zinc-100 font-sans p-4 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,transparent_50%)] opacity-30 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <Link href="/analytics">
                    <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest mb-10 transition-colors">
                        <ArrowLeft size={14} /> System Exit
                    </motion.button>
                </Link>

                {!difficulty ? (
                    // 🔴 LEVEL SELECTION UI
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                        <h2 className="text-3xl font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Select Proficiency Level</h2>
                        <p className="text-zinc-500 text-sm mb-12 uppercase tracking-widest font-bold">Adjust the interview depth</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(['Low', 'Moderate', 'Pro'] as Difficulty[]).map((level) => (
                                <motion.button
                                    key={level}
                                    whileHover={{ scale: 1.05, borderColor: 'rgba(99,102,241,0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setDifficulty(level); generateQuestion(level); }}
                                    className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] group transition-all"
                                >
                                    <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center mx-auto ${
                                        level === 'Low' ? 'bg-emerald-500/10 text-emerald-400' : 
                                        level === 'Moderate' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
                                    }`}>
                                        {level === 'Low' ? <Zap size={24}/> : level === 'Moderate' ? <BarChart size={24}/> : <BrainCircuit size={24}/>}
                                    </div>
                                    <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">{level}</h3>
                                    <p className="text-zinc-600 text-[10px] uppercase font-bold">
                                        {level === 'Low' ? 'Fundamentals' : level === 'Moderate' ? 'Application' : 'Architectural'}
                                    </p>
                                </motion.button>
                            ))}
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
                                            <h2 className="text-lg font-bold text-white">Interview Stream</h2>
                                        </div>
                                    </div>
                                    <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                        Q: {questionCount} / 10
                                    </div>
                                </div>

                                <AnimatePresence mode='wait'>
                                    {currentQuestion && (
                                        <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                            <p className="text-2xl font-medium text-zinc-100 leading-tight">"{currentQuestion}"</p>
                                            
                                            <div className="relative group">
                                                <textarea 
                                                    value={userAnswer}
                                                    onChange={(e) => setUserAnswer(e.target.value)}
                                                    placeholder="Briefly explain your answer..."
                                                    className="w-full bg-[#080808] border border-white/5 rounded-3xl p-6 min-h-[120px] text-sm outline-none focus:border-indigo-500/40 transition-all placeholder:text-zinc-800 resize-none"
                                                />
                                                <motion.button 
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={submitAnswer}
                                                    disabled={isEvaluating || !userAnswer.trim()}
                                                    className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors"
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
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 animate-pulse">Analyzing Logic...</span>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {evaluation && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] p-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={16} className="text-indigo-400" />
                                                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Response Analysis</span>
                                            </div>
                                            <div className="px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-xl font-black text-white">
                                                {evaluation.score}%
                                            </div>
                                        </div>
                                        <p className="text-zinc-400 italic text-sm leading-relaxed mb-6">"{evaluation.feedback}"</p>
                                        <motion.button 
                                            onClick={() => generateQuestion()}
                                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600/20 px-6 py-3 rounded-xl border border-indigo-500/30 hover:bg-indigo-600 transition-all"
                                        >
                                            <RefreshCw size={14} /> Next Question
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* RIGHT: Profile Context */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-2"><Zap size={14} className="text-indigo-500" /> Session Context</h3>
                                <div className="space-y-6">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-1">Target Tech</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {userData?.skills?.slice(0, 4).map((s: any, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-indigo-500/10 text-[9px] font-bold text-indigo-300 rounded-md border border-indigo-500/10">{s.category}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-white/5 pt-6">
                                        <button onClick={() => setDifficulty(null)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-rose-400 transition-colors">Change Difficulty</button>
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