'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, BookOpen, BrainCircuit, CheckCircle2, 
  ArrowRight, Award, Sparkles, Loader2, Play, ChevronRight,
  Download, Medal,
  Zap
} from 'lucide-react';
import Link from 'next/link';

interface Module {
  id: number;
  title: string;
  explanation: string;
  quick_fact: string;
  completed: boolean;
}

export default function ThinkhatchTutor() {
    const [topic, setTopic] = useState("");
    const [studentName, setStudentName] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [modules, setModules] = useState<Module[]>([]);
    const [activeModule, setActiveModule] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [showCertificate, setShowCertificate] = useState(false);

    // 🧠 AI LOGIC: Deep-Dive Curriculum Generator
    const generateSyllabus = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setModules([]);
        setProgress(0);
        setShowCertificate(false);

        const puter = (window as any).puter;
        
        // 🔴 MASTERSTROKE PROMPT: Forces AI to teach in detail with examples
        const aiPrompt = `
            Act as an Expert Master Professor for "Thinkhatch Academy". The user wants to learn: "${topic}".
            Create a 4-step beginner-to-advanced learning roadmap.
            
            For each step, you MUST provide:
            1. "title": The module name.
            2. "explanation": A HIGHLY DETAILED, in-depth explanation. Write at least 3 to 4 comprehensive paragraphs. Explain the core concepts deeply, provide real-world examples, and use simple analogies. Teach it like you are explaining to a curious student. Use '\\n\\n' to separate paragraphs. DO NOT GIVE SHORT 1-LINE ANSWERS.
            3. "quick_fact": A mind-blowing, lesser-known fun fact.
            
            OUTPUT STRICTLY IN THIS JSON FORMAT (No markdown, just raw JSON):
            {
              "modules": [
                {
                  "id": 1,
                  "title": "Module Name",
                  "explanation": "Paragraph 1...\\n\\nParagraph 2...\\n\\nParagraph 3...",
                  "quick_fact": "A fun fact.",
                  "completed": false
                }
              ]
            }
        `;

        try {
            const response = await puter.ai.chat(aiPrompt);
            let rawData = response.toString();
            if (rawData.includes('```json')) rawData = rawData.split('```json')[1].split('```')[0].trim();
            else if (rawData.includes('```')) rawData = rawData.split('```')[1].split('```')[0].trim();

            const data = JSON.parse(rawData);
            setModules(data.modules);
            setActiveModule(data.modules[0].id); // Open first module auto
        } catch (err) {
            console.error(err);
            alert("Neural connection failed. Please try again.");
        }
        setIsGenerating(false);
    };

    const markCompleted = (id: number) => {
        const updated = modules.map(m => m.id === id ? { ...m, completed: true } : m);
        setModules(updated);
        
        const completedCount = updated.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / updated.length) * 100);
        setProgress(newProgress);

        // Move to next module
        const nextModule = updated.find(m => !m.completed);
        if (nextModule) {
            setActiveModule(nextModule.id);
        } else {
            setActiveModule(null);
            // Wait a second then show certificate prompt
            setTimeout(() => setShowCertificate(true), 800);
        }
    };

    const handlePrintCertificate = () => {
        window.print(); // Simple trick to save/print the certificate
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-purple-500/30">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="max-w-6xl mx-auto relative z-10 print:max-w-none print:m-0 print:p-0">
                
                {/* 🛰️ HEADER (Hide on Print) */}
                <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6 print:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/50 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            <BrainCircuit className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-widest uppercase">Thinkhatch</h1>
                            <p className="text-[9px] text-purple-400 font-bold uppercase tracking-[0.3em]">Neural Tutor Engine</p>
                        </div>
                    </div>
                    {progress > 0 && (
                        <div className="flex items-center gap-4 bg-slate-900 border border-white/10 px-6 py-2 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Progress</span>
                            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }} animate={{ width: `${progress}%` }} 
                                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                                />
                            </div>
                            <span className="text-xs font-bold text-white">{progress}%</span>
                        </div>
                    )}
                </header>

                {!showCertificate ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 print:hidden">
                        
                        {/* 🎮 LEFT: INPUT & SYLLABUS TREE */}
                        <div className="lg:col-span-5 space-y-8">
                            {/* Input Box */}
                            <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
                                <h2 className="text-3xl font-black italic uppercase text-white mb-2 tracking-tighter">
                                    What do you<br/><span className="text-purple-500">want to learn?</span>
                                </h2>
                                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-6">AI will generate a custom syllabus</p>
                                
                                <input 
                                    value={topic} onChange={(e) => setTopic(e.target.value)} disabled={isGenerating || modules.length > 0}
                                    placeholder="e.g. Quantum Physics, React.js..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-purple-500 outline-none transition-all mb-4"
                                />
                                <button 
                                    onClick={generateSyllabus} disabled={isGenerating || !topic.trim() || modules.length > 0}
                                    className={`w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${
                                        isGenerating ? 'bg-purple-500/20 text-purple-400' : modules.length > 0 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-purple-500 text-black hover:bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                    }`}
                                >
                                    {isGenerating ? <Loader2 className="animate-spin" size={16}/> : modules.length > 0 ? <CheckCircle2 size={16}/> : <Play size={16} fill="currentColor"/>}
                                    {isGenerating ? 'Building Master Course...' : modules.length > 0 ? 'Curriculum Ready' : 'Start Learning'}
                                </button>
                            </div>

                            {/* SKILL TREE */}
                            {modules.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pl-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                                        <BookOpen size={14} className="text-purple-500"/> Learning Path
                                    </h3>
                                    <div className="space-y-0 relative border-l-2 border-white/5 ml-4">
                                        {modules.map((m, i) => (
                                            <div key={m.id} className="relative pl-8 pb-8 last:pb-0">
                                                {/* Node Dot */}
                                                <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-4 border-[#020617] flex items-center justify-center transition-colors ${
                                                    m.completed ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : activeModule === m.id ? 'bg-purple-500 animate-pulse shadow-[0_0_15px_#a855f7]' : 'bg-slate-700'
                                                }`} />
                                                
                                                <button 
                                                    onClick={() => setActiveModule(m.id)}
                                                    className={`text-left transition-all ${activeModule === m.id ? 'scale-105 origin-left' : 'opacity-70 hover:opacity-100'}`}
                                                >
                                                    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${m.completed ? 'text-emerald-500' : 'text-slate-500'}`}>
                                                        {m.completed ? 'Completed' : `Module 0${i+1}`}
                                                    </p>
                                                    <h4 className={`text-lg font-bold ${activeModule === m.id ? 'text-white' : 'text-slate-400'}`}>{m.title}</h4>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* 🖥️ RIGHT: INTERACTIVE TEACHING CONSOLE */}
                        <div className="lg:col-span-7">
                            {!modules.length ? (
                                <div className="h-full min-h-[500px] border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center p-10 bg-white/[0.02]">
                                    <GraduationCap size={80} strokeWidth={1} className="text-slate-700 mb-6" />
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Thinkhatch Academy</h3>
                                    <p className="text-slate-500 text-sm max-w-sm">Enter a topic on the left to generate your personalized AI learning path and earn your certificate.</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    {modules.map((m) => activeModule === m.id && (
                                        <motion.div 
                                            key={m.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                            className="bg-[#0a0f18] border border-purple-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(168,85,247,0.05)] relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
                                            
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-purple-500/20">
                                                <Sparkles size={12} /> Live Masterclass
                                            </div>

                                            <h2 className="text-4xl font-black text-white mb-6 leading-tight">{m.title}</h2>
                                            
                                            {/* 🔴 MAGIC HERE: whitespace-pre-wrap ensures paragraphs are rendered properly */}
                                            <div className="prose prose-invert prose-p:text-slate-300 prose-p:leading-relaxed mb-10 max-w-none">
                                                <p className="text-lg whitespace-pre-wrap leading-relaxed tracking-wide">{m.explanation}</p>
                                            </div>

                                            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl mb-12 flex items-start gap-4">
                                                <Zap size={24} className="text-amber-400 shrink-0 mt-1" />
                                                <div>
                                                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Did you know?</p>
                                                    <p className="text-sm text-slate-300 italic">"{m.quick_fact}"</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => markCompleted(m.id)}
                                                className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                                                    m.completed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-white text-black hover:bg-slate-200 hover:scale-[1.02]'
                                                }`}
                                            >
                                                {m.completed ? <CheckCircle2 size={18}/> : 'I Understood This'}
                                                {m.completed ? 'Module Completed' : 'Mark as Complete & Continue'}
                                                {!m.completed && <ChevronRight size={18} />}
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                ) : (
                    
                    /* 🎓 THE THINKHATCH CERTIFICATE */
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto print:max-w-full">
                        
                        {!studentName && (
                            <div className="bg-[#0f172a] border border-white/10 p-10 rounded-[2rem] text-center shadow-2xl print:hidden">
                                <Medal size={60} className="text-amber-400 mx-auto mb-6" />
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Course Completed!</h2>
                                <p className="text-slate-400 mb-8">Enter your full name to generate your official Thinkhatch Certificate.</p>
                                <input 
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter' && e.currentTarget.value) setStudentName(e.currentTarget.value);
                                    }}
                                    placeholder="Your Full Name..."
                                    className="w-full max-w-md mx-auto bg-black/50 border border-white/20 rounded-xl px-6 py-4 text-center text-xl text-white outline-none focus:border-purple-500 transition-all mb-4 block"
                                />
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Press Enter to generate</p>
                            </div>
                        )}

                        {studentName && (
                            <div className="space-y-6">
                                <div className="flex justify-end print:hidden">
                                    <button onClick={handlePrintCertificate} className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-colors">
                                        <Download size={14} /> Download / Print PDF
                                    </button>
                                </div>
                                
                                <div className="bg-[#050b14] relative p-1 md:p-4 rounded-sm print:p-0">
                                    <div className="border-[8px] border-double border-amber-500/40 p-10 md:p-20 relative bg-[#020617] overflow-hidden">
                                        
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
                                        <BrainCircuit size={400} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] pointer-events-none" />

                                        <div className="relative z-10 text-center flex flex-col items-center">
                                            
                                            <div className="flex items-center gap-3 mb-10">
                                                <BrainCircuit className="text-purple-500" size={32} />
                                                <h1 className="text-3xl font-black text-white tracking-[0.3em] uppercase">Thinkhatch</h1>
                                            </div>

                                            <p className="text-amber-500 font-black tracking-[0.5em] uppercase text-xs mb-10">Certificate of Completion</p>
                                            
                                            <p className="text-slate-400 italic mb-4">This is proudly presented to</p>
                                            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-8 tracking-tighter capitalize px-4 border-b border-white/10 pb-4 inline-block">
                                                {studentName}
                                            </h2>
                                            
                                            <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed mb-16">
                                                For successfully completing the AI-generated accelerated course on <strong className="text-white uppercase">{topic}</strong>. Demonstrating exceptional dedication to continuous learning via the Thinkhatch Neural Tutor.
                                            </p>

                                            <div className="flex justify-between items-end w-full max-w-3xl border-t border-white/10 pt-8 mt-10">
                                                <div className="text-center">
                                                    <div className="font-mono text-cyan-400 text-xl mb-1 signature-font">AI Core v5.0</div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest border-t border-white/10 pt-2">Lead Instructor (AI)</p>
                                                </div>
                                                
                                                <div className="flex flex-col items-center">
                                                    <Award size={60} strokeWidth={1} className="text-amber-400 mb-2" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-amber-500">Verified by Thinkhatch</span>
                                                </div>

                                                <div className="text-center">
                                                    <div className="font-mono text-white text-lg mb-1">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest border-t border-white/10 pt-2">Date of Issue</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                .signature-font { font-family: 'Dancing Script', cursive; }
                
                @media print {
                    body { background: white !important; -webkit-print-color-adjust: exact; }
                    .print\\:hidden { display: none !important; }
                    /* Make the certificate take full A4 page width */
                    @page { size: landscape; margin: 0; }
                }
            `}</style>
        </div>
    );
}