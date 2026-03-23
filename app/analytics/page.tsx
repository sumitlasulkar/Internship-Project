'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, BarChart, Bar, Cell, XAxis as BarXAxis, YAxis as BarYAxis, Tooltip as BarTooltip } from 'recharts';
import { Activity, BrainCircuit, Terminal, ArrowLeft, Database, Zap, Code, Briefcase, GraduationCap, SlidersHorizontal, BarChart3, Target, Trophy } from 'lucide-react';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505]/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-zinc-400 text-[10px] uppercase tracking-widest mb-2 font-bold">{label} Forecast</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color, boxShadow: `0 0 10px ${entry.color}` }} />
            <span className="text-white text-xs font-semibold">
              {entry.name === 'actual' ? 'Historical Score' : 'Projected Score'}: <span style={{ color: entry.color, fontWeight: 900 }}>{Math.round(entry.value)}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for the Needs Graph
const NeedsTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505]/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
        <span className="text-white text-xs font-semibold">
          Required: <span style={{ color: payload[0].payload.color, fontWeight: 900 }}>{payload[0].value} {payload[0].payload.name}</span>
        </span>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [userData, setUserData] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPredicted, setIsPredicted] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  // Simulation State
  const [targetSkills, setTargetSkills] = useState(5);
  const [targetProjects, setTargetProjects] = useState(2);
  const [targetExp, setTargetExp] = useState(1);
  const [timeframe, setTimeframe] = useState(6); 

  const springConfig = { type: "spring" as const, stiffness: 300, damping: 30 };

  // 🔴 1. REAL-TIME FIREBASE DATA FETCHING 🔴 (UNTOUCHED)
  useEffect(() => {
    let unsubSnapshot: any;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubSnapshot = onSnapshot(doc(db, "portfolios", user.uid), (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData({}); 
          }
          setIsAuthLoading(false);
        });
      } else {
        setUserData(null);
        setIsAuthLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
  }, []);

  // 🔴 2. DYNAMIC SCORE CALCULATION 🔴 (UNTOUCHED)
  const currentSkillsCount = Array.isArray(userData?.skills) 
    ? userData.skills.reduce((acc: number, skill: any) => acc + (skill.items?.split(',').length || 0), 0) 
    : 0;
  const currentProjectsCount = Array.isArray(userData?.projects) ? userData.projects.length : 0;
  const currentExpCount = Array.isArray(userData?.experiences) ? userData.experiences.length : 0;

  const currentScore = (currentSkillsCount * 3) + (currentProjectsCount * 20) + (currentExpCount * 25);
  const projectedAddedScore = (targetSkills * 3) + (targetProjects * 20) + (targetExp * 25);
  const targetTotalScore = currentScore + projectedAddedScore;

  // 🔴 NEW: LEVELING SYSTEM LOGIC 🔴
  const getLevelInfo = (score: number) => {
    if (score < 120) return { level: 'Beginner', next: 'Moderate', target: 120, color: '#f43f5e', progress: (score / 120) * 100 }; // Rose
    if (score < 220) return { level: 'Moderate', next: 'Pro', target: 220, color: '#06b6d4', progress: ((score - 120) / 100) * 100 }; // Cyan
    return { level: 'Pro', next: 'Maxed Out', target: 300, color: '#34d399', progress: Math.min(((score - 220) / 80) * 100, 100) }; // Emerald
  };

  const currentLevelInfo = getLevelInfo(currentScore);
  const pointsToNextLevel = Math.max(0, currentLevelInfo.target - currentScore);

  // Data for the "What it takes" Bar Chart
  const requirementsData = [
    { name: 'Projects', value: Math.ceil(pointsToNextLevel / 20), color: '#3b82f6' },
    { name: 'Experiences', value: Math.ceil(pointsToNextLevel / 25), color: '#a855f7' },
    { name: 'Skills', value: Math.ceil(pointsToNextLevel / 3), color: '#f97316' },
  ];

  // 🔴 3. GRAPH DATA GENERATOR 🔴 (UNTOUCHED)
  const generateData = (runSimulation = false) => {
    const date = new Date();
    const currentMonthIdx = date.getMonth();
    const dataPoints = [];
    let tempScore = currentScore - 60; 
    if (tempScore < 0) tempScore = 0;
    
    for (let i = 5; i > 0; i--) {
      let mIdx = (currentMonthIdx - i + 12) % 12;
      tempScore += Math.floor(Math.random() * 10) + 5;
      dataPoints.push({ month: monthNames[mIdx], actual: tempScore, predicted: null });
    }
    
    dataPoints.push({ month: monthNames[currentMonthIdx], actual: currentScore, predicted: currentScore });

    const addedScore = runSimulation ? projectedAddedScore : 0;
    const finalTarget = currentScore + addedScore;
    const growthPerMonth = addedScore / timeframe;
    let simScore = currentScore;

    for (let i = 1; i <= timeframe; i++) {
      let mIdx = (currentMonthIdx + i) % 12;
      simScore += growthPerMonth;
      let noise = runSimulation ? (Math.random() * 10) - 5 : 0; 
      dataPoints.push({ 
        month: monthNames[mIdx], actual: null, predicted: i === timeframe ? finalTarget : Math.round(simScore + noise) 
      });
    }
    return dataPoints;
  };

  useEffect(() => {
    if (!isAuthLoading) {
      setChartData(generateData(false));
      setIsPredicted(false);
    }
  }, [userData, isAuthLoading, timeframe]);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setChartData(generateData(true));
      setIsPredicted(true);
      setIsSimulating(false);
    }, 1500);
  };

  // Loading & Access Denied Screens (UNTOUCHED)
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="w-12 h-12 border-t-2 border-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
          <span className="text-cyan-500 font-bold tracking-[0.3em] text-xs uppercase animate-pulse">Syncing Database...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col items-center justify-center p-4 text-center">
        <Database size={48} className="text-zinc-700 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-zinc-500 mb-8">Please authenticate to view your live analytics.</p>
        <Link href="/"><button className="bg-cyan-500 text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Return to Home</button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-cyan-500/30 p-4 md:p-10 relative overflow-x-hidden flex flex-col items-center">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        <motion.div animate={{ opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-cyan-600/20 blur-[150px] rounded-full" />
        <motion.div animate={{ opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-indigo-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl relative z-10">
        <Link href="/">
          <motion.div whileHover={{ x: -5 }} className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 font-bold text-[10px] uppercase tracking-widest mb-10 transition-colors cursor-pointer bg-white/[0.02] px-4 py-2.5 rounded-xl border border-white/[0.05]">
            <ArrowLeft size={14} /> System Override / Back
          </motion.div>
        </Link>

        {/* Dashboard Header & SCORE METER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight mb-3">Hyper-Predictive Analytics.</h1>
             <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">Simulate future career trajectories based on algorithmic estimations of your live database projects, skills, and experience acquisitions.</p>
           </div>
           
           <div className="flex gap-4">
              {/* 🔴 NEW: ADVANCED CURRENT SCORE METER 🔴 */}
              <div className="bg-[#050505] border border-white/[0.05] px-6 py-4 rounded-2xl flex flex-col shadow-xl min-w-[200px]">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Database size={12} className="text-cyan-500"/> Live Score</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: currentLevelInfo.color, backgroundColor: `${currentLevelInfo.color}15`, border: `1px solid ${currentLevelInfo.color}30` }}>
                     {currentLevelInfo.level}
                   </span>
                 </div>
                 
                 <div className="flex items-baseline gap-1 mt-1">
                   <span className="text-3xl font-black text-white">{currentScore}</span>
                   <span className="text-xs font-bold text-zinc-600">/ 300</span>
                 </div>

                 {/* Segmented Meter */}
                 <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden flex gap-0.5">
                   <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: currentScore >= 120 ? '100%' : `${currentLevelInfo.progress}%`, opacity: currentScore > 0 ? 1 : 0.2 }} />
                   <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: currentScore >= 220 ? '100%' : (currentScore > 120 ? `${currentLevelInfo.progress}%` : '0%'), opacity: currentScore > 120 ? 1 : 0.2 }} />
                   <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: currentScore >= 300 ? '100%' : (currentScore > 220 ? `${currentLevelInfo.progress}%` : '0%'), opacity: currentScore > 220 ? 1 : 0.2 }} />
                 </div>
                 <div className="flex justify-between mt-1 text-[8px] text-zinc-600 font-bold uppercase">
                   <span>0</span><span>120</span><span>220</span><span>300</span>
                 </div>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/20 px-6 py-4 rounded-2xl flex flex-col shadow-[0_0_20px_rgba(6,182,212,0.15)] justify-center">
                 <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Zap size={12}/> Target Potential</span>
                 <span className="text-3xl font-black text-cyan-400">{isPredicted ? targetTotalScore : '--'} <span className="text-sm opacity-50">pts</span></span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: GRAPHS --- */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. Main Growth Curve (UNTOUCHED LOGIC) */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="bg-[#050505] border border-white/[0.05] rounded-[2rem] p-6 md:p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] border border-white/[0.05] flex items-center justify-center shadow-inner">
                    <BarChart3 size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-base font-bold tracking-tight">Growth Forecast Curve</h3>
                    <p className="text-zinc-500 text-[11px] mt-0.5 font-medium">Trajectory mapped over {timeframe} months</p>
                  </div>
                </div>
              </div>

              <div className="w-full flex-1 min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeight={600} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} fontWeight={600} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                    <Area type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 6, fill: "#06b6d4", stroke: "#000", strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="6 6" fillOpacity={1} fill="url(#colorPredicted)" activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#000", strokeWidth: 2 }} animationDuration={1500} />
                    <ReferenceLine x={monthNames[new Date().getMonth()]} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>

                <AnimatePresence>
                  {isSimulating && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-2xl border border-indigo-500/20">
                      <div className="flex gap-2 mb-5">
                        <motion.div animate={{ height: [12, 35, 12] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 bg-indigo-400 rounded-full" />
                        <motion.div animate={{ height: [12, 50, 12] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 bg-indigo-400 rounded-full" />
                        <motion.div animate={{ height: [12, 25, 12] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 bg-indigo-400 rounded-full" />
                      </div>
                      <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Running Neural Simulation...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* 🔴 NEW: 2. UPGRADE REQUIREMENTS GRAPH 🔴 */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{...springConfig, delay: 0.2}} className="bg-[#0A0A0A] border border-white/[0.05] rounded-[2rem] p-6 md:p-8 relative shadow-lg">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-white text-base font-bold flex items-center gap-2"><Target size={16} className="text-rose-500"/> Path to {currentLevelInfo.next}</h3>
                    <p className="text-zinc-500 text-[11px] mt-1 font-medium">Choose ONE of these paths to bridge the {pointsToNextLevel} pt gap.</p>
                 </div>
                 {currentLevelInfo.level === 'Pro' ? (
                   <Trophy size={28} className="text-emerald-400" />
                 ) : (
                   <span className="text-[10px] bg-white/[0.05] border border-white/10 px-3 py-1.5 rounded-lg text-zinc-300 font-mono">Gap: <b className="text-white">{pointsToNextLevel}</b> pts</span>
                 )}
              </div>

              {currentLevelInfo.level === 'Pro' ? (
                 <div className="w-full h-[150px] flex items-center justify-center text-center px-4">
                    <p className="text-emerald-400/80 text-sm font-bold tracking-widest uppercase">Max Level Reached. You are in the top 1%.</p>
                 </div>
              ) : (
                 <div className="w-full h-[180px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={requirementsData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" horizontal={false} />
                       <BarXAxis type="number" hide />
                       <BarYAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#a1a1aa" fontSize={11} fontWeight={600} width={80} />
                       <BarTooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} content={<NeedsTooltip />} />
                       <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                         {requirementsData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              )}
            </motion.div>

          </div>

          {/* --- RIGHT COLUMN: SIMULATION CONTROLS --- (UNTOUCHED LOGIC) */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="lg:col-span-4 bg-[#0A0A0A] border border-white/[0.05] rounded-[2.5rem] p-8 relative shadow-2xl flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-8">
              <SlidersHorizontal size={16} className="text-indigo-400" /> Scenario Builder
            </h3>

            <div className="space-y-8 flex-1">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Code size={12}/> Target Skills (+3)</label>
                  <span className="bg-white/[0.05] px-3 py-1 rounded-md text-xs font-mono font-bold text-white">{targetSkills}</span>
                </div>
                <input type="range" min="0" max="20" value={targetSkills} onChange={(e) => { setTargetSkills(Number(e.target.value)); setIsPredicted(false); }} className="w-full accent-cyan-500 h-1.5 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Briefcase size={12}/> Target Projects (+20)</label>
                  <span className="bg-white/[0.05] px-3 py-1 rounded-md text-xs font-mono font-bold text-white">{targetProjects}</span>
                </div>
                <input type="range" min="0" max="10" value={targetProjects} onChange={(e) => { setTargetProjects(Number(e.target.value)); setIsPredicted(false); }} className="w-full accent-cyan-500 h-1.5 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><GraduationCap size={12}/> Exp / Certs (+25)</label>
                  <span className="bg-white/[0.05] px-3 py-1 rounded-md text-xs font-mono font-bold text-white">{targetExp}</span>
                </div>
                <input type="range" min="0" max="5" value={targetExp} onChange={(e) => { setTargetExp(Number(e.target.value)); setIsPredicted(false); }} className="w-full accent-cyan-500 h-1.5 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
              </div>

              <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Target Timeframe</label>
                <div className="flex gap-2 bg-[#050505] p-1.5 rounded-xl border border-white/[0.05]">
                  {[3, 6, 12].map(months => (
                    <button key={months} onClick={() => { setTimeframe(months); setIsPredicted(false); }} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === months ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-zinc-600 hover:text-zinc-300'}`}>
                      {months}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-indigo-600 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.5)] transition-shadow border border-white/10 disabled:opacity-50"
            >
              <BrainCircuit size={16} /> Execute Simulation
            </motion.button>
          </motion.div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 16px; width: 16px;
          border-radius: 50%;
          background: #06b6d4;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}} />
    </div>
  );
}