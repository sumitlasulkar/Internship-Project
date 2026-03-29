'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Network, Files, Send, ArrowLeft, Cpu, Layout, 
  HardDrive, Sparkles, Loader2, Download, Copy, Milestone, 
  Layers, Terminal, Workflow, Binary, Code, Activity, 
  BoxSelect, Zap, Command, ShieldCheck, Info
} from 'lucide-react';
import Link from 'next/link';

interface Blueprint {
  overview: string;
  folder_structure: string;
  db_schema: string;
  api_endpoints: string[];
  tech_stack: { category: string; tool: string }[];
  roadmap: { phase: string; tasks: string[] }[];
  planning: string;
}

export default function SystemArchitect() {
    const [idea, setIdea] = useState("");
    const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'folders' | 'db' | 'api' | 'tech' | 'roadmap'>('folders');

    const generateBlueprint = async () => {
        if (!idea.trim()) return;
        setIsGenerating(true);
        setBlueprint(null);

        const puter = (window as any).puter;
        
        const prompt = `
            Act as a Senior System Architect.
            Concept: "${idea}".
            Provide:
            1. Overview (Technical Goal)
            2. Folder Structure (Clean Architecture Tree)
            3. Database Schema (NoSQL/SQL Collections)
            4. API Endpoints (Core 6)
            5. Tech Stack (Industry Standard)
            6. Roadmap (4 Phases)
            7. Scaling Planning.
            Output Strictly JSON.
        `;

        try {
            const response = await puter.ai.chat(prompt);
            const cleanJson = response.toString().replace(/```json|```/g, "").trim();
            setBlueprint(JSON.parse(cleanJson));
        } catch (err) {
            console.error(err);
        }
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-10 lg:p-16 relative overflow-x-hidden selection:bg-cyan-500/30">
            {/* 🌌 HYPER-REALISTIC BLUEPRINT GRID */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:128px_128px] opacity-50" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* 🛰️ SYSTEM HEADER */}
                <header className="mb-24 relative">
                    <Link href="/analytics">
                        <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 transition-all">
                            <ArrowLeft size={14} /> TERMINATE_SESSION
                        </motion.button>
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest rounded">Architecture Protocol 7.1</span>
                                <div className="h-[1px] w-24 bg-slate-800" />
                            </div>
                            <h1 className="text-7xl md:text-9xl font-bold tracking-[0.05em] leading-none uppercase mix-blend-lighten italic">
                                Arch<span className="text-cyan-500 font-black">.AI</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                    <Cpu className="text-cyan-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Processing Node</p>
                                    <p className="text-sm font-bold text-white uppercase italic tracking-tighter">Hyper-Logic V3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ⚙️ INPUT TERMINAL */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative group">
                            <div className="flex items-center gap-3 mb-8">
                                <Command size={18} className="text-cyan-400" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initialize Concept</h2>
                            </div>

                            <div className="relative mb-8">
                                <textarea 
                                    value={idea}
                                    onChange={(e) => setIdea(e.target.value)}
                                    placeholder="Enter your system vision..."
                                    className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-6 text-sm min-h-[220px] outline-none focus:border-cyan-500/40 transition-all placeholder:text-slate-800 resize-none font-mono leading-relaxed shadow-inner"
                                />
                                <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
                                    <Binary size={40} className="text-cyan-400" />
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generateBlueprint}
                                disabled={isGenerating || !idea.trim()}
                                className={`w-full py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${
                                    isGenerating ? 'bg-slate-800 text-slate-600' : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.3)]'
                                }`}
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                                {isGenerating ? 'SYNTHESIZING' : 'DEPLOY_MAP'}
                            </motion.button>
                        </motion.div>

                        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex items-start gap-4">
                            <Info size={20} className="text-slate-600 shrink-0 mt-1" />
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium uppercase tracking-wider italic">
                                "The engine will analyze your logic and generate a scalable blueprint including security vectors and modularity."
                            </p>
                        </div>
                    </div>

                    {/* 🏗️ OUTPUT CONSOLE */}
                    <div className="lg:col-span-8">
                        {!blueprint && !isGenerating ? (
                            <div className="h-[650px] border border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center gap-8 group">
                                <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/20 transition-all duration-700">
                                    <BoxSelect size={40} strokeWidth={1} className="text-slate-700 group-hover:text-cyan-600 transition-colors" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-800">System_Idle</p>
                                    <p className="text-slate-600 text-xs">Awaiting neural input to generate architecture.</p>
                                </div>
                            </div>
                        ) : isGenerating ? (
                            <div className="space-y-8">
                                <div className="h-20 bg-white/5 rounded-[2rem] animate-pulse" />
                                <div className="h-[550px] bg-white/5 rounded-[4rem] animate-pulse" />
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#050505] border border-cyan-500/20 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                                {/* 🏷️ TAB BAR */}
                                <div className="flex bg-slate-950/50 border-b border-white/5 overflow-x-auto no-scrollbar">
                                    {(['folders', 'db', 'tech', 'roadmap', 'api'] as const).map((tab) => (
                                        <button 
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-8 px-8 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                                                activeTab === tab ? 'text-cyan-400 bg-cyan-500/5' : 'text-slate-600 hover:text-slate-400'
                                            }`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                {tab === 'folders' && <Files size={18}/>}
                                                {tab === 'db' && <Database size={18}/>}
                                                {tab === 'tech' && <Layers size={18}/>}
                                                {tab === 'roadmap' && <Workflow size={18}/>}
                                                {tab === 'api' && <Network size={18}/>}
                                                {tab}
                                            </div>
                                            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8 md:p-16">
                                    {blueprint && (
                                    <div className="mb-16">
                                        <div className="flex items-center gap-3 mb-4">
                                            <ShieldCheck size={16} className="text-cyan-500" />
                                            <span className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em]">Core Planning Analysis</span>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-light text-white leading-tight italic">
                                            "{blueprint.planning}"
                                        </h2>
                                    </div>
                                    )}

                                    {/* 📋 DYNAMIC DATA VIEWER */}
                                    <div className="bg-black border border-white/5 rounded-[3rem] p-10 min-h-[500px] shadow-inner relative overflow-hidden group/console">
                                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover/console:opacity-10 transition-opacity">
                                            <Terminal size={120} />
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {activeTab === 'folders' && blueprint && (
                                                <motion.pre key="folders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-cyan-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                                    <span className="text-slate-700 block mb-6">// PRODUCTION_TREE_CONFIG</span>
                                                    {blueprint.folder_structure}
                                                </motion.pre>
                                            )}
                                            {activeTab === 'db' && blueprint && (
                                                <motion.pre key="db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                                    <span className="text-slate-700 block mb-6">// DATA_COLLECTION_RELATIONS</span>
                                                    {blueprint.db_schema}
                                                </motion.pre>
                                            )}
                                            {activeTab === 'tech' && blueprint && (
                                                <motion.div key="tech" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    {blueprint.tech_stack.map((item, i) => (
                                                        <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-cyan-500/20 transition-all group/stack">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{item.category}</p>
                                                                <Binary size={14} className="text-slate-800 group-hover/stack:text-cyan-500 transition-colors" />
                                                            </div>
                                                            <p className="text-xl font-bold text-white group-hover/stack:text-cyan-400 transition-colors">{item.tool}</p>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                            {activeTab === 'roadmap' && blueprint && (
                                                <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                                    {blueprint.roadmap.map((phase, i) => (
                                                        <div key={i} className="relative pl-12 border-l border-white/10">
                                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                                                            <div className="mb-6">
                                                                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block mb-2 opacity-50">Iteration 0{i+1}</span>
                                                                <h4 className="text-2xl font-black uppercase italic text-white tracking-tighter">{phase.phase}</h4>
                                                            </div>
                                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                {phase.tasks.map((task, j) => (
                                                                    <li key={j} className="text-sm text-slate-400 flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:text-white transition-colors">
                                                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0" /> 
                                                                        <span>{task}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                            {activeTab === 'api' && blueprint && (
                                                <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                                    {blueprint.api_endpoints.map((ep, i) => (
                                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-cyan-500/20 transition-all">
                                                            <div className="px-6 py-2 bg-cyan-500 text-black text-[10px] font-black rounded-xl uppercase tracking-widest">GATEWAY_NODE</div>
                                                            <code className="text-cyan-100 text-lg font-mono tracking-tighter">{ep}</code>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* 🛠️ CONSOLE ACTIONS */}
                                    <div className="mt-16 flex flex-col sm:flex-row gap-6">
                                        <button className="flex-1 py-6 bg-white/[0.03] border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black flex items-center justify-center gap-3 transition-all">
                                            <Copy size={16} /> Snapshot_Data
                                        </button>
                                        <button className="flex-1 py-6 bg-cyan-500/10 border border-cyan-500/20 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400 hover:bg-cyan-500 hover:text-black flex items-center justify-center gap-3 transition-all">
                                            <Download size={16} /> Export_Blueprint
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                @font-face {
                    font-family: 'JetBrains Mono';
                    src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap');
                }
            `}</style>
        </div>
    );
}