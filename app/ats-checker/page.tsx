'use client';
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Zap, Shield, Target, Cpu, Search, Activity, AlertCircle, ArrowRight, LayoutGrid, BarChart3 } from 'lucide-react';
import Header from '../Home/header';
import Footer from '../Home/Footer';
import { analyzeATS } from '@/lib/atsEngine';

export default function ATSCheckerPage() {
  const [userData, setUserData] = useState<any>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const result = analyzeATS(userData, jobDesc);

  const startScan = () => {
    if (!jobDesc) return alert("Pehle JD toh dalo bhai!");
    setIsScanning(true);
    setShowResults(false);
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 3000); 
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-orange-600/30 overflow-x-hidden">
      
      {/* 🚀 STICKY HEADER SECTION */}
      <div className="fixed top-0 left-0 w-full z-[100]">
        <Header />
      </div>
      
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <motion.div animate={{ y: [-500, 1000] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="w-full h-[1px] bg-orange-500 shadow-[0_0_20px_orange]" />
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-10 pt-32 md:pt-44 space-y-12 relative z-10">
        
        {/* --- HEADER --- */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/40 p-10 rounded-[3rem] border border-zinc-800 backdrop-blur-3xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start text-orange-500">
               <Cpu className="w-5 h-5 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Scanner v5.0</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white">ATS_SCAN<span className="text-orange-600">.</span></h1>
          </div>

          <div className="flex gap-10">
             <div className="text-center">
                <div className="text-4xl font-black italic text-orange-600">{result.gScore}%</div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Profile Health</p>
             </div>
             <div className="text-center">
                <div className="text-4xl font-black italic text-blue-500">{showResults ? result.mScore : 0}%</div>
                <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Match Index</p>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-8">
            {/* INPUT BOX */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-zinc-900/20 p-8 rounded-[3rem] border border-zinc-800 group h-fit">
              <h2 className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                 <Search className="w-3 h-3 text-orange-500" /> Data_Payload: Job Description
              </h2>
              <textarea 
                value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste JD here..."
                className="w-full h-80 md:h-96 bg-black/60 p-8 rounded-[2rem] border border-zinc-800 text-orange-50 focus:border-orange-500/50 outline-none transition-all font-mono text-sm leading-relaxed"
              />
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={startScan} disabled={isScanning}
                className="w-full mt-8 bg-orange-600 py-6 rounded-2xl font-black flex items-center justify-center gap-4 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {isScanning ? <Activity className="animate-spin" /> : <Zap fill="white" />}
                {isScanning ? "RECONSTRUCTING_VECTORS..." : "INITIALIZE_SCAN"}
              </motion.button>
            </motion.div>

            {/* 🔥 REAL-TIME SKILL GAP HEATMAP (Visual Grid) */}
            <AnimatePresence>
                {showResults && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/40 p-8 rounded-[3rem] border border-zinc-800">
                        <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-orange-500" /> Skill-Gap Heatmap
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {result.heatmap?.map((item: any, i: number) => (
                                <div key={i} className={`p-3 rounded-xl border text-center transition-all ${item.found ? 'bg-green-600/10 border-green-600/30' : 'bg-red-600/10 border-red-600/30'}`}>
                                    <p className={`text-[9px] font-bold uppercase truncate ${item.found ? 'text-green-500' : 'text-red-500'}`}>{item.word}</p>
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
                <motion.div key="scan" className="h-full bg-zinc-900/40 rounded-[3rem] border border-orange-600/20 flex flex-col items-center justify-center p-10 min-h-[500px]">
                   <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-32 h-32 border-t-2 border-orange-600 rounded-full mb-8 shadow-[0_0_30px_orange]" />
                   <p className="text-orange-500 font-black italic tracking-widest text-xs animate-pulse text-center uppercase">Mapping_Semantic_Gaps...</p>
                </motion.div>
              ) : showResults ? (
                <motion.div key="res" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  
                  {/* FEATURE: MATCH GRAPH (Visual Bars) */}
                  <div className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800">
                     <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-500" /> Comparison Analytics
                     </h3>
                     <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-2"><span>Keywords Matched</span><span>{result.mScore}%</span></div>
                            <div className="w-full bg-black h-2 rounded-full border border-zinc-800 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${result.mScore}%` }} className="h-full bg-blue-600" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-2"><span>Gap Mismatch</span><span>{100 - result.mScore}%</span></div>
                            <div className="w-full bg-black h-2 rounded-full border border-zinc-800 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - result.mScore}%` }} className="h-full bg-red-600" />
                            </div>
                        </div>
                     </div>
                  </div>

                  {/* RESULTS CARDS */}
                  <div className="bg-gradient-to-br from-zinc-900 to-black p-10 rounded-[3rem] border border-orange-600/30">
                     <div className="flex justify-between items-start mb-8">
                        <div><h3 className="text-white font-black italic text-3xl tracking-tighter">MATCH_RANK</h3><p className="text-[9px] text-zinc-500 font-bold uppercase">Confidence Level</p></div>
                        <div className="text-6xl font-black text-orange-600 drop-shadow-[0_0_20px_rgba(234,88,12,0.5)]">{result.mScore}%</div>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {result.missing.map((kw, i) => (
                          <span key={i} className="text-[9px] bg-red-600/10 text-red-500 border border-red-900/30 px-3 py-2 rounded-xl font-bold uppercase">+{kw}</span>
                        ))}
                     </div>
                  </div>

                  <div className="bg-zinc-900 p-8 rounded-[3rem] border border-zinc-800">
                     <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-widest mb-6 flex items-center gap-2"><Shield className="w-4 h-4 text-orange-500" /> Smart Suggestions</h3>
                     <div className="space-y-4">
                        {result.suggestions.map((s, i) => (
                          <div key={i} className="flex gap-4 items-start bg-black/40 p-4 rounded-2xl border border-zinc-800/50 text-[11px] text-zinc-400">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5 shrink-0" /> 
                            <p className={s.includes('NLP Tip') ? 'text-blue-400 font-bold' : ''}>{s}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center p-12 min-h-[500px] text-center">
                  <Target className="w-16 h-16 mb-6 opacity-10 animate-pulse text-zinc-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 leading-loose">AWAITING_INPUT<br/>[ TARGET_DATA_MISSING ]</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}