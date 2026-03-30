'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Search, Zap, TrendingUp, TrendingDown, 
  Share2, Cpu, Globe, ArrowLeft, Loader2, Sparkles,
  CircuitBoard, Bot, Activity, ArrowRight, Atom, Binary
} from 'lucide-react';
import Link from 'next/link';

interface SkillInsight {
  mainSkill: string;
  demandScore: number;
  velocity: string;
  relatedSkills: { name: string; affinity: number; trend: 'up' | 'down' }[];
  marketOutlook: string;
}

// 🔢 ODOMETER ANIMATION (Counts up to the score)
function AnimatedNumber({ value }: { value: number }) {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1500;
        const increment = end / (duration / 16);
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
  const bgControls = useAnimation();

  // 🔴 STRICT AI LOGIC: No more "Next.js" for "Machine Learning"
  const analyzeSkill = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setInsight(null);

    // Warp speed background effect
    bgControls.start({ scale: 1.5, opacity: 0.1, transition: { duration: 0.4 } });

    const puter = (window as any).puter;
    const prompt = `
      You are a Professional Tech Market Analyst 2026.
      Input: "${query}"

      TASK:
      1. Demand Score (0-100) for "${query}".
      2. Identify 4 technologies that are DIRECTLY RELATED or required with "${query}".
         (Example: If input is 'Machine Learning', related MUST be things like 'PyTorch', 'TensorFlow', 'Python', 'CUDA'. NEVER suggest web dev unless the input is web dev).
      3. Market growth velocity (percentage).
      4. 1-sentence professional outlook.

      OUTPUT: STRICT JSON ONLY.
      {
        "mainSkill": "${query}",
        "demandScore": number,
        "velocity": "string (+/- %)",
        "relatedSkills": [
          { "name": "Related Tech 1", "affinity": number, "trend": "up/down" },
          { "name": "Related Tech 2", "affinity": number, "trend": "up/down" },
          { "name": "Related Tech 3", "affinity": number, "trend": "up/down" },
          { "name": "Related Tech 4", "affinity": number, "trend": "up/down" }
        ],
        "marketOutlook": "string"
      }
    `;

    try {
      const response = await puter.ai.chat(prompt);
      const cleanJson = response.toString().replace(/```json|```/g, "").trim();
      const data = JSON.parse(cleanJson);
      setInsight(data);
    } catch (err) {
      console.error("AI Error:", err);
    }
    
    bgControls.start({ scale: 1, opacity: 0.2, transition: { duration: 0.8 } });
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-slate-200 p-4 md:p-10 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* 🌌 DYNAMIC TECH-NEBULA BACKGROUND */}
      <motion.div animate={bgControls} className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:30px_30px]" />
        {[Binary, Atom, CircuitBoard, Cpu].map((Icon, i) => (
            <motion.div
                key={i} className="absolute text-slate-800"
                style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                animate={{ y: [0, -40, 0], rotate: [0, 360], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
            >
                <Icon size={40 + i * 10} strokeWidth={1} />
            </motion.div>
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 🔙 ULTIMATE CYBER-RETURN NAVIGATION */}
        <header className="mb-16 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <Link href="/analytics">
                    <motion.button 
                        whileHover="hover" initial="initial"
                        className="relative flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl group transition-all"
                    >
                        <motion.div 
                            variants={{ initial: { width: 0 }, hover: { width: "100%" } }}
                            className="absolute inset-0 bg-cyan-500/10 rounded-2xl -z-10"
                        />
                        <ArrowLeft size={18} className="text-cyan-400 group-hover:-translate-x-2 transition-transform" />
                        <div className="flex flex-col items-start border-l border-white/10 pl-4">
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">System_Return</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Main_Console</span>
                        </div>
                    </motion.button>
                </Link>
                <div className="hidden lg:flex items-center gap-2 text-slate-700 font-mono text-[10px]">
                    <div className="h-10 w-[1px] bg-white/10 mx-4" />
                    <span>OS_CORE</span> <ArrowRight size={12} /> <span className="text-cyan-500/50">INTEL_V2.6</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Neural_Status</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active_Sync</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl">
                    <Cpu className="text-cyan-400 animate-pulse" size={22} />
                </div>
            </div>
        </header>

        {/* 🖥️ MAIN ENGINE INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
            
            {/* SEARCH PANEL */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-10">
                <motion.div layout className="space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-none text-white">
                        Neural<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Intel.</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.5em] pl-2">Market Velocity & Tech Clustering</p>
                </motion.div>

                {/* 🔍 INPUT CONSOLE WITH SCAN-LINE */}
                <div className="relative group overflow-hidden rounded-[2.5rem]">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-40 transition-opacity" />
                    
                    {/* Laser Scanner Effect */}
                    <motion.div 
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 top-0 h-[2px] bg-cyan-400/40 blur-sm z-20 pointer-events-none"
                    />

                    <div className="relative flex flex-col bg-[#0d1117] border border-white/10 p-2 shadow-2xl z-10">
                        <input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && analyzeSkill()}
                            placeholder="Identify Tech Skill..."
                            className="w-full bg-transparent border-none outline-none py-5 px-6 text-base font-mono placeholder:text-slate-800 placeholder:font-sans"
                        />
                        <button 
                            onClick={analyzeSkill}
                            disabled={isAnalyzing}
                            className="w-full bg-white text-black hover:bg-cyan-400 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 disabled:opacity-20 mt-2"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
                            {isAnalyzing ? 'Mapping_Vectors' : 'Initiate_Scan'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 📊 RESULT BENTO GRID */}
            <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
                    {!insight && !isAnalyzing && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center gap-6 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-5 group-hover:opacity-20 transition-opacity" />
                                <Bot size={70} strokeWidth={1} className="text-slate-800 group-hover:text-cyan-800 transition-colors duration-700" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-700">Awaiting_Neural_Input</p>
                        </motion.div>
                    )}

                    {isAnalyzing && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[500px] bg-slate-900/40 backdrop-blur-md rounded-[4rem] border border-white/5 flex flex-col items-center justify-center gap-8">
                            <div className="relative">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-t-2 border-cyan-500 rounded-full shadow-[0_0_20px_#06b6d4]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Activity className="text-cyan-500 animate-pulse" size={24} />
                                </div>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-500 animate-pulse uppercase tracking-[0.5em]">Synthesizing_Clusters...</span>
                        </motion.div>
                    )}

                    {insight && (
                        <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                            
                            {/* SCORE SECTION */}
                            <div className="bg-[#0d1117] border border-white/5 rounded-[3.5rem] p-12 text-center relative overflow-hidden shadow-2xl group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-400 animate-gradient-x" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 block">Global_Market_Affinity</span>
                                <h2 className="text-7xl md:text-8xl font-black text-white uppercase italic tracking-tighter mb-4">{insight.mainSkill}</h2>
                                <div className="text-9xl font-black text-cyan-400 tracking-tighter flex items-center justify-center relative">
                                    <AnimatedNumber value={insight.demandScore} /><span className="text-3xl opacity-30 ml-2">%</span>
                                    <div className="absolute inset-0 text-cyan-500 blur-3xl opacity-20 pointer-events-none select-none">{insight.demandScore}%</div>
                                </div>
                                <div className="mt-12 flex items-start gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-xs text-slate-400 italic leading-relaxed text-left">
                                    <Sparkles size={20} className="text-cyan-500 shrink-0" />
                                    <p>"{insight.marketOutlook}"</p>
                                </div>
                            </div>

                            {/* CLUSTER SECTION */}
                            <div className="pt-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 mb-10 flex items-center gap-3">
                                    <CircuitBoard size={18} className="text-cyan-500" /> Technology_Ecosystem_Nodes
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {insight.relatedSkills.map((s, i) => (
                                        <motion.div 
                                            key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                                            whileHover={{ y: -8, borderColor: "rgba(6, 182, 212, 0.4)" }}
                                            className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] group transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Affinity_Node</p>
                                                    <p className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{s.name}</p>
                                                </div>
                                                <div className={`p-3 rounded-2xl ${s.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {s.trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                                </div>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                                                <motion.div 
                                                    initial={{ width: 0 }} animate={{ width: `${s.affinity}%` }} transition={{ duration: 1, delay: 0.8 }}
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full" 
                                                />
                                            </div>
                                            <div className="flex justify-between mt-3">
                                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest font-mono">Cluster_Weight</span>
                                                <span className="text-[10px] font-bold text-cyan-500 font-mono">{s.affinity}%</span>
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

      {/* 🚀 GLOBAL STYLES & ANIMATIONS */}
      <style jsx global>{`
        @font-face { font-family: 'JetBrains Mono'; src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap'); }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
        @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 4s ease infinite; }
      `}</style>
    </div>
  );
}