'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Database, Network, Files, Send, 
  ArrowLeft, Cpu, Layout, HardDrive, 
  Globe, Sparkles, Loader2, Download, Copy,
  Milestone, Layers, ClipboardList, Terminal,
  Workflow, Binary, Code, Activity,
  RefreshCw
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
            Act as a Senior System Architect and Product Manager. 
            The user wants to build: "${idea}".
            
            Provide a complete technical execution plan including:
            1. Overview: 1-sentence technical goal.
            2. Folder Structure: A professional, production-ready directory tree.
            3. Database Schema: Detailed NoSQL collections or SQL tables with relations.
            4. API Endpoints: List of 5-6 core RESTful endpoints with methods.
            5. Tech Stack: Recommended technologies (Frontend, Backend, DB, Cache, Auth, Hosting).
            6. Roadmap: 4 distinct phases (MVP, Integration, Scaling, Security) with specific tasks.
            7. Planning: A brief strategy on handling high-concurrency or data integrity for this specific idea.

            Output format strictly JSON:
            {
              "overview": "",
              "folder_structure": "",
              "db_schema": "",
              "api_endpoints": [],
              "tech_stack": [{ "category": "", "tool": "" }],
              "roadmap": [{ "phase": "", "tasks": [""] }],
              "planning": ""
            }
        `;

        try {
            const response = await puter.ai.chat(prompt);
            const cleanJson = response.toString().replace(/```json|```/g, "").trim();
            setBlueprint(JSON.parse(cleanJson));
        } catch (err) {
            console.error(err);
            alert("Neural mapping failed. Please retry.");
        }
        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen bg-[#00050a] text-zinc-100 font-sans p-4 md:p-8 lg:p-12 relative overflow-x-hidden">
            {/* 🛠️ ENHANCED BLUEPRINT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1.5px,transparent_1.5px),linear-gradient(to_bottom,#1e293b_1.5px,transparent_1.5px)] bg-[size:60px_60px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:15px_15px] opacity-40" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* 🚀 HEADER SECTION */}
                <header className="mb-20">
                    <Link href="/analytics">
                        <motion.button 
                            whileHover={{ x: -5 }} 
                            className="flex items-center gap-2 text-zinc-500 hover:text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 transition-all group"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
                        </motion.button>
                    </Link>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
                                System<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-cyan-500 animate-gradient-x">Architect.</span>
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="h-[2px] w-20 bg-cyan-500/50" />
                                <p className="text-zinc-500 text-xs uppercase tracking-[0.5em] font-bold">Project Neural Mapping Engine</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="bg-black/40 backdrop-blur-md border border-white/5 px-8 py-4 rounded-3xl shadow-xl flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                    <Cpu className="text-cyan-400 animate-pulse" size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-bold text-white uppercase tracking-tighter">Logic Core V3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* 🎮 INPUT CONSOLE */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#0a0f18]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Activity className="text-cyan-400" size={60} />
                            </div>

                            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 text-cyan-400">
                                <Terminal size={16} /> Mission Params
                            </h3>
                            
                            <textarea 
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="Describe the project concept..."
                                className="w-full bg-black/50 border border-white/5 rounded-3xl p-6 text-sm min-h-[180px] outline-none focus:border-cyan-500/30 transition-all placeholder:text-zinc-800 resize-none mb-8 leading-relaxed shadow-inner"
                            />
                            
                            <motion.button 
                                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(6, 182, 212, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generateBlueprint}
                                disabled={isGenerating || !idea.trim()}
                                className={`w-full py-6 rounded-3xl font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-3 transition-all ${
                                    isGenerating ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-cyan-400'
                                }`}
                            >
                                {isGenerating ? (
                                    <>Processing <RefreshCw className="animate-spin" size={16} /></>
                                ) : (
                                    <>Initialize Map <Send size={16} /></>
                                )}
                            </motion.button>
                        </motion.div>

                        <div className="p-8 border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm">
                            <Sparkles className="text-cyan-400 mb-4" size={20} />
                            <p className="text-[11px] text-zinc-500 leading-relaxed italic uppercase font-bold tracking-wider">
                                "The architect must be a prophet... a prophet in the true sense of the term... if he can't see at least ten years ahead don't call him an architect."
                            </p>
                        </div>
                    </div>

                    {/* 🏗️ OUTPUT DRAFTING AREA */}
                    <div className="lg:col-span-8">
                        {!blueprint && !isGenerating ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-[600px] border-2 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center gap-6 group"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <Binary size={80} strokeWidth={1} className="text-zinc-800 group-hover:text-cyan-900 transition-colors" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Awaiting Signal</p>
                                    <p className="text-zinc-500 text-xs">Enter your project vision to start neural mapping.</p>
                                </div>
                            </motion.div>
                        ) : isGenerating ? (
                            <div className="space-y-8">
                                <div className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />
                                <div className="h-[500px] bg-white/5 rounded-[3rem] animate-pulse" />
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#050a10]/60 backdrop-blur-2xl border border-cyan-500/20 rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
                            >
                                {/* 🏷️ TAB SYSTEM */}
                                <div className="flex border-b border-white/10 bg-black/40 overflow-x-auto custom-scrollbar no-scrollbar">
                                    {(['folders', 'db', 'tech', 'roadmap', 'api'] as const).map((tab) => (
                                        <button 
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-8 px-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-2 whitespace-nowrap flex items-center justify-center gap-3 ${
                                                activeTab === tab ? 'text-cyan-400 border-cyan-400 bg-cyan-500/10' : 'text-zinc-600 border-transparent hover:text-zinc-400'
                                            }`}
                                        >
                                            {tab === 'folders' && <Files size={16}/>}
                                            {tab === 'db' && <Database size={16}/>}
                                            {tab === 'tech' && <Layers size={16}/>}
                                            {tab === 'roadmap' && <Workflow size={16}/>}
                                            {tab === 'api' && <Network size={16}/>}
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8 md:p-14">
                                    {blueprint && (
                                    <div className="mb-14 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
                                            <span className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em]">Core Logic Analysis</span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-medium text-white italic leading-tight border-l-4 border-cyan-500/30 pl-8">
                                            "{blueprint.planning}"
                                        </h2>
                                    </div>
                                    )}

                                    {/* 📜 CONTENT VIEWER */}
                                    <div className="bg-black/60 border border-white/5 rounded-[3rem] p-10 font-mono text-sm overflow-x-auto min-h-[500px] shadow-inner">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'folders' && blueprint && (
                                                <motion.pre 
                                                    key="folders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                                    className="text-cyan-100 whitespace-pre-wrap leading-loose"
                                                >
                                                    <span className="text-zinc-700 block mb-6">// PROJECT_DIR_ARCHITECTURE</span>
                                                    {blueprint.folder_structure}
                                                </motion.pre>
                                            )}
                                            {activeTab === 'db' && blueprint && (
                                                <motion.pre 
                                                    key="db" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    className="text-emerald-300 whitespace-pre-wrap leading-loose"
                                                >
                                                    <span className="text-zinc-700 block mb-6">// DATABASE_ENTITY_RELATIONS</span>
                                                    {blueprint.db_schema}
                                                </motion.pre>
                                            )}
                                            {activeTab === 'tech' && blueprint && (
                                                <motion.div key="tech" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    {blueprint.tech_stack.map((item, i) => (
                                                        <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-cyan-500/20 transition-colors group">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{item.category}</p>
                                                                <Code size={12} className="text-zinc-800 group-hover:text-cyan-500 transition-colors" />
                                                            </div>
                                                            <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors tracking-tight">{item.tool}</p>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                            {activeTab === 'roadmap' && blueprint && (
                                                <motion.div key="roadmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 py-4">
                                                    {blueprint.roadmap.map((phase, i) => (
                                                        <div key={i} className="relative pl-12 border-l border-white/10 group">
                                                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#000] border-2 border-cyan-500 rounded-full z-10 shadow-[0_0_15px_rgba(6,182,212,0.4)]" />
                                                            <div className="mb-4">
                                                                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1 block opacity-60">Phase 0{i+1}</span>
                                                                <h4 className="text-xl font-black uppercase tracking-widest text-white">{phase.phase}</h4>
                                                            </div>
                                                            <ul className="space-y-4">
                                                                {phase.tasks.map((task, j) => (
                                                                    <li key={j} className="text-sm text-zinc-400 flex items-start gap-3">
                                                                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-1.5 shrink-0" /> 
                                                                        <span className="leading-relaxed">{task}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                            {activeTab === 'api' && blueprint && (
                                                <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                                    <span className="text-zinc-700 block mb-6 font-mono tracking-tighter">// ENDPOINT_REGISTRY_v1</span>
                                                    {blueprint.api_endpoints.map((ep, i) => (
                                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all">
                                                            <div className="px-4 py-1.5 bg-cyan-500 text-black text-[9px] font-black rounded-lg uppercase tracking-widest text-center">API NODE</div>
                                                            <code className="text-cyan-200 text-lg tracking-tighter">{ep}</code>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* 🛠️ ACTION BUTTONS */}
                                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                        <button className="flex-1 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-black hover:border-cyan-500 flex items-center justify-center gap-3 transition-all">
                                            <Copy size={16} /> Snapshot Config
                                        </button>
                                        <button className="flex-1 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black flex items-center justify-center gap-3 transition-all">
                                            <Download size={16} /> Deploy Blueprint
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* 💅 STYLES */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 5s ease infinite;
                }
            `}</style>
        </div>
    );
}