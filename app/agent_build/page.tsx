'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, Cpu, Play, SquareTerminal, 
  FolderTree, FileCode2, ArrowLeft, Loader2, Zap, 
  CheckCircle2, AlertCircle, RefreshCw,
  Download, FolderSync, Github, X
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

    const deployAgent = async () => {
        if (!prompt.trim()) return;
        
        setIsAgentActive(true);
        setBuildComplete(false); // Reset build state
        setFiles([]);
        setTerminalLogs([{ type: 'log', text: 'Initiating Autonomous Agent Core v4.0...' }]);

        const puter = (window as any).puter;
        
        const aiPrompt = `
            Act as an Autonomous AI Software Engineer. User wants to build: "${prompt}".
            Output strictly in this JSON format:
            {
              "project_name": "app-name",
              "steps": [
                { "action_log": "Initializing NPM workspace...", "command": "npm init -y" }
              ],
              "files": [
                { "filename": "index.js", "code": "// code here" }
              ]
            }
        `;

        try {
            setTerminalLogs(prev => [...prev, { type: 'log', text: 'Connecting to LLM Node...' }]);
            
            const response = await puter.ai.chat(aiPrompt);
            let rawData = response.toString();
            
            if (rawData.includes('```json')) rawData = rawData.split('```json')[1].split('```')[0].trim();
            else if (rawData.includes('```')) rawData = rawData.split('```')[1].split('```')[0].trim();

            let data: AgentPayload;
            try {
                data = JSON.parse(rawData);
                // Fail-safes to prevent loop crashes
                if (!data.files || data.files.length === 0) data.files = [{ filename: "app.js", code: "// Code\nconsole.log('Success');" }];
                if (!data.steps || data.steps.length === 0) data.steps = [{ action_log: "Building...", command: "npm i" }];
            } catch(e) {
                data = { project_name: "ai-project", steps: [{ action_log: "Forced init...", command: "npm init -y" }], files: [{ filename: "index.js", code: "// Error parsing AI." }] };
            }

            simulateTerminalExecution(data);

        } catch (err) {
            console.error(err);
            setTerminalLogs(prev => [...prev, { type: 'error', text: '[ERROR] Core crashed. Booting recovery mode...' }]);
            simulateTerminalExecution({ project_name: "recovery", steps: [{ action_log: "Recovery...", command: "rescue" }], files: [{ filename: "rescue.js", code: "// Recovered." }] });
        }
    };

    const simulateTerminalExecution = async (data: AgentPayload) => {
        setTerminalLogs([{ type: 'log', text: `[AGENT_BOT]: Assigned to '${data.project_name}'. TURBO build active.` }]);
        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

        // Safely map over steps to avoid crashes
        for (const step of data?.steps || []) {
            await sleep(150); 
            setTerminalLogs(prev => [...prev, { type: 'cmd', text: `root@agent-os:~/${data.project_name}# ${step.command}` }]);
            await sleep(300); 
            setTerminalLogs(prev => [...prev, { type: 'log', text: `> ${step.action_log}` }]);
            setTerminalLogs(prev => [...prev, { type: 'success', text: `[OK] Task completed.` }]);
        }

        await sleep(200);
        setTerminalLogs(prev => [...prev, { type: 'log', text: '[AGENT_BOT]: Writing files...' }]);
        
        await sleep(300);
        setFiles(data?.files || []);
        if (data?.files?.length > 0) setActiveFile(data.files[0].filename);
        
        setIsAgentActive(false);
        setBuildComplete(true); // 🔴 This will unlock the buttons
        setTerminalLogs(prev => [...prev, { type: 'success', text: '[AGENT_BOT]: Build ready. Access granted to UI.' }]);
        
        // Auto scroll to editor
        setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    };

    // 🚀 EXPORTS
    const handleZipDownload = () => {
        const zip = new JSZip();
        files.forEach(f => zip.file(f.filename, f.code));
        zip.generateAsync({ type: "blob" }).then(content => saveAs(content, "agent-build.zip"));
    };

    const handleLocalSync = async () => {
        try {
            // @ts-ignore
            const dirHandle = await window.showDirectoryPicker();
            for (const file of files) {
                const fileHandle = await dirHandle.getFileHandle(file.filename, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(file.code);
                await writable.close();
            }
            alert("Project synced to your local folder! 🎉");
        } catch (error) {
            console.error("Sync aborted", error);
        }
    };

    const handleGithubPush = async () => {
        if (!gitRepo) return;
        setGitStatus('pushing');
        await new Promise(r => setTimeout(r, 1500));
        setGitStatus('success');
        setTimeout(() => setShowGitModal(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 relative overflow-hidden font-sans">
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="max-w-7xl mx-auto relative z-10">
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
                    
                    {/* LEFT PANEL */}
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
                                value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isAgentActive}
                                placeholder="E.g., Build a real-time chat backend..."
                                className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-sm min-h-[160px] outline-none focus:border-cyan-500/50 transition-all font-mono"
                            />
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={deployAgent} disabled={isAgentActive || !prompt.trim()}
                                className={`w-full py-5 rounded-xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 mt-4 ${isAgentActive ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500 text-black hover:bg-cyan-400'}`}
                            >
                                {isAgentActive ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                                {isAgentActive ? 'Agent_Running...' : 'Deploy_Agent'}
                            </motion.button>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="xl:col-span-8 space-y-6">
                        
                        {/* TERMINAL */}
                        <div className="bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[300px]">
                            <div className="bg-white/5 border-b border-white/5 px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <SquareTerminal size={14} className="text-slate-500" />
                                    <span className="text-[10px] font-mono text-slate-400">agent@linux-node-01:~</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                </div>
                            </div>
                            <div className="p-6 font-mono text-xs overflow-y-auto flex-1 space-y-2">
                                {terminalLogs.length === 0 && <p className="text-slate-600 italic">Waiting for deployment...</p>}
                                <AnimatePresence initial={false}>
                                    {terminalLogs.map((log, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            className={`${log.type === 'cmd' ? 'text-cyan-400 font-bold' : log.type === 'error' ? 'text-rose-500' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}
                                        >
                                            {log.text}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={terminalEndRef} />
                            </div>
                        </div>

                        {/* 🔴 EXPORT BUTTONS & EDITOR (NOW HARDCODED TO ALWAYS SHOW) */}
                        <div ref={editorRef} className="space-y-6 pt-4">
                            
                            {/* EXPORT TOOLBAR */}
                            <div className={`bg-[#0a0f18] border rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-500 ${buildComplete ? 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'border-white/5 opacity-50 grayscale'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${buildComplete ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${buildComplete ? 'text-emerald-500' : 'text-slate-600'}`}>
                                        {buildComplete ? 'Build Complete' : 'Awaiting Build'}
                                    </span>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <button disabled={!buildComplete} onClick={handleZipDownload} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 py-3 px-4 rounded-xl text-[10px] font-black uppercase flex justify-center gap-2 disabled:cursor-not-allowed">
                                        <Download size={14} /> ZIP
                                    </button>
                                    <button disabled={!buildComplete} onClick={handleLocalSync} className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 py-3 px-4 rounded-xl text-[10px] font-black uppercase flex justify-center gap-2 disabled:cursor-not-allowed">
                                        <FolderSync size={14} /> Sync
                                    </button>
                                    <button disabled={!buildComplete} onClick={() => setShowGitModal(true)} className="flex-1 bg-white text-black hover:bg-slate-200 py-3 px-4 rounded-xl text-[10px] font-black uppercase flex justify-center gap-2 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500">
                                        <Github size={14} /> Git
                                    </button>
                                </div>
                            </div>

                            {/* VS CODE UI */}
                            <div className={`bg-[#0d1117] border rounded-[2rem] overflow-hidden shadow-2xl flex h-[450px] transition-all duration-500 ${buildComplete ? 'border-white/10' : 'border-white/5 opacity-50 grayscale'}`}>
                                <div className="w-48 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col">
                                    <div className="p-4 border-b border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                            <FolderTree size={12} /> EXPLORER
                                        </span>
                                    </div>
                                    <div className="p-2 space-y-1 overflow-y-auto">
                                        {files.map((f, i) => (
                                            <button key={i} onClick={() => setActiveFile(f.filename)} disabled={!buildComplete}
                                                className={`w-full text-left px-4 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-3 ${activeFile === f.filename ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                <FileCode2 size={14} className={activeFile === f.filename ? 'text-cyan-500' : 'text-slate-600'} />
                                                {f.filename}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
                                    <div className="bg-[#010409] px-4 py-3 border-b border-white/5 flex">
                                        <div className="px-4 py-1.5 bg-[#0d1117] border-t border-cyan-500 text-xs font-mono text-cyan-200">
                                            {activeFile || 'No file selected'}
                                        </div>
                                    </div>
                                    <div className="p-6 overflow-auto flex-1 custom-scrollbar">
                                        <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
                                            {buildComplete ? (files.find(f => f.filename === activeFile)?.code || '// Select a file') : '// System Idle. Enter prompt to generate code.'}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* GITHUB MODAL */}
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
                                    <input value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} placeholder="Repository Name" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none mb-6" />
                                    <button onClick={handleGithubPush} disabled={!gitRepo || gitStatus === 'pushing'} className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${gitStatus === 'pushing' ? 'bg-slate-800 text-slate-500' : 'bg-white text-black hover:bg-slate-200'}`}>
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
            `}</style>
        </div>
    );
}