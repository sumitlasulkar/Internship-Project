'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Zap, TrendingUp, TrendingDown, 
  Share2, Cpu, Globe, ArrowRight, Loader2, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

interface SkillInsight {
  mainSkill: string;
  demandScore: number;
  velocity: string;
  relatedSkills: { name: string; affinity: number; trend: 'up' | 'down' }[];
  marketOutlook: string;
}

export default function SkillMarketIntel() {
  const [query, setQuery] = useState("");
  const [insight, setInsight] = useState<SkillInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 🔴 AI LOGIC: ANALYZE INPUT & FIND RELATED TECH
  const analyzeSkill = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setInsight(null);

    const puter = (window as any).puter;
    const prompt = `
      Act as a Tech Market Analyst 2026. 
      Analyze the skill: "${query}".
      Provide:
      1. Demand Score (0-100).
      2. Growth Velocity (e.g., +15% YoY).
      3. 4 Related technologies that are mandatory with this skill.
      4. A 1-sentence professional market outlook.
      
      Output strictly as JSON:
      {
        "mainSkill": "${query}",
        "demandScore": 85,
        "velocity": "+12%",
        "relatedSkills": [
          { "name": "Next.js", "affinity": 95, "trend": "up" },
          { "name": "Tailwind", "affinity": 88, "trend": "up" }
        ],
        "marketOutlook": ""
      }
    `;

    try {
      const response = await puter.ai.chat(prompt);
      const data = JSON.parse(response.toString().replace(/```json|```/g, "").trim());
      setInsight(data);
    } catch (err) {
      console.error(err);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 relative overflow-hidden">
      {/* Background Neural Grid */}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:30px_30px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic uppercase">
                Market<span className="text-cyan-500">.Intelligence</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em]">Neural Skill-Graph & Velocity Engine</p>
        </header>

        {/* 🔍 SEARCH CONSOLE */}
        <div className="max-w-2xl mx-auto mb-20">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition-opacity" />
                <div className="relative flex bg-slate-900 border border-white/10 rounded-2xl p-2">
                    <div className="flex items-center px-4 text-slate-500">
                        <Search size={20} />
                    </div>
                    <input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && analyzeSkill()}
                        placeholder="Enter a skill (e.g. React, Docker, Python)..."
                        className="w-full bg-transparent border-none outline-none py-4 text-sm font-medium"
                    />
                    <button 
                        onClick={analyzeSkill}
                        disabled={isAnalyzing}
                        className="bg-cyan-500 text-black px-8 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all flex items-center gap-2"
                    >
                        {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} fill="currentColor" />}
                        {isAnalyzing ? 'Mapping' : 'Analyze'}
                    </button>
                </div>
            </div>
        </div>

        {/* 📊 DYNAMIC RESULTS AREA */}
        <AnimatePresence mode="wait">
            {insight && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Primary Node Score */}
                    <div className="lg:col-span-5 bg-slate-900/50 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Core Affinity</span>
                        <h2 className="text-5xl font-black text-white uppercase mb-2">{insight.mainSkill}</h2>
                        <div className="text-6xl font-black text-cyan-400 mb-6">{insight.demandScore}<span className="text-lg opacity-40">%</span></div>
                        <p className="text-xs text-slate-400 leading-relaxed italic">"{insight.marketOutlook}"</p>
                    </div>

                    {/* Related Skill Cluster (Animated Connection) */}
                    <div className="lg:col-span-7 space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-2">
                            <Share2 size={14} className="text-cyan-500" /> Technology Cluster
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {insight.relatedSkills.map((s, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-cyan-500/30 transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-sm font-bold text-white uppercase">{s.name}</p>
                                        <div className={`p-1.5 rounded-lg ${s.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                            {s.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.affinity}%` }}
                                            className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                                        />
                                    </div>
                                    <p className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-widest">Co-requisite Affinity: {s.affinity}%</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* 🏃 LIVE GLOBAL TICKER (Integrated) */}
        {!insight && !isAnalyzing && (
            <div className="mt-20 border-t border-white/5 pt-10">
                <div className="flex items-center gap-4 mb-8">
                    <Sparkles className="text-cyan-500" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Global Tech Velocity Ticker</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] overflow-hidden whitespace-nowrap relative">
                    <motion.div 
                        animate={{ x: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="flex gap-12"
                    >
                        {['CLOUD_NATIVE (+24%)', 'RUST_CORE (+45%)', 'GEN_AI (+120%)', 'WEB_GPU (+18%)', 'KUBERNETES (+12%)'].map((t, i) => (
                            <span key={i} className="text-xs font-mono font-bold text-slate-500 border-r border-white/10 pr-12">{t}</span>
                        ))}
                    </motion.div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}