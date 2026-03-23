'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
    Send, User, Plus, Menu, X, Trash2, Cpu, 
    ChevronLeft, Sparkles, Edit3, Activity, Zap, Orbit, ArrowRight
} from 'lucide-react';
import Header from '../Home/header';
import Footer from '../Home/Footer';

// --- Types ---
interface Message {
    role: 'bot' | 'user';
    text: string;
}

interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
}

export default function NeuralSyncOS() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string>('');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const springConfig = { type: "spring" as const, stiffness: 350, damping: 30 };
    const bubbleSpring = { type: "spring" as const, stiffness: 400, damping: 25 };

    // Auto-close sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const savedSessions = localStorage.getItem('neural_sync_v6');
        if (savedSessions) {
            const parsed = JSON.parse(savedSessions);
            setSessions(parsed);
            if (parsed.length > 0) setActiveSessionId(parsed[0].id);
        } else {
            createNewChat();
        }
    }, []);

    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('neural_sync_v6', JSON.stringify(sessions));
        }
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [sessions]);

    const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

    const handleChat = async () => {
        if (!input.trim() || loading || !activeSessionId) return;
        
        const puter = (window as any).puter;
        const userMsg = input;
        setInput('');

        const newUserMsg: Message = { role: 'user' as const, text: userMsg };
        setSessions(prev => prev.map(s => 
            s.id === activeSessionId ? { ...s, messages: [...s.messages, newUserMsg] } : s
        ));
        setLoading(true);

        try {
            const response = await puter.ai.chat(userMsg);
            const botMsg: Message = { role: 'bot' as const, text: response.toString() };
            setSessions(prev => prev.map(s => 
                s.id === activeSessionId ? { ...s, messages: [...s.messages, botMsg] } : s
            ));
        } catch (error) {
            const errorMsg: Message = { role: 'bot' as const, text: 'Network Anomaly Detected. Uplink Interrupted.' };
            setSessions(prev => prev.map(s => 
                s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMsg] } : s
            ));
        }
        setLoading(false);
    };

    const createNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: 'Neural_Log_' + Math.floor(Math.random() * 10000),
            messages: [{ role: 'bot' as const, text: 'Uplink established. Awaiting your command parameter.' }]
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newId);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const deleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const filtered = sessions.filter(s => s.id !== id);
        setSessions(filtered);
        if (id === activeSessionId && filtered.length > 0) setActiveSessionId(filtered[0].id);
        else if (filtered.length === 0) createNewChat();
    };

    const saveRename = (e: React.FormEvent) => {
        e.preventDefault();
        setSessions(sessions.map(s => s.id === editingId ? { ...s, title: editValue } : s));
        setEditingId(null);
    };

    const startRename = (id: string, title: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(id);
        setEditValue(title);
    };

    return (
        <div className="flex h-[100dvh] bg-[#000000] text-zinc-100 font-sans overflow-hidden selection:bg-cyan-500/30 relative">
            <script src="https://js.puter.com/v2/" data-app-id="app-c47a6adf-c207-4978-a180-038223102817" async></script>

            {/* 🌌 AMBIENT BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] animate-grid-flow" />
                <motion.div 
                  animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-600/20 blur-[150px] rounded-full" 
                />
            </div>

            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {isSidebarOpen && window.innerWidth < 768 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-md"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* --- SIDEBAR --- */}
            <motion.aside 
                initial={false}
                animate={{ 
                    x: isSidebarOpen ? 0 : (window.innerWidth < 768 ? -320 : -320),
                    width: isSidebarOpen ? (window.innerWidth < 768 ? '280px' : '320px') : '0px',
                    opacity: isSidebarOpen ? 1 : 0
                }}
                transition={springConfig}
                className="fixed md:relative bg-[#050505] border-r border-white/[0.04] flex flex-col shrink-0 h-full z-[70] shadow-[10px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                <div className="p-6 flex-1 flex flex-col pt-8">
                    
                    <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={createNewChat}
                        className="w-full relative group overflow-hidden px-4 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-white mb-8 border border-white/[0.05]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-20 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-[1px] bg-[#0A0A0A] rounded-2xl transition-colors duration-300 group-hover:bg-transparent" />
                        <div className="relative flex items-center justify-center gap-2 z-10 group-hover:text-cyan-50 transition-colors">
                            <Plus className="w-4 h-4" /> New_Uplink
                        </div>
                    </motion.button>

                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-4 ml-2">Session_Logs</div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {sessions.map((session) => {
                                const isActive = activeSessionId === session.id;
                                return (
                                    <motion.div 
                                        layout initial={{ opacity: 0, x: -20, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={springConfig}
                                        key={session.id} 
                                        onClick={() => {
                                            setActiveSessionId(session.id);
                                            if(window.innerWidth < 768) setIsSidebarOpen(false);
                                        }}
                                        className={`group relative flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${isActive ? 'bg-cyan-500/10 border-cyan-500/20' : 'border-transparent hover:bg-white/[0.02]'}`}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0 z-10">
                                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500 ${isActive ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'bg-zinc-700 group-hover:bg-zinc-500'}`} />
                                            {editingId === session.id ? (
                                                <form onSubmit={saveRename} className="w-full">
                                                    <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveRename} className="bg-black/50 border border-cyan-500/30 rounded p-1.5 text-[11px] text-cyan-100 outline-none w-full font-mono shadow-inner" />
                                                </form>
                                            ) : (
                                                <span className={`text-[11px] font-bold tracking-wider truncate transition-all duration-300 ${isActive ? 'text-cyan-100' : 'text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-1'}`}>{session.title}</span>
                                            )}
                                        </div>
                                        
                                        {/* 🔥 FIX: Changed opacity classes for mobile visibility */}
                                        <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2 z-10">
                                            <button onClick={(e) => startRename(session.id, session.title, e)} className="p-1.5 text-zinc-500 hover:text-cyan-400 hover:bg-white/[0.05] rounded-md transition-colors">
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={(e) => deleteSession(session.id, e)} className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.aside>

            {/* --- MAIN INTERFACE --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
                
                {/* Header */}
                <header className="h-16 md:h-20 flex items-center px-4 md:px-8 justify-between border-b border-white/[0.04] bg-[#050505]/80 backdrop-blur-xl z-50">
                    <div className="flex items-center gap-4">
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-white/[0.02] rounded-xl border border-white/[0.05] text-zinc-400 hover:text-cyan-400 transition-colors shadow-sm">
                            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
                        </motion.button>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-100 truncate max-w-[150px] md:max-w-none">
                                {currentSession?.title || 'System_Terminal'}
                            </span>
                            <span className="text-[8px] font-bold text-cyan-600 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" /> Uplink_Active
                            </span>
                        </div>
                    </div>
                    
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center border border-white/[0.05] shadow-inner">
                        <Cpu size={16} className="text-cyan-400" />
                    </motion.div>
                </header>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-smooth custom-scrollbar relative">
                    <div className="max-w-3xl mx-auto space-y-8 pb-32">
                        <LayoutGroup>
                            <AnimatePresence initial={false}>
                                {currentSession?.messages.map((m, i) => (
                                    <motion.div 
                                        layout
                                        key={i}
                                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ ...bubbleSpring, delay: i * 0.02 }}
                                        className={`flex gap-4 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'justify-start'}`}
                                    >
                                        {/* Avatar Icon */}
                                        <div className="relative shrink-0 mt-2">
                                            {m.role === 'bot' && <div className="absolute inset-0 bg-cyan-500/20 blur-[10px] rounded-full animate-pulse" />}
                                            <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border shadow-xl ${m.role === 'bot' ? 'bg-[#0A0A0A] border-cyan-500/30 text-cyan-400' : 'bg-gradient-to-tr from-zinc-100 to-zinc-300 text-black border-transparent'}`}>
                                                {m.role === 'bot' ? <Orbit size={20} className="animate-spin-slow" /> : <User size={20} />}
                                            </div>
                                        </div>
                                        
                                        {/* Message Bubble */}
                                        <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`p-5 rounded-3xl text-[15px] leading-relaxed whitespace-pre-wrap font-medium shadow-2xl transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                                                m.role === 'bot' 
                                                ? 'bg-[#0A0A0A] border border-white/[0.04] text-zinc-300 rounded-tl-sm hover:border-cyan-500/20' 
                                                : 'bg-gradient-to-br from-zinc-100 to-zinc-300 text-black rounded-tr-sm'
                                            }`}>
                                                {m.text}
                                            </div>
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-2 mx-2">
                                                {m.role === 'bot' ? 'AI_Response' : 'User_Command'}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </LayoutGroup>
                        
                        {/* Loading State */}
                        <AnimatePresence>
                            {loading && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-3 ml-16 mt-4">
                                    <div className="flex gap-1">
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                    </div>
                                    <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.3em]">Processing...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={scrollRef} className="h-4" />
                    </div>
                </div>

                {/* Input Console */}
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 bg-gradient-to-t from-[#000000] via-[#000000]/90 to-transparent pb-8 z-20">
                    <div className="max-w-3xl mx-auto relative group">
                        
                        {/* Animated Glowing Border for Input */}
                        <div className={`absolute -inset-[1px] rounded-3xl opacity-50 blur-[2px] transition-all duration-500 ${loading ? 'bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(6,182,212,1)_360deg)] animate-spin-slow' : 'bg-white/[0.05] group-focus-within:bg-cyan-500/30 group-focus-within:blur-md'}`} />
                        
                        <div className="relative flex gap-3 items-end bg-[#0A0A0A] border border-white/[0.05] rounded-3xl p-2.5 shadow-2xl">
                            <textarea 
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChat(); }
                                }}
                                placeholder="Execute command parameter..."
                                className="flex-1 bg-transparent px-4 py-3.5 min-h-[48px] max-h-32 text-sm text-zinc-100 outline-none resize-none font-medium placeholder:text-zinc-600 custom-scrollbar"
                            />
                            <motion.button 
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                                onClick={handleChat}
                                disabled={loading || !input.trim()}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl shrink-0 transition-all duration-300 ${
                                    !input.trim() || loading ? 'bg-white/[0.02] text-zinc-600 border border-white/[0.05]' : 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400'
                                }`}
                            >
                                <Send size={18} className={input.trim() && !loading ? 'translate-x-0.5 -translate-y-0.5 transition-transform' : ''} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
                @keyframes grid-flow { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }
                .animate-grid-flow { animation: grid-flow 3s linear infinite; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
            `}</style>
        </div>
    );
}