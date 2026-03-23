'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Zap, Shield, Target, Cpu, Search, Activity, LayoutGrid, BarChart3, AlertTriangle, CheckCircle2, FileText, Crosshair, TrendingUp } from 'lucide-react';
import Header from '../Home/header';
import Footer from '../Home/Footer';
import { analyzeATS } from '@/lib/atsEngine';

// --- ANIMATED CIRCULAR GRAPH COMPONENT ---
const CircularProgress = ({ value, title, subtitle, colorClass, shadowClass, gradientId, fromColor, toColor }: any) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative group">
      <div className={`relative w-36 h-36 flex items-center justify-center rounded-full ${shadowClass} transition-all duration-500 group-hover:scale-105`}>
        <svg className="transform -rotate-90 w-32 h-32 absolute">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/[0.05]" />
          <motion.circle
            cx="64" cy="64" r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className={`text-4xl font-black italic tracking-tighter ${colorClass}`}>
            {value || 0}%
          </motion.span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h4 className="text-white font-bold text-sm tracking-widest uppercase">{title}</h4>
        <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default function ATSCheckerPage() {
  const [userData, setUserData] = useState<any>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const wordCount = jobDesc.trim().split(/\s+/).filter(w => w.length > 0).length;

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(db, "portfolios", user.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, []);

  const result = analyzeATS(userData, jobDesc.trim()); 

  const startScan = () => {
    if (!jobDesc || wordCount < 10) return alert("Please enter a valid Job Description (min 10 words) to run Match Index scan!");
    
    setIsScanning(true);
    setShowResults(false);
    setScanStep(0);

    const steps = [
      "Tokenizing Job Description...",
      "Extracting Keyword Vectors...",
      "Normalizing Semantic Nodes...",
      "Comparing Against User Profile...",
      "Calculating Final Match Index..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanStep(currentStep);
      }
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      setIsScanning(false);
      setShowResults(true);
    }, 3200); 
  };

  const scanStepsText = [
    "Tokenizing Job Description...",
    "Extracting Keyword Vectors...",
    "Normalizing Semantic Nodes...",
    "Comparing Against User Profile...",
    "Calculating Final Match Index..."
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#030014] text-white selection:bg-fuchsia-600/30 overflow-x-hidden relative font-sans">
      
      <div className="fixed top-0 left-0 w-full z-[100] bg-[#030014]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <Header />
      </div>
      
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000 delay-500" />
      
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <motion.div animate={{ y: [-500, 1000] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-full h-[2px] bg-fuchsia-500 shadow-[0_0_30px_#d946ef]" />
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-10 pt-32 md:pt-40 space-y-10 relative z-10">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] p-8 md:p-12 rounded-3xl border border-white/[0.08] backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start text-fuchsia-400">
               <Cpu className="w-5 h-5 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-fuchsia-500/10 border border-fuchsia-500/20 px-3 py-1 rounded-full">Neural Scanner v6.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-violet-400 drop-shadow-lg">
              ATS_OPTIMIZER<span className="text-fuchsia-500">.</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base font-medium max-w-xl">
              Monitor your Base Profile Health instantly. Paste a target Job Description to benchmark your skills and unlock the Match Index.
            </p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-6 md:gap-8 bg-black/40 p-6 rounded-3xl border border-white/5 shadow-inner">
              <div className="text-center">
                <div className="text-4xl font-black italic text-violet-400">{result.gScore || 0}%</div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Base Health</p>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <div className="text-4xl font-black italic text-fuchsia-400">{showResults ? result.mScore : '--'}%</div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">Match Index</p>
              </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.08] backdrop-blur-xl group h-fit shadow-2xl">
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                   <FileText className="w-4 h-4 text-fuchsia-500" /> Target Job Description
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${wordCount > 10 ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-zinc-500 bg-zinc-800 border-zinc-700'}`}>
                  {wordCount} Words
                </span>
              </div>
              
              <textarea 
                value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the target Job Description here to unlock the Match Index..."
                className="w-full h-80 md:h-96 bg-black/50 p-6 rounded-2xl border border-white/[0.05] text-zinc-100 focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 outline-none transition-all font-mono text-sm leading-relaxed shadow-inner placeholder-zinc-700 custom-scrollbar"
              />
              
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={startScan} disabled={isScanning}
                className="w-full mt-6 bg-gradient-to-r from-fuchsia-600 to-violet-600 py-5 rounded-xl font-black flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(217,70,239,0.2)] hover:shadow-[0_0_40px_rgba(217,70,239,0.4)] disabled:opacity-50 border border-white/20 text-white"
              >
                {isScanning ? <Activity className="animate-spin w-5 h-5" /> : <Crosshair className="w-5 h-5" />}
                {isScanning ? "PROCESSING_VECTORS..." : "INITIALIZE_SCAN"}
              </motion.button>
            </motion.div>

            <AnimatePresence>
                {showResults && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl">
                        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/[0.05] pb-4">
                            <LayoutGrid className="w-4 h-4 text-fuchsia-500" /> Semantic Skill Matrix
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {result.heatmap?.map((item: any, i: number) => (
                                <div key={i} className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 hover:-translate-y-1 ${item.found ? 'bg-green-500/10 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                                    <p className={`text-[10px] font-bold uppercase truncate tracking-wider ${item.found ? 'text-green-400' : 'text-red-400'}`}>{item.word}</p>
                                    {item.found ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <AlertTriangle className="w-3 h-3 text-red-500" />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {isScanning ? (
                <motion.div key="scan" className="h-full bg-white/[0.01] rounded-3xl border border-fuchsia-500/20 flex flex-col items-center justify-center p-12 min-h-[500px] backdrop-blur-md shadow-[0_0_50px_rgba(217,70,239,0.05)]">
                   <div className="relative w-40 h-40 flex items-center justify-center mb-10">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-t-4 border-l-4 border-fuchsia-500 rounded-full" />
                      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-4 border-b-4 border-r-4 border-violet-500 rounded-full opacity-50" />
                      <Search className="w-10 h-10 text-fuchsia-400 animate-pulse" />
                   </div>
                   
                   <div className="h-6 w-full text-center">
                     <AnimatePresence mode="wait">
                       <motion.p 
                         key={scanStep}
                         initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                         className="text-fuchsia-400 font-bold tracking-[0.2em] text-[10px] uppercase"
                       >
                         {scanStepsText[scanStep]}
                       </motion.p>
                     </AnimatePresence>
                   </div>
                   
                   <div className="w-64 h-1.5 bg-zinc-900 rounded-full mt-6 overflow-hidden border border-white/5">
                     <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3.2, ease: "linear" }} className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-500" />
                   </div>
                </motion.div>
              ) : showResults ? (
                <motion.div key="res" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 h-full">
                  
                  <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl flex justify-around items-center">
                    <CircularProgress 
                      value={result.gScore} title="Base Health" subtitle="Profile Quality"
                      colorClass="text-violet-400" shadowClass="shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                      gradientId="gradHealth" fromColor="#a78bfa" toColor="#8b5cf6"
                    />
                    <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    <CircularProgress 
                      value={result.mScore} title="Match Index" subtitle="JD Alignment"
                      colorClass="text-fuchsia-400" shadowClass="shadow-[0_0_30px_rgba(217,70,239,0.2)]"
                      gradientId="gradMatch" fromColor="#f472b6" toColor="#d946ef"
                    />
                  </div>

                  <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl">
                     <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/[0.05] pb-4">
                        <BarChart3 className="w-4 h-4 text-cyan-400" /> Comparison Analytics
                     </h3>
                     <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-2 tracking-widest text-zinc-400"><span>Keywords Matched</span><span className="text-cyan-400">{result.mScore}%</span></div>
                            <div className="w-full bg-black/50 h-3 rounded-full border border-white/5 overflow-hidden shadow-inner p-0.5">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${result.mScore}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full relative">
                                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </motion.div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-2 tracking-widest text-zinc-400"><span>Gap Mismatch</span><span className="text-red-400">{100 - result.mScore}%</span></div>
                            <div className="w-full bg-black/50 h-3 rounded-full border border-white/5 overflow-hidden shadow-inner p-0.5">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - result.mScore}%` }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" />
                            </div>
                        </div>
                     </div>
                  </div>

                  {result.missing.length > 0 && (
                    <div className="bg-white/[0.02] p-8 rounded-3xl border border-red-500/20 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.05)]">
                       <h3 className="text-red-400 font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2">
                         <Target className="w-4 h-4" /> Missing Keywords Detected
                       </h3>
                       <div className="flex flex-wrap gap-2">
                          {result.missing.map((kw, i) => (
                            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }} key={i} className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-2 rounded-xl font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                              + {kw}
                            </motion.span>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/[0.08] backdrop-blur-xl shadow-2xl">
                     <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 font-black uppercase text-xs tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/[0.05] pb-4">
                       <Shield className="w-4 h-4 text-yellow-400" /> Actionable Insights
                     </h3>
                     <div className="space-y-4">
                        {result.suggestions.map((s, i) => (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.1) }} key={i} className="flex gap-4 items-start bg-black/40 p-5 rounded-2xl border border-white/[0.03] text-[11px] text-zinc-300 leading-relaxed hover:border-white/[0.1] transition-colors shadow-inner">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-[0_0_10px_currentColor] ${s.includes('NLP Tip') ? 'bg-cyan-400 text-cyan-400' : 'bg-yellow-400 text-yellow-400'}`} /> 
                            <p className={s.includes('NLP Tip') ? 'text-cyan-300 font-semibold' : ''}>{s}</p>
                          </motion.div>
                        ))}
                     </div>
                  </div>

                </motion.div>
              ) : (
                <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-white/[0.02] rounded-3xl border border-white/[0.05] p-8 md:p-12 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center text-center">
                  
                  {/* --- NEW HEALTH GAUGE --- */}
                  <div className="w-full mb-10">
                    <h3 className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-violet-400" /> Overall Profile Readiness
                    </h3>
                    
                    <div className="relative w-full max-w-sm mx-auto">
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-2 tracking-widest text-zinc-500">
                        <span>Needs Work</span>
                        <span className="text-violet-400">{result.gScore || 0}%</span>
                        <span>Excellent</span>
                      </div>
                      
                      <div className="w-full bg-black/60 h-4 rounded-full border border-white/5 overflow-hidden shadow-inner flex">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${result.gScore || 0}%` }} 
                          transition={{ duration: 1.5, ease: "easeOut" }} 
                          className={`h-full relative ${
                            (result.gScore || 0) < 50 ? 'bg-gradient-to-r from-red-600 to-orange-500' :
                            (result.gScore || 0) < 80 ? 'bg-gradient-to-r from-orange-500 to-yellow-400' :
                            'bg-gradient-to-r from-green-500 to-emerald-400'
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10">
                    <CircularProgress 
                      value={result.gScore || 0} title="Base Health" subtitle="Profile Quality"
                      colorClass="text-violet-400" shadowClass="shadow-[0_0_30px_rgba(139,92,246,0.2)]"
                      gradientId="gradHealthInitial" fromColor="#a78bfa" toColor="#8b5cf6"
                    />
                  </div>

                  <div className="w-full max-w-md text-left space-y-4">
                    <h3 className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest border-b border-white/[0.05] pb-4 flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-violet-400" /> Initial Profile Diagnostics
                    </h3>
                    
                    {result.suggestions?.length > 0 ? (
                      <div className="space-y-3">
                        {result.suggestions.map((s: string, i: number) => (
                          <div key={i} className="flex gap-4 items-start bg-black/40 p-5 rounded-2xl border border-white/[0.03] text-[11px] text-zinc-400 shadow-inner">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0 shadow-[0_0_8px_#8b5cf6]" />
                            <p>{s}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-green-500/10 border border-green-500/20 p-5 rounded-2xl text-center">
                        <p className="text-[11px] text-green-400 font-bold tracking-wider">
                          Base profile is perfectly optimized! Ready for JD matching.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-12 p-5 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] w-full max-w-md">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center justify-center gap-2">
                      <Target className="w-4 h-4 text-fuchsia-500/50" /> Paste Job Description to unlock Match Index
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}