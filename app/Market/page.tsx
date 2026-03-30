'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Search, Zap, TrendingUp, TrendingDown, 
  Share2, Cpu, Globe, ArrowLeft, Loader2, Sparkles,
  CircuitBoard, Bot, Activity
} from 'lucide-react';
import Link from 'next/link';

interface SkillInsight {
  mainSkill: string;
  demandScore: number;
  velocity: string;
  relatedSkills: { name: string; affinity: number; trend: 'up' | 'down' }[];
  marketOutlook: string;
}

// 🔢 ANIME NUMBER FUNCTION (For Score Count-up)
function AnimatedNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) return;

        let totalDuration = 1500;
        let increment = end / (totalDuration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue}</span>;
}

export default function SkillMarketIntel() {
  const [query, setQuery] = useState("");
  const [insight, setInsight] = useState<SkillInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const bgControls = useAnimation(); // For warp speed animation

  // 🔴 AI LOGIC (FUNCTIONAL)
  const analyzeSkill = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setInsight(null);

    // Warp Speed Background Animation Trigger
    bgControls.start({ scale: 1.5, opacity: 0.1, transition: { duration: 0.5 } });

    const puter = (window as any).puter;
    const prompt = `
      Act as a Tech Market Analyst 2026. Analyze "${query}".
      Output Strictly JSON:
      {
        "mainSkill": "${query}",
        "demandScore": 88,
        "velocity": "+18%",
        "relatedSkills": [
          { "name": "Next.js", "affinity": 95, "trend": "up" },
          { "name": "Tailwind", "affinity": 89, "trend": "up" },
          { "name": "TypeScript", "affinity": 92, "trend": "up" },
          { "name": "Framer Motion", "affinity": 75, "trend": "up" }
        ],
        "marketOutlook": "Exponential growth expected due to AI integration demands."
      }
    `;

    try {
      const response = await puter.ai.chat(prompt);
      const data = JSON.parse(response.toString().replace(/```json|```/g, "").trim());
      setInsight(data);
    } catch (err) {
      console.error(err);
    }
    
    // Reset Background after mapping
    bgControls.start({ scale: 1, opacity: 0.2, transition: { duration: 1 } });
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-slate-200 p-4 md:p-10 relative overflow-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* 🌌 HYPER-ANIMATED BACKGROUND (Tech-Galaxy) */}
      <motion.div 
        animate={bgControls}
        initial={{ opacity: 0.2 }}
        className="fixed inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:25px_25px] opacity-30" />
        {/* Floating Icons */}
        {[Cpu, CircuitBoard, Bot, Atom].map((Icon, i) => (
            <motion.div
                key={i}
                className="absolute text-slate-800"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                }}
                animate={{
                    y: [0, -50, 0],
                    x: [0, 30, 0],
                    rotate: [0, 360],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                    duration: 10 + Math.random() * 10,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <Icon size={Math.random() * 50 + 20} strokeWidth={1} />
            </motion.div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 🔙 ULTIMATE BACK BUTTON */}
        <header className="mb-16 flex items-center justify-between gap-6 relative">
            <Link href="/analytics">
                <motion.button 
                    whileHover="hover"
                    initial="initial"
                    className="relative flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/5 px-6 py-3 rounded-full group"
                >
                    {/* Glowing Ring Animation */}
                    <motion.div 
                        variants={{
                            initial: { rotate: 0, opacity: 0.5 },
                            hover: { rotate: 360, opacity: 1 }
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 group-hover:border-cyan-500/80" 
                    />
                    <ArrowLeft size={16} className="text-cyan-500 group-hover:-translate-x-1 transition-transform z-10" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-white z-10 transition-colors">
                        System_Return
                    </span>
                </motion.button>
            </Link>

            <div className="flex items-center gap-3 bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-white/5 shadow-xl">
                <Activity className="text-cyan-500 animate-pulse" size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Node: Intel_v3</span>
            </div>
        </header>

        {/* 🖥️ MAIN LOGIC CONSOLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
            
            {/* SEARCH AREA */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-10">
                <motion.div layout className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 italic uppercase leading-none">
                        Neural<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Intel.</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em]">Real-time Market Velocity & Cluster Mapping</p>
                </motion.div>

                {/* 🔍 INPUT WITH SCANLINE EFFECT */}
                <div className="relative group overflow-hidden rounded-3xl">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-3xl blur opacity-10 group-focus-within:opacity-40 transition-opacity" />
                    
                    {/* Scanning Laser Animation */}
                    <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 top-0 h-1 bg-cyan-400/50 blur-sm z-20 pointer-events-none"
                    />

                    <div className="relative flex bg-[#0d1117] border border-white/10 p-3 shadow-inner z-10">
                        <input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && analyzeSkill()}
                            placeholder="Enter Tech (e.g. Next.js, Go)..."
                            className="w-full bg-transparent border-none outline-none py-4 px-3 text-sm font-medium font-mono placeholder:text-slate-800 placeholder:font-sans"
                        />
                        <button 
                            onClick={analyzeSkill}
                            disabled={isAnalyzing}
                            className="bg-white text-black hover:bg-cyan-400 px-8 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2 group disabled:opacity-30"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} fill="currentColor" />}
                            {isAnalyzing ? 'Mapping' : 'Analyze'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 📊 DYNAMIC RESULTS BENTO GRID */}
            <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    {!insight && !isAnalyzing && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[400px] border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center text-slate-800 gap-4 group">
                            <Bot size={50} strokeWidth={1} className="group-hover:text-cyan-900 transition-colors" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Vector Initiation</p>
                        </motion.div>
                    )}

                    {isAnalyzing && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[400px] bg-slate-900/50 rounded-[3rem] flex items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-cyan-500" size={30} />
                            <span className="text-xs font-mono text-cyan-500 animate-pulse uppercase tracking-widest">Constructing Neural Graph...</span>
                        </motion.div>
                    )}

                    {insight && (
                        <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* CORE NODE SCORE (ODOMETER) */}
                            <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="bg-[#0d1117] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center relative shadow-2xl overflow-hidden group col-span-1 md:col-span-2">
                                <motion.div layoutId="glowLine" className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-400 animate-gradient-x" />
                                
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">Neural Demand Index</span>
                                <h2 className="text-6xl font-black text-white uppercase mb-3 tracking-tighter italic">{insight.mainSkill}</h2>
                                <div className="text-8xl font-black text-cyan-400 tracking-tight flex items-baseline relative">
                                    <AnimatedNumber value={insight.demandScore} />
                                    <span className="text-2xl opacity-40 ml-1">%</span>
                                    {/* Score Glow */}
                                    <div className="absolute inset-0 text-cyan-400 blur-2xl opacity-40 select-none">{insight.demandScore}%</div>
                                </div>
                                <div className="mt-8 flex items-center gap-3 bg-white/5 px-6 py-2.5 rounded-full text-xs text-slate-400 italic leading-relaxed border border-white/10">
                                    <Sparkles size={14} className="text-cyan-500" />
                                    <span>"{insight.marketOutlook}"</span>
                                </div>
                            </motion.div>

                            {/* RELATED TECH CLUSTER (Animated Connections) */}
                            <div className="md:col-span-2 pt-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 flex items-center gap-3">
                                    <CircuitBoard size={16} className="text-cyan-500" /> Tech Cluster Co-requisites
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                                    
                                    {/* 🛰️ NEURAL LINK ANIMATION LINES */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{zIndex: -1}}>
                                        {insight.relatedSkills.map((_, i) => (
                                            <motion.line 
                                                key={i}
                                                x1="50%" y1="0%" x2={`${(i % 2 === 0 ? 25 : 75)}%`} y2="50%"
                                                stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.2"
                                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                            />
                                        ))}
                                    </svg>

                                    {insight.relatedSkills.map((s, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            whileHover={{ y: -5, borderColor: "rgba(6, 182, 212, 0.3)" }}
                                            className="bg-[#0d1117] border border-white/5 p-8 rounded-[2rem] transition-all shadow-xl group"
                                        >
                                            <div className="flex justify-between items-start mb-5">
                                                <div>
                                                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Affinity Node</p>
                                                    <p className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{s.name}</p>
                                                </div>
                                                <div className={`p-2.5 rounded-xl ${s.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {s.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                </div>
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${s.affinity}%` }}
                                                    transition={{ duration: 1, delay: 1 }}
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full relative"
                                                >
                                                    <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-50" />
                                                </motion.div>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 text-[10px] font-bold text-slate-600">
                                                <span>Probability</span>
                                                <span>{s.affinity}%</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

      </div>

      {/* 🛑 GLOBAL ANIMATION STYLES */}
      <style jsx global>{`
        @font-face {
          font-family: 'JetBrains Mono';
          src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap');
        }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
        
        @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 4s ease infinite;
        }
      `}</style>
    </div>
  );
}
// Placeholder components to prevent errors
const Atom = (props: any) => <Activity {...props} />