'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, User, Plus, Menu, X, Trash2, Cpu, 
    ChevronLeft, Sparkles, Edit3, Activity, Terminal, Zap
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
        const savedSessions = localStorage.getItem('neural_sync_v5');
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
            localStorage.setItem('neural_sync_v5', JSON.stringify(sessions));
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
            const errorMsg: Message = { role: 'bot' as const, text: 'Neural Link Interrupted.' };
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
            title: 'Neural_Log_' + Math.floor(Math.random() * 1000),
            messages: [{ role: 'bot' as const, text: 'Uplink established. Ready for command.' }]
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
        <div className="flex h-screen bg-[#020202] text-zinc-300 font-sans overflow-hidden">
            {/* Puter script with App ID included */}
            <script src="https://js.puter.com/v2/" data-app-id="app-c47a6adf-c207-4978-a180-038223102817" async></script>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.aside 
                initial={false}
                animate={{ 
                    x: isSidebarOpen ? 0 : -320,
                    width: isSidebarOpen ? (window.innerWidth < 768 ? '280px' : '320px') : '0px'
                }}
                className="fixed md:relative bg-[#050505] border-r border-white/5 flex flex-col shrink-0 h-full z-[70] shadow-2xl overflow-hidden"
            >
                <div className="p-4 flex-1 flex flex-col">
                    <button 
                        onClick={createNewChat}
                        className="w-full flex items-center justify-center gap-2 p-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        <Plus size={16} /> New_Uplink
                    </button>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {sessions.map((session) => (
                            <div 
                                key={session.id} 
                                onClick={() => {
                                    setActiveSessionId(session.id);
                                    if(window.innerWidth < 768) setIsSidebarOpen(false);
                                }}
                                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${activeSessionId === session.id ? 'bg-white/10 border-white/10' : 'border-transparent hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeSessionId === session.id ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-zinc-800'}`} />
                                    {editingId === session.id ? (
                                        <form onSubmit={saveRename} className="w-full">
                                            <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveRename} className="bg-transparent text-xs text-white outline-none w-full font-mono" />
                                        </form>
                                    ) : (
                                        <span className="text-[11px] font-medium truncate text-zinc-400 group-hover:text-zinc-100">{session.title}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                    <Edit3 size={14} className="hover:text-blue-400" onClick={(e) => startRename(session.id, session.title, e)} />
                                    <Trash2 size={14} className="hover:text-red-500" onClick={(e) => deleteSession(session.id, e)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.aside>

            {/* Main Interface */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                <header className="h-16 md:h-20 flex items-center px-4 md:px-10 justify-between border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg border border-white/10 text-zinc-400">
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white truncate max-w-[120px] md:max-w-none">
                                {currentSession?.title}
                            </span>
                            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">OS_SYNC_ACTIVE</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity size={16} className="text-blue-500 animate-pulse hidden sm:block" />
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <Cpu size={16} className="text-white" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-4 md:px-10 py-10">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {currentSession?.messages.map((m, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 md:gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'justify-start'}`}
                            >
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border ${m.role === 'bot' ? 'bg-blue-600/10 border-blue-500/20 text-blue-500' : 'bg-zinc-900 border-white/10 text-zinc-500'}`}>
                                    {m.role === 'bot' ? <Sparkles size={18} /> : <User size={18} />}
                                </div>
                                <div className={`flex flex-col max-w-[85%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 md:p-6 rounded-2xl md:rounded-3xl text-sm leading-relaxed ${m.role === 'bot' ? 'bg-white/[0.03] border border-white/5 text-zinc-200' : 'bg-white text-black font-semibold'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {loading && <div className="text-[10px] text-blue-500 animate-pulse tracking-widest ml-16 uppercase">Neural_Processing...</div>}
                        <div ref={scrollRef} className="h-20" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-10 bg-gradient-to-t from-black to-transparent">
                    <div className="max-w-3xl mx-auto flex gap-2 items-center bg-white/[0.03] border border-white/10 rounded-2xl p-2 focus-within:border-blue-500/50 transition-all">
                        <textarea 
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChat())}
                            placeholder="Command here..."
                            className="flex-1 bg-transparent p-3 text-sm text-white outline-none resize-none font-mono"
                        />
                        <button 
                            onClick={handleChat}
                            disabled={loading || !input.trim()}
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white text-black rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-20"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}