'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RefreshCw, Star, MessageSquare, Bot, Cpu } from 'lucide-react';

export default function InterviewMode() {
    const [isStarted, setIsStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [userTranscript, setUserTranscript] = useState("");
    const [aiFeedback, setAiFeedback] = useState<{ score: number, review: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. AI Speaks the Question
    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Professional speed
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    // 2. Setup Speech Recognition (Browser Inbuilt)
    let recognition: any = null;
    if (typeof window !== 'undefined') {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
        }
    }

    // 3. Start Interview / Get New Question
    const startInterview = async () => {
        setIsProcessing(true);
        setAiFeedback(null);
        setUserTranscript("");
        
        const puter = (window as any).puter;
        // AI selects a random tough technical question
        const prompt = "Act as a Senior Technical Interviewer. Ask one tough technical question for a Full Stack Developer role. Only output the question text.";
        const question = await puter.ai.chat(prompt);
        
        setCurrentQuestion(question.toString());
        setIsStarted(true);
        setIsProcessing(false);
        speak(question.toString());
    };

    // 4. Capture User Voice
    const startListening = () => {
        if (!recognition) return alert("Speech recognition not supported in this browser.");
        
        setIsListening(true);
        recognition.start();

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserTranscript(transcript);
            evaluateAnswer(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
    };

    // 5. AI Evaluation Logic
    const evaluateAnswer = async (answer: string) => {
        setIsProcessing(true);
        const puter = (window as any).puter;

        const evalPrompt = `
            Question: "${currentQuestion}"
            User Answer: "${answer}"
            Rate the answer from 0 to 100 based on technical accuracy. 
            Output format strictly: Score: [number] | Feedback: [short 1 sentence advice]
        `;

        const response = await puter.ai.chat(evalPrompt);
        const resText = response.toString();

        // Parsing logic
        const scoreMatch = resText.match(/Score:\s*(\d+)/i);
        const feedbackMatch = resText.match(/Feedback:\s*(.*)/i);

        setAiFeedback({
            score: scoreMatch ? parseInt(scoreMatch[1]) : 70,
            review: feedbackMatch ? feedbackMatch[1] : "Good attempt, be more specific."
        });
        setIsProcessing(false);
        speak(`You scored ${scoreMatch ? scoreMatch[1] : 70} percent. ${feedbackMatch ? feedbackMatch[1] : ""}`);
    };

    return (
        <div className="min-h-screen bg-[#000] text-white p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl w-full bg-[#050505] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative z-10">
                <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                        <Bot className="text-indigo-400 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">AI Neural Interviewer</h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Active System: GPT-4o Protocol</p>
                    </div>
                </div>

                {!isStarted ? (
                    <div className="text-center py-10">
                        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Test your technical depth with our voice-activated AI. Get instant scoring and feedback based on industry standards.</p>
                        <motion.button 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={startInterview}
                            className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            Initiate Interview
                        </motion.button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Question Box */}
                        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                            <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-2 block">AI Question</span>
                            <p className="text-lg font-medium text-zinc-200">{currentQuestion || "Generating technical challenge..."}</p>
                        </div>

                        {/* Visualizer (Animated while processing/listening) */}
                        <div className="h-12 flex items-center justify-center gap-1">
                            {isListening || isProcessing ? (
                                [1,2,3,4,5].map(i => (
                                    <motion.div 
                                        key={i}
                                        animate={{ height: [10, 40, 10] }} 
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                        className="w-1.5 bg-indigo-500 rounded-full"
                                    />
                                ))
                            ) : (
                                <div className="w-full h-[1px] bg-white/10" />
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-center gap-4">
                            <motion.button 
                                whileTap={{ scale: 0.9 }}
                                onClick={startListening}
                                disabled={isListening || isProcessing}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)]'}`}
                            >
                                {isListening ? <Square className="fill-white" /> : <Mic className="w-8 h-8" />}
                            </motion.button>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{isListening ? "Listening to response..." : "Click to Speak Answer"}</span>
                        </div>

                        {/* Result Display */}
                        <AnimatePresence>
                            {aiFeedback && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Neural Assessment</span>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 rounded-lg">
                                            <Star className="w-3 h-3 text-indigo-400 fill-current" />
                                            <span className="text-sm font-black text-white">{aiFeedback.score}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-300 italic">"{aiFeedback.review}"</p>
                                    <button onClick={startInterview} className="mt-4 flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                                        <RefreshCw size={12} /> Next Question
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}