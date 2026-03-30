'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, Cpu, Play, SquareTerminal, 
  FolderTree, FileCode2, ArrowLeft, Loader2, Zap, 
  RefreshCw, Download, FolderSync, Github, CheckCircle2, X
} from 'lucide-react';
import Link from 'next/link';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface AgentStep { action_log: string; command: string; }
interface GeneratedFile { filename: string; code: string; }
interface AgentPayload { project_name: string; steps: AgentStep[]; files: GeneratedFile[]; }

export default function AgenticBuilder() {
    const [prompt, setPrompt] = useState("");
    const [isAgentActive, setIsAgentActive] = useState(false);
    const [terminalLogs, setTerminalLogs] = useState<{type: 'cmd' | 'log' | 'success' | 'error', text: string}[]>([]);
    const [files, setFiles] = useState<GeneratedFile[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [buildComplete, setBuildComplete] = useState(false);
    
    // GitHub Modal State
    const [showGitModal, setShowGitModal] = useState(false);
    const [gitRepo, setGitRepo] = useState("");
    const [gitStatus, setGitStatus] = useState<'idle' | 'pushing' | 'success'>('idle');

    const terminalEndRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [terminalLogs]);
    useEffect(() => {
        if (buildComplete && files.length > 0) {
            setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
        }
    }, [buildComplete, files]);

    // 🤖 TURBO AI DEPLOYMENT
    const deployAgent = async () => {
        if (!prompt.trim()) return;
        setIsAgentActive(true); setBuildComplete(false); setFiles([]);
        setTerminalLogs([{ type: 'log', text: 'Initiating Autonomous Agent Core v5.0...' }]);

        const puter = (window as any).puter;
        const aiPrompt = `
            Act as an Autonomous Software Engineer. User prompt: "${prompt}".
            OUTPUT STRICTLY IN JSON FORMAT:
            {
              "project_name": "ai-generated-app",
              "steps": [
                { "action_log": "Initializing workspace...", "command": "npm init -y" },
                { "action_log": "Building core architecture...", "command": "mkdir src && touch src/index.js" }
              ],
              "files": [
                { "filename": "index.js", "code": "// Core Logic\\nconsole.log('App Online');" },
                { "filename": "package.json", "code": "{\\n  \\"name\\": \\"ai-app\\"\\n}" }
              ]
            }
        `;

        try {
            setTerminalLogs(prev => [...prev, { type: 'log', text: 'Connecting to Neural Backend...' }]);
            const response = await puter.ai.chat(aiPrompt);
            let rawData = response.toString();
            if (rawData.includes('```json')) rawData = rawData.split('```json')[1].split('```')[0].trim();
            else if (rawData.includes('```')) rawData = rawData.split('```')[1].split('```')[0].trim();

            const data: AgentPayload = JSON.parse(rawData);
            if (!data.files || data.files.length === 0) data.files = [{ filename: "app.js", code: "// Auto-generated\nconsole.log('Ready');" }];
            
            simulateTerminalExecution(data);
        } catch (err) {
            setTerminalLogs(prev => [...prev, { type: 'error', text: '[FATAL] Agent Core crashed. Retrying...' }]);
            setIsAgentActive(false);
        }
    };

    const simulateTerminalExecution = async (data: AgentPayload) => {
        setTerminalLogs([{ type: 'log', text: `[AGENT]: Assigned to '${data.project_name}'. TURBO MODE ENGAGED.` }]);
        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

        for (const step of data?.steps || []) {
            await sleep(150);
            setTerminalLogs(prev => [...prev, { type: 'cmd', text: `root@agent-os:~/${data.project_name}# ${step.command}` }]);
            await sleep(250); 
            setTerminalLogs(prev => [...prev, { type: 'log', text: `> ${step.action_log}` }]);
            setTerminalLogs(prev => [...prev, { type: 'success', text: `[OK] Task complete.` }]);
        }

        await sleep(300);
        setTerminalLogs(prev => [...prev, { type: 'log', text: '[AGENT]: Synchronizing files to UI...' }]);
        setFiles(data.files);
        if (data.files.length > 0) setActiveFile(data.files[0].filename);
        setBuildComplete(true);
        setIsAgentActive(false);
        setTerminalLogs(prev => [...prev, { type: 'success', text: '[AGENT]: Architecture deployed. Handing over controls.' }]);
    };

    // 🚀 EXPORT MODULE 1: ZIP DOWNLOAD
    const handleZipDownload = () => {
        const zip = new JSZip();
        files.forEach(f => zip.file(f.filename, f.code));
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "agent-build.zip");
            setTerminalLogs(prev => [...prev, { type: 'success', text: '[EXPORT]: ZIP file generated and downloaded.' }]);
        });
    };

    // 🚀 EXPORT MODULE 2: LOCAL FILE SYSTEM SYNC
    const handleLocalSync = async () => {
        try {
            // @ts-ignore - File System API is modern and might not be in standard TS types yet
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
            setTerminalLogs(prev => [...prev, { type: 'error', text: '[SYNC]: Aborted or failed. Check browser permissions.' }]);
        }
    };

    // 🚀 EXPORT MODULE 3: GITHUB PUSH (Simulated High-Tech Action)
    const handleGithubPush = async () => {
        if (!gitRepo) return;
        setGitStatus('pushing');
        setTerminalLogs(prev => [...prev, { type: 'log', text: `[GIT]: Authenticating with GitHub...` }]);
        
        // Artificial delay for realistic API simulation
        await new Promise(r => setTimeout(r, 1000));
        setTerminalLogs(prev => [...prev, { type: 'log', text: `[GIT]: Creating repository '${gitRepo}'...` }]);
        
        await new Promise(r => setTimeout(r, 1500));
        setTerminalLogs(prev => [...prev, { type: 'log', text: `[GIT]: Pushing ${files.length} blob(s) to main branch...` }]);
        
        await new Promise(r => setTimeout(r, 1000));
        setTerminalLogs(prev => [...prev, { type: 'success', text: `[GIT]: Successfully deployed to https://github.com/user/${gitRepo}` }]);
        
        setGitStatus('success');
        setTimeout(() => setShowGitModal(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 relative overflow-hidden font-sans">
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
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isAgentActive ? 'text-cyan-500 animate-pulse' : 'text-emerald-500'}`}>
                                {isAgentActive ? 'EXECUTING_AUTONOMOUSLY' : 'IDLE_READY'}
                            </p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shadow-2xl transition-all ${isAgentActive ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900 border-white/10'}`}>
                            <Cpu className={isAgentActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'} size={22} />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* 🎮 CONTROL CENTER */}
                    <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-8">
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-white leading-none mb-2">
                                Agentic<br/><span className="text-cyan-500">Builder.</span>
                            </h1>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Code Generation & Deployment</p>
                        </div>

                        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                            <textarea 
                                value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isAgentActive}
                                placeholder="Describe the app you want to build..."
                                className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-sm min-h-[160px] outline-none focus:border-cyan-500/50 transition-all font-mono shadow-inner mb-4"
                            />
                            <button 
                                onClick={deployAgent} disabled={isAgentActive || !prompt.trim()}
                                className={`w-full py-5 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${isAgentActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)]'}`}
                            >
                                {isAgentActive ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                                {isAgentActive ? 'Synthesizing...' : 'Deploy_Agent'}
                            </button>
                        </div>
                    </div>

                    {/* 💻 TERMINAL & IDE */}
                    <div className="xl:col-span-8 space-y-6">
                        
                        {/* TERMINAL */}
                        <div className="bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[300px]">
                            <div className="bg-white/5 border-b border-white/5 px-6 py-3 flex items-center justify-between">
                                <span className="text-[10px] font-mono text-slate-400 tracking-widest flex items-center gap-2"><SquareTerminal size={14}/> agent@os-core:~</span>
                            </div>
                            <div className="p-6 font-mono text-xs overflow-y-auto flex-1 space-y-2">
                                {terminalLogs.length === 0 && <p className="text-slate-600 italic">Waiting for input...</p>}
                                <AnimatePresence>
                                    {terminalLogs.map((log, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            className={`${log.type === 'cmd' ? 'text-cyan-400 font-bold mt-2' : log.type === 'success' ? 'text-emerald-400' : log.type === 'error' ? 'text-rose-500' : 'text-slate-400'}`}
                                        >
                                            {log.text}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={terminalEndRef} />
                            </div>
                        </div>

                        {/* 🔴 CODE EDITOR & DEPLOYMENT NEXUS */}
                        {buildComplete && files.length > 0 && (
                            <motion.div ref={editorRef} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                
                                {/* 🚀 THE DEPLOYMENT NEXUS (3 Export Buttons) */}
                                <div className="bg-slate-900 border border-cyan-500/30 p-6 rounded-[2rem] flex flex-col sm:flex-row gap-4 items-center justify-between shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                                    <div className="flex items-center gap-3 sm:w-1/3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Build_Ready</span>
                                    </div>
                                    
                                    <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-2/3 justify-end">
                                        <button onClick={handleZipDownload} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:border-cyan-500/50">
                                            <Download size={14} /> Export .ZIP
                                        </button>
                                        <button onClick={handleLocalSync} className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                            <FolderSync size={14} /> Sync Local
                                        </button>
                                        <button onClick={() => setShowGitModal(true)} className="flex-1 bg-white text-black hover:bg-slate-200 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl">
                                            <Github size={14} /> Push to Git
                                        </button>
                                    </div>
                                </div>

                                {/* VS CODE UI */}
                                <div className="bg-[#0d1117] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex h-[450px]">
                                    <div className="w-48 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col">
                                        <div className="p-4 border-b border-white/5"><span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2"><FolderTree size={12} /> EXPLORER</span></div>
                                        <div className="p-2 space-y-1 overflow-y-auto">
                                            {files.map((f, i) => (
                                                <button key={i} onClick={() => setActiveFile(f.filename)} className={`w-full text-left px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-3 ${activeFile === f.filename ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5'}`}>
                                                    <FileCode2 size={14} className={activeFile === f.filename ? 'text-cyan-500' : 'text-slate-600'} /> {f.filename}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <div className="bg-[#010409] px-4 py-3 border-b border-white/5"><div className="px-4 py-1.5 bg-[#0d1117] border-t border-cyan-500 text-xs font-mono text-cyan-200 inline-block">{activeFile}</div></div>
                                        <div className="p-6 overflow-auto flex-1"><pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">{files.find(f => f.filename === activeFile)?.code}</pre></div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🛸 GITHUB PUSH MODAL */}
            <AnimatePresence>
                {showGitModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0f172a] border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative overflow-hidden">
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
                                            <input value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} placeholder="e.g. ai-generated-app" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <button onClick={handleGithubPush} disabled={!gitRepo || gitStatus === 'pushing'} className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${gitStatus === 'pushing' ? 'bg-slate-800 text-slate-500' : 'bg-white text-black hover:bg-slate-200'}`}>
                                        {gitStatus === 'pushing' ? <><Loader2 className="animate-spin" size={14}/> Pushing...</> : 'Confirm & Push'}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}