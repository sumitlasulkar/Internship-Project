'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Database, Network, Files, Send, 
  ArrowLeft, Cpu, Layout, HardDrive, 
  Globe, Sparkles, Loader2, Download, Copy 
} from 'lucide-react';
import Link from 'next/link';

interface Blueprint {
  overview: string;
  folder_structure: string;
  db_schema: string;
  api_endpoints: string[];
}

export default function SystemArchitect() {
    const [idea, setIdea] = useState("");
    const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'folders' | 'db' | 'api'>('folders');

    const generateBlueprint = async () => {
        if (!idea.trim()) return;
        setIsGenerating(true);
        setBlueprint(null);

        const puter = (window as any).puter;
        
        const prompt = `
            Act as a Senior System Architect. 
            The user wants to build: "${idea}".
            
            Provide a technical blueprint including:
            1. Overview: 1-sentence technical goal.
            2. Folder Structure: A professional, production-ready directory tree.
            3. Database Schema: Detailed NoSQL collections or SQL tables with relations.
            4. API Endpoints: List of 5-6 core RESTful endpoints with methods.

            Output format strictly JSON:
            {
              "overview": "",
              "folder_structure": "",
              "db_schema": "",
              "api_endpoints": []
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
        <div className="min-h-screen bg-[#00050a] text-zinc-100 font-sans p-4 md:p-10 relative overflow-x-hidden">
            {/* Blueprint Grid Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16">
                    <Link href="/analytics">
                        <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest mb-8 transition-colors">
                            <ArrowLeft size={14} /> Back to Hub
                        </motion.button>
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-light tracking-tighter">System <br/><span className="text-cyan-400 font-medium">Architect.</span></h1>
                            <p className="text-zinc-500 text-sm mt-4 uppercase tracking-[0.2em] font-bold">Neural Project Blueprinting Engine</p>
                        </div>
                        <div className="flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 px-6 py-3 rounded-2xl">
                            <Cpu className="text-cyan-400 animate-pulse" size={18} />
                            <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Logic Node: V3.Active</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Input Console */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0a0f18] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Sparkles className="text-cyan-400" size={16} /> Concept Input
                            </h3>
                            <textarea 
                                value={idea}
                                onChange={(e) => setIdea(e.target.value)}
                                placeholder="e.g., A real-time micro-blogging platform for developers..."
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm min-h-[150px] outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-800 resize-none mb-6"
                            />
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={generateBlueprint}
                                disabled={isGenerating || !idea.trim()}
                                className="w-full py-5 rounded-2xl bg-cyan-500 text-black font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(6,182,212,0.2)] disabled:opacity-30 transition-all"
                            >
                                {isGenerating ? (
                                    <>Architecting <Loader2 className="animate-spin" size={16} /></>
                                ) : (
                                    <>Generate Blueprint <Layout size={16} /></>
                                )}
                            </motion.button>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-cyan-500/5 to-transparent border border-cyan-500/10 rounded-[2.5rem]">
                            <p className="text-[10px] text-zinc-500 leading-relaxed italic uppercase font-medium">
                                "Architecture is not about making things look pretty, it's about making them work at scale."
                            </p>
                        </div>
                    </div>

                    {/* Output Drafting Table */}
                    <div className="lg:col-span-8">
                        {!blueprint && !isGenerating ? (
                            <div className="h-[500px] border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-zinc-800">
                                <HardDrive size={60} strokeWidth={1} />
                                <p className="mt-4 text-[10px] font-black uppercase tracking-widest">Waiting for concept initiation...</p>
                            </div>
                        ) : isGenerating ? (
                            <div className="space-y-6">
                                <div className="h-20 bg-white/5 rounded-3xl animate-pulse" />
                                <div className="h-80 bg-white/5 rounded-3xl animate-pulse" />
                            </div>
                        ) : blueprint ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#050a10] border border-cyan-500/20 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.05)]"
                            >
                                {/* Dashboard Tabs */}
                                <div className="flex border-b border-white/5 bg-white/[0.02]">
                                    {(['folders', 'db', 'api'] as const).map((tab) => (
                                        <button 
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                                                activeTab === tab ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5' : 'text-zinc-600 border-transparent hover:text-zinc-400'
                                            }`}
                                        >
                                            {tab === 'folders' && <><Files className="inline mr-2" size={14}/> Structure</>}
                                            {tab === 'db' && <><Database className="inline mr-2" size={14}/> Schema</>}
                                            {tab === 'api' && <><Network className="inline mr-2" size={14}/> Interface</>}
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8 md:p-12">
                                    <div className="mb-10">
                                        <span className="text-[9px] text-cyan-500 font-black uppercase tracking-widest block mb-2">Architectural Overview</span>
                                        <p className="text-xl font-medium text-zinc-200"    >"{blueprint.overview}"</p>
                                    </div>

                                    <div className="bg-black/50 border border-white/5 rounded-3xl p-6 font-mono text-sm overflow-x-auto min-h-[300px]">
                                        <AnimatePresence mode="wait">
                                            {activeTab === 'folders' && (
                                                <motion.pre 
                                                    key="folders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className="text-cyan-100 whitespace-pre-wrap"
                                                >
                                                    {blueprint.folder_structure}
                                                </motion.pre>
                                            )}
                                            {activeTab === 'db' && (
                                                <motion.pre 
                                                    key="db" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className="text-emerald-300 whitespace-pre-wrap"
                                                >
                                                    {blueprint.db_schema}
                                                </motion.pre>
                                            )}
                                            {activeTab === 'api' && (
                                                <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                                    {blueprint.api_endpoints.map((ep, i) => (
                                                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                                            <div className="px-3 py-1 bg-cyan-500 text-black text-[9px] font-black rounded uppercase tracking-tighter">Endpoint</div>
                                                            <code className="text-cyan-200">{ep}</code>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="mt-10 flex gap-4">
                                        <button className="flex-1 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 flex items-center justify-center gap-2">
                                            <Copy size={14} /> Copy Config
                                        </button>
                                        <button className="flex-1 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 flex items-center justify-center gap-2">
                                            <Download size={14} /> Export Blueprint
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </div>

                </div>
            </div>
            
            <style jsx global>{`
                pre::-webkit-scrollbar { width: 4px; height: 4px; }
                pre::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
            `}</style>
        </div>
    );
}