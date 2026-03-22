'use client';
                import { useState, useRef, useEffect, MouseEvent } from 'react';
                import { motion, AnimatePresence } from 'framer-motion';
                import { 
                    Send, Bot, User, Plus, MessageSquare, 
                    Menu, X, Trash2, Cpu, 
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
                        const updatedSessions = sessions.map(s => 
                            s.id === activeSessionId ? { ...s, messages: [...s.messages, newUserMsg] } : s
                        );
                        setSessions(updatedSessions);
                        setLoading(true);

                        try {
                            const response = await puter.ai.chat(userMsg);
                            const botMsg: Message = { role: 'bot' as const, text: response.toString() };
                            setSessions(prev => prev.map(s => 
                                s.id === activeSessionId ? { ...s, messages: [...s.messages, botMsg] } : s
                            ));
                        } catch (error) {
                            const errorMsg: Message = { role: 'bot' as const, text: 'Neural Link Interrupted. Protocol Timeout.' };
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
                            messages: [{ role: 'bot' as const, text: 'Uplink established. Neural core is ready for command.' }]
                        };
                        setSessions(prev => [newSession, ...prev]);
                        setActiveSessionId(newId);
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

                    const startRename = (id: string, title: string, e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        setEditingId(id);
                        setEditValue(title);
                    };

  return (
    <>
    
    <div className="flex h-screen bg-[#020202] text-zinc-300 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* --- BACKGROUND ANIMATED ORBS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"
        />
      </div>

      {/* --- SIDEBAR --- */}
      <motion.aside 
        animate={{ width: isSidebarOpen ? '320px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-[#050505]/80 backdrop-blur-xl border-r border-white/5 flex flex-col relative shrink-0 overflow-hidden z-50 shadow-2xl"
      >
        <div className="p-6">
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.98 }}
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-white to-zinc-200 text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all mb-8 shadow-xl"
          >
            <Plus className="w-4 h-4" /> Initialize_New
          </motion.button>

          <div className="space-y-2 overflow-y-auto max-h-[70vh] scrollbar-hide">
            <p className="px-3 text-[9px] font-black uppercase text-zinc-600 tracking-[0.4em] mb-6 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Core_History
            </p>
            <AnimatePresence mode="popLayout">
              {sessions.map((session) => (
                <motion.div 
                  key={session.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group relative flex items-center justify-between px-4 py-4 rounded-2xl cursor-pointer transition-all border ${activeSessionId === session.id ? 'bg-white/10 border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'border-transparent hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-4 overflow-hidden flex-1">
                    <div className={`w-2 h-2 rounded-full ${activeSessionId === session.id ? 'bg-blue-500 animate-pulse' : 'bg-zinc-800'}`} />
                    {editingId === session.id ? (
                      <form onSubmit={saveRename} className="flex-1">
                        <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={saveRename} className="bg-transparent text-xs text-white outline-none border-b border-blue-500 w-full font-mono" />
                      </form>
                    ) : (
                      <span className="text-[11px] font-bold text-zinc-400 truncate group-hover:text-zinc-100 font-mono tracking-tight">{session.title}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => startRename(session.id, session.title, e)} className="p-1 hover:text-blue-400 transition-colors"><Edit3 className="w-3 h-3" /></button>
                    <button onClick={(e) => deleteSession(session.id, e)} className="p-1 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* --- MAIN INTERFACE --- */}
      <main className="flex-1 flex flex-col bg-transparent relative">
        <header className="h-20 flex items-center px-10 justify-between border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <motion.button 
              whileHover={{ rotate: 90 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-3 bg-white/5 rounded-2xl border border-white/5 text-zinc-400 hover:text-white transition-all"
            >
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                {currentSession?.title} <Zap className="w-3 h-3 text-blue-500" />
              </span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em] mt-1">Session_Token: {currentSession?.id.slice(-6)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
               <Activity className="w-3 h-3 text-blue-500 animate-spin-slow" />
               <span className="text-[9px] font-black uppercase text-blue-400 tracking-widest">Network_Optimized</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
               <Cpu className="w-5 h-5 text-white animate-pulse" />
            </div>
          </div>
        </header>

        {/* Messaging Zone */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto py-20 px-10 space-y-16">
            <AnimatePresence mode="popLayout">
              {currentSession?.messages.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className={`flex gap-10 ${m.role === 'user' ? 'flex-row-reverse' : 'justify-start'}`}
                >
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${m.role === 'bot' ? 'bg-blue-600/10 border-blue-500/30 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'bg-zinc-900 border-white/10 text-zinc-500'}`}
                  >
                    {m.role === 'bot' ? <Sparkles className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </motion.div>
                  <div className={`flex flex-col max-w-[75%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-8 py-6 rounded-[2.5rem] text-[16px] leading-[1.6] transition-all duration-500 shadow-xl ${
                      m.role === 'bot' 
                      ? 'bg-white/[0.03] border border-white/10 text-zinc-200 rounded-tl-none backdrop-blur-md' 
                      : 'bg-white text-black font-bold rounded-tr-none'
                    }`}>
                      {m.text}
                    </div>
                    <span className="mt-3 text-[8px] font-black uppercase text-zinc-700 tracking-[0.4em] px-4">
                      {m.role === 'bot' ? 'Core_Response' : 'User_Command'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-6 pl-24">
                <div className="flex gap-1">
                   {[0, 1, 2].map(d => (
                     <motion.div key={d} animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: d * 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                   ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500/50">Processing_Uplink</span>
              </motion.div>
            )}
            <div ref={scrollRef} className="h-32" />
          </div>
        </div>

        {/* Input HUD - Fixed Floating Style */}
        <div className="p-10 md:pb-20 bg-gradient-to-t from-[#020202] via-[#020202]/80 to-transparent backdrop-blur-sm">
          <div className="max-w-4xl mx-auto relative">
            
            {/* HUD Decoration */}
            <div className="absolute -top-12 left-8 right-8 flex justify-between items-center opacity-30">
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-4" />
               <div className="text-[8px] font-black text-blue-500 uppercase tracking-[1em]">Input_Terminal</div>
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-4" />
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-[3rem] p-3 pr-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-blue-500/50 focus-within:bg-white/[0.05] transition-all duration-700 backdrop-blur-2xl"
            >
               <textarea 
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChat())}
                placeholder="Initialize global command..."
                className="flex-1 bg-transparent p-5 text-sm text-white outline-none resize-none max-h-48 font-mono placeholder:text-zinc-800"
              />
              <motion.button 
                whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.9 }}
                onClick={handleChat}
                disabled={loading || !input.trim()}
                className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:bg-blue-600 hover:text-white disabled:bg-zinc-900 disabled:text-zinc-800 transition-all duration-500 shadow-2xl"
              >
                <Send className="w-7 h-7" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinity; }
        body { background: #020202; }
      `}</style>
    </div>
    </>
  );
}