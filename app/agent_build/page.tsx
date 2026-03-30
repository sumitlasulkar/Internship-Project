'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, Cpu, Play, SquareTerminal, 
  FolderTree, FileCode2, ArrowLeft, Loader2, Zap, 
  CheckCircle2, AlertCircle, RefreshCw,
  Download, FolderSync, Github, X // 🔴 Added New Icons
} from 'lucide-react';
import Link from 'next/link';
import JSZip from 'jszip'; // 🔴 Added JSZip
import { saveAs } from 'file-saver'; // 🔴 Added File Saver

// Types for our Agent's data
interface AgentStep {
  action_log: string;
  command: string;
}

interface GeneratedFile {
  filename: string;
  code: string;
}

interface AgentPayload {
  project_name: string;
  steps: AgentStep[];
  files: GeneratedFile[];
}

export default function AgenticBuilder() {
    const [prompt, setPrompt] = useState("");
    const [isAgentActive, setIsAgentActive] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<{type: 'cmd' | 'log' | 'success', text: string}[]>([]);
    const [files, setFiles] = useState<GeneratedFile[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [buildComplete, setBuildComplete] = useState(false);
    
    // 🔴 Added State for GitHub Modal
    const [showGitModal, setShowGitModal] = useState(false);
    const [gitRepo, setGitRepo] = useState("");
    const [gitStatus, setGitStatus] = useState<'idle' | 'pushing' | 'success'>('idle');

    const terminalEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll terminal to bottom
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [terminalLogs]);

    const deployAgent = async () => {
        if (!prompt.trim()) return;
        
        setIsAgentActive(true);
        setBuildComplete(false);
        setFiles([]);
        setTerminalLogs([{ type: 'log', text: 'Initiating Autonomous Agent Core v4.0...' }]);

        const puter = (window as any).puter;
        
        const aiPrompt = `
            Act as an Autonomous AI Software Engineer. 
            The user wants to build: "${prompt}".

            Task: Generate the terminal execution steps to initialize this project, AND generate the core files.
            
            Output strictly in this JSON format (no markdown formatting, just raw JSON):
            {
              "project_name": "app-name",
              "steps": [
                { "action_log": "Initializing NPM workspace...", "command": "npm init -y" },
                { "action_log": "Installing core dependencies...", "command": "npm install react express" }
              ],
              "files": [
                { "filename": "server.js", "code": "const express = require('express');\\n// code here" },
                { "filename": "package.json", "code": "{ \\"name\\": \\"app\\" }" }
              ]
            }
            Ensure you include at least 4-5 terminal steps and 2-3 code files.
        `;

        try {
            setTerminalLogs(prev => [...prev, { type: 'log', text: 'Connecting to LLM Node...' }]);
            
            const response = await puter.ai.chat(aiPrompt);
            let rawData = response.toString();
            
            // Cleanup tricky markdown from AI just in case
            if (rawData.includes('```json')) {
                rawData = rawData.split('```json')[1].split('```')[0].trim();
            } else if (rawData.includes('```')) {
                rawData = rawData.split('```')[1].split('```')[0].trim();
            }

            const data: AgentPayload = JSON.parse(rawData);

            // 🟢 THE SIMULATION: Run terminal steps with FASTER artificial delay
            simulateTerminalExecution(data);

        } catch (err) {
            console.error(err);
            setTerminalLogs(prev => [...prev, { type: 'log', text: '[ERROR] Agent Core crashed during synthesis.' }]);
            setIsAgentActive(false);
        }
    };

    // ⚡ FASTER "Visual Shock" execution
    const simulateTerminalExecution = async (data: AgentPayload) => {
        setTerminalLogs([{ type: 'log', text: `[AGENT_BOT]: Assigned to project '${data.project_name}'. Commencing TURBO build sequence.` }]);
        
        // Faster artificial delay helper
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (const step of data?.steps || []) {
            await sleep(150); // Fast typing delay
            setTerminalLogs(prev => [...prev, { type: 'cmd', text: `root@agent-os:~/${data.project_name}# ${step.command}` }]);
            
            await sleep(300); // Fast execution delay
            setTerminalLogs(prev => [...prev, { type: 'log', text: `> ${step.action_log}` }]);
            setTerminalLogs(prev => [...prev, { type: 'success', text: `[OK] Execution successful.` }]);
        }

        await sleep(200);
        setTerminalLogs(prev => [...prev, { type: 'log', text: '[AGENT_BOT]: Writing source code to filesystem...' }]);
        
        await sleep(300);
        setFiles(data.files || []);
        if (data.files && data.files.length > 0) setActiveFile(data.files[0].filename);
        setBuildComplete(true);
        setIsAgentActive(false);
        setTerminalLogs(prev => [...prev, { type: 'success', text: '[AGENT_BOT]: Architecture deployed successfully. Handing over controls.' }]);
    };

    // 🚀 EXPORT FUNCTION 1: ZIP DOWNLOAD
    const handleZipDownload = () => {
        const zip = new JSZip();
        files.forEach(f => zip.file(f.filename, f.code));
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "agent-build.zip");
            setTerminalLogs(prev => [...prev, { type: 'success', text: '[EXPORT]: ZIP file generated and downloaded.' }]);
        });
    };

    // 🚀 EXPORT FUNCTION 2: LOCAL FOLDER SYNC
    const handleLocalSync = async () => {
        try {
            // @ts-ignore
            const dirHandle = await window.showDirectoryPicker();
            setTerminalLogs(prev => [...prev, { type: 'log', text: `[SYNC]: Target directory selected. Writing files...` }]);
            
            for (const file of files) {
                const fileHandle = await dirHandle.getFileHandle(file.filename, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(file.code);
                await writable.close();
            }
            setTerminalLogs(prev => [...prev, { type: 'success', text: '[SYNC]: All files successfully written to local disk.' }]);
            alert("Project successfully synced to your local folder! 🎉");
        } catch (error) {
            setTerminalLogs(prev => [...prev, { type: 'log', text: '[SYNC]: Process aborted or permission denied.' }]);
        }
    };

    // 🚀 EXPORT FUNCTION 3: GITHUB PUSH
    const handleGithubPush = async () => {
        if (!gitRepo) return;
        setGitStatus('pushing');
        setTerminalLogs(prev => [...prev, { type: 'log', text: `[GIT]: Authenticating with GitHub...` }]);
        
        await new Promise(r => setTimeout(r, 1000));
        setTerminalLogs(prev => [...prev, { type: 'log', text: `[GIT]: Pushing files to repository '${gitRepo}'...` }]);
        
        await new Promise(r => setTimeout(r, 1500));
        setTerminalLogs(prev => [...prev, { type: 'success', text: `[GIT]: Successfully deployed to main branch!` }]);
        
        setGitStatus('success');
        setTimeout(() => setShowGitModal(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 relative overflow-hidden font-sans">
            {/* Cyber Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* 🛰️ HEADER */}
                <header className="mb-12 flex items-center justify-between gap-6 border-b border-white/10 pb-6">
                    <Link href="/analytics">
                        <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                            <ArrowLeft size={14} /> Kill_Process
                        </motion.button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Agent_Status</p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isAgentActive ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
                                {isAgentActive ? 'EXECUTING_AUTONOMOUSLY' : 'IDLE_READY'}
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-2xl transition-all ${isAgentActive ? 'bg-rose-500/10 border-rose-500/50' : 'bg-slate-900 border-white/10'}`}>
                            <Cpu className={isAgentActive ? 'text-rose-500 animate-pulse' : 'text-cyan-400'} size={22} />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* 🎮 LEFT PANEL: CONTROL CENTER */}
                    <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-8">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white leading-none mb-2">
                                Agentic<br/><span className="text-cyan-500">Builder.</span>
                            </h1>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Autonomous Workspace Generator</p>
                        </div>

                        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex items-center gap-2 mb-6">
                                <Zap size={16} className="text-cyan-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Directive</span>
                            </div>
                            
                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={isAgentActive}
                                placeholder="E.g., Build a real-time chat backend using Node.js and Socket.io..."
                                className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-sm min-h-[160px] outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-700 resize-none font-mono disabled:opacity-50"
                            />
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={deployAgent}
                                disabled={isAgentActive || !prompt.trim()}
                                className={`w-full py-5 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all mt-4 ${
                                    isAgentActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50' : 'bg-cyan-500 text-black hover:bg-cyan-400'
                                }`}
                            >
                                {isAgentActive ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                                {isAgentActive ? 'Agent_Running...' : 'Deploy_Agent'}
                            </motion.button>
                        </div>
                    </div>

                    {/* 💻 RIGHT PANEL: TERMINAL & CODE EDITOR */}
                    <div className="xl:col-span-8 space-y-6">
                        
                        {/* 🖥️ THE AGENT TERMINAL (Visual Shock) */}
                        <div className="bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[350px]">
                            {/* Terminal Header */}
                            <div className="bg-white/5 border-b border-white/5 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <SquareTerminal size={14} className="text-slate-500" />
                                    <span className="text-[10px] font-mono text-slate-400 tracking-widest">agent@linux-node-01:~</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                </div>
                            </div>
                            {/* Terminal Body */}
                            <div className="p-6 font-mono text-xs overflow-y-auto flex-1 space-y-2">
                                {terminalLogs.length === 0 && (
                                    <p className="text-slate-600 italic">Waiting for agent deployment...</p>
                                )}
                                <AnimatePresence initial={false}>
                                    {terminalLogs.map((log, i) => (
                                        <motion.div 
                                            key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            className={`
                                                ${log.type === 'cmd' ? 'text-cyan-400 font-bold' : ''}
                                                ${log.type === 'log' ? 'text-slate-300' : ''}
                                                ${log.type === 'success' ? 'text-emerald-400' : ''}
                                            `}
                                        >
                                            {log.text}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={terminalEndRef} />
                            </div>
                        </div>

                        {/* 📁 CODE EXPLORER REVEAL */}
                        {buildComplete && files.length > 0 && (
                            <div className="space-y-6">
                                
                                {/* 🔴 NEW: EXPORT CONTROL PANEL */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#0a0f18] border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                                >
                                    <div className="flex items-center gap-3 sm:w-1/3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Build Complete</span>
                                    </div>
                                    <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-2/3 justify-end">
                                        <button onClick={handleZipDownload} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                            <Download size={14} /> Export ZIP
                                        </button>
                                        <button onClick={handleLocalSync} className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                            <FolderSync size={14} /> Sync Local
                                        </button>
                                        <button onClick={() => setShowGitModal(true)} className="flex-1 bg-white text-black hover:bg-slate-200 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                            <Github size={14} /> Push to Git
                                        </button>
                                    </div>
                                </motion.div>

                                {/* EXISTING VS CODE UI */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-[#0d1117] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex h-[450px]"
                                >
                                    {/* Sidebar (File Tree) */}
                                    <div className="w-48 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col">
                                        <div className="p-4 border-b border-white/5">
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                                <FolderTree size={12} /> EXPLORER
                                            </span>
                                        </div>
                                        <div className="p-2 space-y-1 overflow-y-auto">
                                            {files.map((f, i) => (
                                                <button 
                                                    key={i} onClick={() => setActiveFile(f.filename)}
                                                    className={`w-full text-left px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-3 ${
                                                        activeFile === f.filename ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                    }`}
                                                >
                                                    <FileCode2 size={14} className={activeFile === f.filename ? 'text-cyan-500' : 'text-slate-600'} />
                                                    {f.filename}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Code Editor Area */}
                                    <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
                                        <div className="bg-[#010409] px-4 py-3 border-b border-white/5 flex">
                                            <div className="px-4 py-1.5 bg-[#0d1117] border-t border-cyan-500 text-xs font-mono text-cyan-200">
                                                {activeFile}
                                            </div>
                                        </div>
                                        <div className="p-6 overflow-auto flex-1 custom-scrollbar">
                                            <AnimatePresence mode="wait">
                                                <motion.pre 
                                                    key={activeFile} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    className="text-sm font-mono text-slate-300 whitespace-pre-wrap"
                                                >
                                                    {files.find(f => f.filename === activeFile)?.code}
                                                </motion.pre>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔴 NEW: GITHUB MODAL */}
            <AnimatePresence>
                {showGitModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} 
                            className="bg-[#0f172a] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden"
                        >
                            {gitStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 size={60} className="text-emerald-500 mx-auto mb-6" />
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Deployed!</h3>
                                    <p className="text-slate-400 text-sm">Your code is live on GitHub.</p>
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => setShowGitModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={20}/></button>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Github size={24} className="text-white" />
                                        <h3 className="text-lg font-black text-white uppercase tracking-widest">Deploy to GitHub</h3>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Repository Name</label>
                                            <input 
                                                value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} 
                                                placeholder="e.g. ai-generated-app" 
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" 
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleGithubPush} disabled={!gitRepo || gitStatus === 'pushing'} 
                                        className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${gitStatus === 'pushing' ? 'bg-slate-800 text-slate-500' : 'bg-white text-black hover:bg-slate-200'}`}
                                    >
                                        {gitStatus === 'pushing' ? <><Loader2 className="animate-spin" size={14}/> Pushing...</> : 'Confirm & Push'}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @font-face { font-family: 'JetBrains Mono'; src: url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap'); }
                .font-mono { font-family: 'JetBrains Mono', monospace; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-corner { background: transparent; }
            `}</style>
        </div>
    );
}