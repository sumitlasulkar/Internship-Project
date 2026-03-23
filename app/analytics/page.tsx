'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, auth } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, 
  BarChart, Bar, Cell, XAxis as BarXAxis, YAxis as BarYAxis, Tooltip as BarTooltip,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar 
} from 'recharts';
import { 
  Activity, BrainCircuit, Terminal, ArrowLeft, Database, Zap, Code, 
  Briefcase, GraduationCap, SlidersHorizontal, BarChart3, Target, Trophy, 
  Crosshair, Scan, Compass, Radar as RadarIcon, CircleDollarSign, BotMessageSquare 
} from 'lucide-react';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- Custom Tooltips ---
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
  const [targetSkills, setTargetSkills] = useState(0);
  const [targetProjects, setTargetProjects] = useState(0);
  const [targetExp, setTargetExp] = useState(0);
  const [timeframe, setTimeframe] = useState(6); 
  const [customGoal, setCustomGoal] = useState<string>('');
  const [goalError, setGoalError] = useState(false);

  const springConfig = { type: "spring" as const, stiffness: 300, damping: 30 };

  // 🔴 1. FIREBASE DATA FETCHING
  useEffect(() => {
    let unsubSnapshot: any;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubSnapshot = onSnapshot(doc(db, "portfolios", user.uid), (docSnap) => {
          if (docSnap.exists()) setUserData(docSnap.data());
          else setUserData({}); 
          setIsAuthLoading(false);
        });
      } else {
        setUserData(null);
        setIsAuthLoading(false);
      }
    });
    return () => { unsubscribeAuth(); if (unsubSnapshot) unsubSnapshot(); };
  }, []);

  // 🔴 2. SCORE CALCULATION
  const currentSkillsCount = Array.isArray(userData?.skills) ? userData.skills.reduce((acc: number, skill: any) => acc + (skill.items?.split(',').length || 0), 0) : 0;
  const currentProjectsCount = Array.isArray(userData?.projects) ? userData.projects.length : 0;
  const currentExpCount = Array.isArray(userData?.experiences) ? userData.experiences.length : 0;

  const currentScore = (currentSkillsCount * 3) + (currentProjectsCount * 20) + (currentExpCount * 25);
  const projectedAddedScore = (targetSkills * 3) + (targetProjects * 20) + (targetExp * 25);
  const targetTotalScore = currentScore + projectedAddedScore;
  
  // The active score dictating the UI (Current vs Simulated)
  const activeScore = isPredicted ? targetTotalScore : currentScore;

  // Leveling System
  const getLevelInfo = (score: number) => {
    if (score < 120) return { level: 'Beginner', next: 'Moderate', target: 120, color: '#f43f5e', progress: (score / 120) * 100 };
    if (score < 220) return { level: 'Moderate', next: 'Pro', target: 220, color: '#06b6d4', progress: ((score - 120) / 100) * 100 };
    return { level: 'Pro', next: 'Maxed Out', target: 300, color: '#34d399', progress: Math.min(((score - 220) / 80) * 100, 100) };
  };

  const currentLevelInfo = getLevelInfo(currentScore);
  const pointsToNextLevel = Math.max(0, currentLevelInfo.target - currentScore);

  const requirementsData = [
    { name: 'Projects', value: Math.ceil(pointsToNextLevel / 20), color: '#3b82f6' },
    { name: 'Experiences', value: Math.ceil(pointsToNextLevel / 25), color: '#a855f7' },
    { name: 'Skills', value: Math.ceil(pointsToNextLevel / 3), color: '#f97316' },
  ];

  // 🔴 3. NEW FEATURES DATA GENERATION 🔴
  
  // Feature 1: Tech Mastery Radar
  const techRadarData = [
    { domain: 'Frontend', score: Math.min(100, 30 + (activeScore * 0.25)) },
    { domain: 'Backend', score: Math.min(100, 20 + (activeScore * 0.22)) },
    { domain: 'Database', score: Math.min(100, 25 + (activeScore * 0.20)) },
    { domain: 'DevOps', score: Math.min(100, 10 + (activeScore * 0.15)) },
    { domain: 'System Design', score: Math.min(100, 5 + (activeScore * 0.18)) },
  ];

  // Feature 2: Market Value Predictor
  const estimatedSalary = 40000 + (activeScore * 350);
  const formattedSalary = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(estimatedSalary);

  // Feature 3: Silicon Valley Alignment
  const alignmentPercent = Math.min(99, Math.round((activeScore / 300) * 100) + 5);
  const radialData = [{ name: 'Alignment', value: alignmentPercent, fill: isPredicted ? '#8b5cf6' : '#06b6d4' }];

  // Feature 4: AI Next Best Action
  const getAIRecommendation = () => {
    if (activeScore < 120) return "Focus on building 2 full-stack projects to establish a strong baseline.";
    if (activeScore < 220) return "Diversify your tech stack. Adding DevOps or Cloud certs will maximize your ROI.";
    return "You are in the elite tier. Focus on System Architecture and Open Source contributions.";
  };

  // 🔴 4. AUTO-PILOT & GRAPH LOGIC
  const handleSetGoal = () => {
    const goal = parseInt(customGoal);
    if (isNaN(goal) || goal <= currentScore) {
      setGoalError(true);
      setTimeout(() => setGoalError(false), 2000);
      return;
    }
    let gap = goal - currentScore;
    
    let exp = Math.floor(gap / 25);
    if(exp > 5) exp = 5; 
    gap -= exp * 25;

    let proj = Math.floor(gap / 20);
    if(proj > 10) proj = 10;
    gap -= proj * 20;

    let skills = Math.ceil(gap / 3);
    if(skills > 20) skills = 20;

    setTargetExp(exp);
    setTargetProjects(proj);
    setTargetSkills(skills);
    setCustomGoal('');
    runSimulation(exp, proj, skills);
  };

  const generateData = (runSim = false, forcedAddedScore = projectedAddedScore) => {
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

    const addedScore = runSim ? forcedAddedScore : 0;
    const finalTarget = currentScore + addedScore;
    const growthPerMonth = addedScore / timeframe;
    let simScore = currentScore;

    for (let i = 1; i <= timeframe; i++) {
      let mIdx = (currentMonthIdx + i) % 12;
      simScore += growthPerMonth;
      let noise = runSim ? (Math.random() * 10) - 5 : 0; 
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

  const runSimulation = (exp=targetExp, proj=targetProjects, skills=targetSkills) => {
    setIsSimulating(true);
    const specificAddedScore = (skills * 3) + (proj * 20) + (exp * 25);
    
    setTimeout(() => {
      setChartData(generateData(true, specificAddedScore));
      setIsPredicted(true);
      setIsSimulating(false);
    }, 2000); 
  };

  // Renders
  if (isAuthLoading) return (<div className="min-h-screen bg-[#000000] flex items-center justify-center"><div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" /></div>);
  if (!userData) return (<div className="min-h-screen bg-[#000000] text-zinc-100 flex flex-col items-center justify-center p-4 text-center"><Database size={48} className="text-zinc-700 mb-6" /><h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2><Link href="/"><button className="mt-8 bg-cyan-500 text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Return to Home</button></Link></div>);

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

        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight mb-3">Hyper-Predictive Analytics.</h1>
             <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">Simulate future career trajectories based on algorithmic estimations of your live database projects, skills, and experience acquisitions.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="bg-[#050505] border border-white/[0.05] px-6 py-4 rounded-2xl flex flex-col shadow-xl min-w-[200px] relative overflow-hidden group">
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Database size={12} className="text-cyan-500"/> Live Score</span>
                   <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ color: currentLevelInfo.color, backgroundColor: `${currentLevelInfo.color}15`, border: `1px solid ${currentLevelInfo.color}30` }}>
                     {currentLevelInfo.level}
                   </span>
                 </div>
                 <div className="flex items-baseline gap-1 mt-1">
                   <motion.span key={currentScore} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-black text-white">{currentScore}</motion.span>
                   <span className="text-xs font-bold text-zinc-600">/ 300</span>
                 </div>
                 <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-3 overflow-hidden flex gap-0.5">
                   <motion.div className="h-full bg-rose-500" animate={{ width: currentScore >= 120 ? '100%' : `${currentLevelInfo.progress}%` }} transition={{ duration: 1 }} style={{ opacity: currentScore > 0 ? 1 : 0.2 }} />
                   <motion.div className="h-full bg-cyan-500" animate={{ width: currentScore >= 220 ? '100%' : (currentScore > 120 ? `${currentLevelInfo.progress}%` : '0%') }} transition={{ duration: 1, delay: 0.2 }} style={{ opacity: currentScore > 120 ? 1 : 0.2 }} />
                   <motion.div className="h-full bg-emerald-400" animate={{ width: currentScore >= 300 ? '100%' : (currentScore > 220 ? `${currentLevelInfo.progress}%` : '0%') }} transition={{ duration: 1, delay: 0.4 }} style={{ opacity: currentScore > 220 ? 1 : 0.2 }} />
                 </div>
              </div>

              <div className={`border px-6 py-4 rounded-2xl flex flex-col justify-center transition-all duration-500 ${isPredicted ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'bg-white/[0.02] border-white/[0.05]'}`}>
                 <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5 ${isPredicted ? 'text-indigo-400' : 'text-zinc-500'}`}><Zap size={12}/> Target Potential</span>
                 <motion.span key={targetTotalScore} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`text-3xl font-black ${isPredicted ? 'text-indigo-400' : 'text-zinc-500'}`}>{isPredicted ? targetTotalScore : '--'} <span className="text-sm opacity-50">pts</span></motion.span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- LEFT COLUMN: MAIN GRAPHS (8 cols) --- */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* 1. Main Growth Curve */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="bg-[#050505] border border-white/[0.05] rounded-[2rem] p-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] border border-white/[0.05] flex items-center justify-center shadow-inner">
                    <BarChart3 size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-base font-bold tracking-tight">Growth Forecast Curve</h3>
                    <p className="text-zinc-500 text-[10px] mt-0.5 font-medium uppercase tracking-wider">Trajectory mapped over {timeframe} months</p>
                  </div>
                </div>
              </div>

              <div className="w-full flex-1 min-h-[250px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#050505]/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl overflow-hidden">
                      <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_20px_#6366f1,0_0_40px_#6366f1]" />
                      <Scan size={40} className="text-indigo-400 mb-4 animate-pulse" />
                      <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Compiling Neural Forecast...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* NEW ROW: Tech Mastery & Market Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 🔴 NEW FEATURE 1: TECH MASTERY RADAR 🔴 */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{...springConfig, delay: 0.1}} className="bg-[#0A0A0A] border border-white/[0.05] rounded-[2rem] p-6 shadow-lg flex flex-col">
                 <h3 className="text-white text-sm font-bold flex items-center gap-2 mb-2"><RadarIcon size={16} className={isPredicted ? "text-indigo-400" : "text-cyan-400"}/> Domain Mastery</h3>
                 <p className="text-zinc-500 text-[10px] mb-4 uppercase tracking-widest font-bold">Skill spread analysis</p>
                 <div className="w-full h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={techRadarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="domain" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Mastery" dataKey="score" stroke={isPredicted ? "#8b5cf6" : "#06b6d4"} strokeWidth={2} fill={isPredicted ? "#8b5cf6" : "#06b6d4"} fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                 </div>
              </motion.div>

              {/* 🔴 NEW FEATURE 2 & 3: ALIGNMENT & SALARY PREDICTOR 🔴 */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{...springConfig, delay: 0.2}} className="bg-[#0A0A0A] border border-white/[0.05] rounded-[2rem] p-6 shadow-lg flex flex-col justify-between">
                
                <div>
                  <h3 className="text-white text-sm font-bold flex items-center gap-2 mb-2"><Compass size={16} className={isPredicted ? "text-indigo-400" : "text-cyan-400"}/> Silicon Valley Alignment</h3>
                  <p className="text-zinc-500 text-[10px] mb-2 uppercase tracking-widest font-bold">Industry standard match</p>
                  
                  <div className="flex items-center gap-4 h-[100px]">
                    <div className="w-[100px] h-[100px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={radialData} startAngle={90} endAngle={-270}>
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={10} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <motion.span key={alignmentPercent} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className={`text-4xl font-black ${isPredicted ? 'text-indigo-400' : 'text-cyan-400'}`}>{alignmentPercent}%</motion.span>
                      <p className="text-zinc-400 text-xs font-medium">Match with FAANG criteria</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <h3 className="text-white text-sm font-bold flex items-center gap-2 mb-1"><CircleDollarSign size={14} className="text-emerald-400"/> Est. Market Value</h3>
                  <motion.p key={formattedSalary} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-black text-emerald-400">{formattedSalary} <span className="text-[10px] text-zinc-500 uppercase">/ year</span></motion.p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* --- RIGHT COLUMN: SIMULATION CONTROLS & AI INSIGHTS (4 cols) --- */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Scenario Builder */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="bg-[#0A0A0A] border border-white/[0.05] rounded-[2rem] p-6 relative shadow-2xl flex flex-col">
              
              {/* Auto-Pilot Goal Setter */}
              <div className="mb-6 pb-6 border-b border-white/[0.05]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3">
                  <Crosshair size={14} className="text-rose-500" /> Auto-Pilot Goal
                </h3>
                <div className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${goalError ? 'border-red-500 bg-red-500/10' : 'bg-[#050505] border-white/[0.1] focus-within:border-indigo-500'}`}>
                  <input 
                    type="number" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)} placeholder={`Target > ${currentScore}`}
                    className="w-full bg-transparent border-none outline-none text-white text-xs px-2 font-mono placeholder:text-zinc-600"
                  />
                  <button onClick={handleSetGoal} className="bg-white text-black px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-400 transition-colors shrink-0">Set</button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-5">
                <SlidersHorizontal size={14} className="text-indigo-400" /> Manual Builder
              </h3>

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider"><Code size={10} className="inline mr-1"/> Target Skills</label><span className="bg-white/[0.05] px-2 py-0.5 rounded text-[10px] font-mono text-white">{targetSkills}</span></div>
                  <input type="range" min="0" max="20" value={targetSkills} onChange={(e) => { setTargetSkills(Number(e.target.value)); setIsPredicted(false); }} className="w-full accent-cyan-500 h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider"><Briefcase size={10} className="inline mr-1"/> Target Projects</label><span className="bg-white/[0.05] px-2 py-0.5 rounded text-[10px] font-mono text-white">{targetProjects}</span></div>
                  <input type="range" min="0" max="10" value={targetProjects} onChange={(e) => { setTargetProjects(Number(e.target.value)); setIsPredicted(false); }} className="w-full accent-cyan-500 h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center"><label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider"><GraduationCap size={10} className="inline mr-1"/> Target Exp/Certs</label><span className="bg-white/[0.05] px-2 py-0.5 rounded text-[10px] font-mono text-white">{targetExp}</span></div>
                  <input type="range" min="0" max="5" value={targetExp} onChange={(e) => { setTargetExp(Number(e.target.value)); setIsPredicted(false); }} className="w-full accent-cyan-500 h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => runSimulation()} disabled={isSimulating} className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-indigo-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-[0_10px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.5)] disabled:opacity-50">
                <BrainCircuit size={14} /> Execute Sim
              </motion.button>
            </motion.div>

            {/* 🔴 NEW FEATURE 4: AI ACTIONABLE INSIGHTS 🔴 */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{...springConfig, delay: 0.2}} className="bg-gradient-to-br from-indigo-900/20 to-black border border-indigo-500/20 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
               <h3 className="text-indigo-400 text-sm font-bold flex items-center gap-2 mb-3"><BotMessageSquare size={16} /> AI Next Best Action</h3>
               <p className="text-zinc-300 text-xs leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                 "{getAIRecommendation()}"
               </p>
            </motion.div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 12px; width: 12px;
          border-radius: 50%;
          background: #06b6d4;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }
      `}} />
    </div>
  );
}