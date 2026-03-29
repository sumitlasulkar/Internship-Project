'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Bot, Star, RefreshCw, Terminal, BrainCircuit, 
  ArrowLeft, CheckCircle2, Zap, BarChart, Briefcase, 
  FileText, Sparkles, Play, Target, ShieldAlert 
} from 'lucide-react';
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

    const generateQuestion = async (selectedLevel: Difficulty = difficulty!) => {
        if (!selectedLevel) return;
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
            Task: Ask ONLY ONE short, direct technical interview question (max 15 words) based on the requirements. 
            Do NOT give problem statements or scenarios. Just a direct question.
        `;

        try {
            const response = await puter.ai.chat(prompt);
            setCurrentQuestion(response.toString());
            setQuestionCount(prev => prev + 1);
            setIsSessionStarted(true);
        } catch (err) {
            setCurrentQuestion("Neural Link Interrupted. Please retry.");
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
            Score this answer (0-100) and give a 1-sentence professional feedback.
            Format: Score: [num] | Feedback: [text]
        `;

        try {
            const response = await puter.ai.chat(evalPrompt);
            const resText = response.toString();
            const scoreMatch = resText.match(/Score:\s*(\d+)/i);
            const feedbackMatch = resText.match(/Feedback:\s*(.*)/i);

            setEvaluation({
                score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
                feedback: feedbackMatch ? feedbackMatch[1] : "Response synthesized."
            });
        } catch (err) {
            console.error(err);
        }
        setIsEvaluating(false);
    };

    if (isAuthLoading) return (
        <div className="min-h-screen bg-[#000] flex flex-col items-center justify-center gap-4">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-12 h-12 border-t-2 border-indigo-500 rounded-full shadow-[0_0_20px_#6366f1]"
            />
            <span className="text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Establishing Neural Link...</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#000] text-zinc-100 font-sans p-4 md:p-8 lg:p-12 relative overflow-x-hidden">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Navigation */}
                <header className="flex items-center justify-between mb-8 md:mb-12">
                    <Link href="/analytics">
                        <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <ArrowLeft size={14} /> <span className="hidden sm:inline">Abort Simulation</span><span className="sm:hidden">Exit</span>
                        </motion.button>
                    </Link>
                    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Node Active</span>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {!isSessionStarted ? (
                        <motion.div 
                            key="setup"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Left: configuration info */}
                            <div className="lg:col-span-4 space-y-6">
                                <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Interview <br/><span className="text-indigo-500">Uplink.</span></h1>
                                <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">Configure your neural session. Paste a Job Description for targeted training or use your live profile skills.</p>
                                
                                <div className="space-y-4 pt-6">
                                    <div className="flex items-center gap-3 text-zinc-400">
                                        <ShieldAlert size={16} className="text-indigo-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Strict CTO Logic Enabled</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-400">
                                        <Target size={16} className="text-indigo-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Context-Aware Generation</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Input area */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden relative group transition-all focus-within:border-indigo-500/30">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="text-indigo-400" size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Job Description Input</span>
                                        </div>
                                        <span className="text-[9px] bg-white/5 px-2 py-1 rounded text-zinc-600 font-mono">Optional</span>
                                    </div>
                                    <textarea 
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="Paste the target JD here... (AI will adapt to these specific requirements)"
                                        className="w-full bg-transparent border-none outline-none text-base text-zinc-200 min-h-[150px] md:min-h-[200px] resize-none placeholder:text-zinc-800 leading-relaxed font-light"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {(['Low', 'Moderate', 'Pro'] as Difficulty[]).map((level) => (
                                        <motion.button
                                            key={level}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setDifficulty(level)}
                                            className={`p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden group ${
                                                difficulty === level 
                                                ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]' 
                                                : 'bg-[#050505] border-white/5 hover:border-white/10'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${difficulty === level ? 'bg-white/20' : 'bg-white/5'}`}>
                                                {level === 'Low' ? <Zap size={18}/> : level === 'Moderate' ? <BarChart size={18}/> : <BrainCircuit size={18}/>}
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${difficulty === level ? 'text-indigo-200' : 'text-zinc-600'}`}>{level}</span>
                                            <span className={`text-sm font-bold block ${difficulty === level ? 'text-white' : 'text-zinc-400'}`}>
                                                {level === 'Low' ? 'Junior' : level === 'Moderate' ? 'Dev' : 'Architect'}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => generateQuestion()}
                                    disabled={!difficulty || isGenerating}
                                    className={`w-full py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${
                                        difficulty 
                                        ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-cyan-400' 
                                        : 'bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5'
                                    }`}
                                >
                                    {isGenerating ? "Processing Logic..." : "Initialize Session"} <Play size={16} fill="currentColor" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="active"
                            initial={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                        >
                            {/* Terminal Window */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden flex flex-col min-h-[450px]">
                                    {/* Terminal Header */}
                                    <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                                                <Bot className="text-indigo-400" size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-white tracking-tight">Neural Interview Stream</h2>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">{difficulty} Depth</span>
                                                    <span className="text-zinc-700">•</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Q {questionCount}/10</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Area */}
                                    <div className="flex-1">
                                        <AnimatePresence mode="wait">
                                            {currentQuestion && (
                                                <motion.div 
                                                    key={currentQuestion} 
                                                    initial={{ opacity: 0, x: 20 }} 
                                                    animate={{ opacity: 1, x: 0 }} 
                                                    className="space-y-8"
                                                >
                                                    <p className="text-2xl md:text-3xl font-medium text-zinc-100 leading-tight">"{currentQuestion}"</p>
                                                    
                                                    <div className="relative group">
                                                        <textarea 
                                                            value={userAnswer}
                                                            onChange={(e) => setUserAnswer(e.target.value)}
                                                            placeholder="Synthesize your response..."
                                                            className="w-full bg-[#080808] border border-white/5 rounded-3xl p-6 md:p-8 min-h-[180px] text-base outline-none focus:border-indigo-500/40 transition-all placeholder:text-zinc-800 resize-none shadow-inner"
                                                        />
                                                        <motion.button 
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={submitAnswer}
                                                            disabled={isEvaluating || !userAnswer.trim()}
                                                            className="absolute bottom-6 right-6 bg-white text-black p-4 rounded-2xl shadow-xl hover:bg-cyan-400 disabled:opacity-50 transition-colors"
                                                        >
                                                            <Send size={24} />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Processing Overlay */}
                                    <AnimatePresence>
                                        {isEvaluating && (
                                            <motion.div 
                                                initial={{ opacity: 0 }} 
                                                animate={{ opacity: 1 }} 
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-20"
                                            >
                                                <div className="relative">
                                                    <motion.div 
                                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="w-20 h-20 bg-indigo-500/20 rounded-full blur-xl"
                                                    />
                                                    <motion.div 
                                                        animate={{ rotate: 360 }} 
                                                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                                                        className="absolute inset-0 border-t-2 border-indigo-500 rounded-full"
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 animate-pulse">Decoding Response Matrix...</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Feedback Card */}
                                <AnimatePresence>
                                    {evaluation && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 30 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-10"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 size={20} className="text-emerald-400" />
                                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Neural Assessment Complete</span>
                                                </div>
                                                <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Logic Score</span>
                                                    <span className="text-3xl font-black text-white">{evaluation.score}%</span>
                                                </div>
                                            </div>
                                            <p className="text-zinc-300 italic text-lg leading-relaxed mb-10 border-l-2 border-indigo-500 pl-6">"{evaluation.feedback}"</p>
                                            <motion.button 
                                                whileHover={{ x: 10 }}
                                                onClick={() => generateQuestion()}
                                                className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400 hover:text-white transition-all"
                                            >
                                                Next Technical Link <RefreshCw size={14} />
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Sidebar Info */}
                            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                                <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-8 flex items-center gap-2">
                                        <Zap size={14} className="text-indigo-500" /> Node Status
                                    </h3>
                                    <div className="space-y-8">
                                        <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                            <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-3">Active Context</span>
                                            {jobDescription.trim() ? (
                                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                                                    <FileText size={14}/> Custom JD Engine
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {userData?.skills?.slice(0, 5).map((s: any, i: number) => (
                                                        <span key={i} className="px-2 py-1 bg-white/5 text-[9px] font-bold text-zinc-400 rounded-md border border-white/5">{s.category}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="pt-6 border-t border-white/5">
                                            <button 
                                                onClick={() => { 
                                                    setDifficulty(null); 
                                                    setIsSessionStarted(false); 
                                                    setQuestionCount(0); 
                                                    setEvaluation(null);
                                                }} 
                                                className="w-full py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                                            >
                                                Terminate Protocol
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/10 rounded-[2rem] p-6">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles size={12}/> Pro Tip</h4>
                                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">"AI scores based on technical terminology, O-notation awareness, and architectural depth. Be precise."</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Custom Styles for Textarea */}
            <style jsx global>{`
                textarea::-webkit-scrollbar { width: 4px; }
                textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
                textarea::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.2); }
            `}</style>
        </div>
    );
}