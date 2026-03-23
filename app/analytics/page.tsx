'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, BrainCircuit, Terminal, ArrowLeft, Database, Zap, Code, Briefcase, GraduationCap, SlidersHorizontal, BarChart3 } from 'lucide-react';
import { div } from 'framer-motion/m';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// --- MOCK CURRENT PROFILE DATA ---
// Replace this with your actual Firebase data fetch later
const currentProfile = {
  skillsCount: 15,
  projectsCount: 3,
  expCount: 2,
};

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

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  // Simulation State
  const [targetSkills, setTargetSkills] = useState(5);
  const [targetProjects, setTargetProjects] = useState(2);
  const [targetExp, setTargetExp] = useState(1);
  const [timeframe, setTimeframe] = useState(6); // in months

  const springConfig = { type: "spring" as const, stiffness: 300, damping: 30 };

  // Calculate Scores
  const currentScore = (currentProfile.skillsCount * 3) + (currentProfile.projectsCount * 20) + (currentProfile.expCount * 25);
  
  const projectedAddedScore = (targetSkills * 3) + (targetProjects * 20) + (targetExp * 25);
  const targetTotalScore = currentScore + projectedAddedScore;

  // Generate Graph Data
  const generateData = () => {
    const date = new Date();
    const currentMonthIdx = date.getMonth();
    
    // 1. Past Data (6 Months)
    const dataPoints = [];
    let tempScore = currentScore - 60; // Assume started 60 points lower 6 months ago
    
    for (let i = 5; i > 0; i--) {
      let mIdx = (currentMonthIdx - i + 12) % 12;
      tempScore += Math.floor(Math.random() * 10) + 5;
      dataPoints.push({ month: monthNames[mIdx], actual: tempScore, predicted: null });
    }
    
    // Current Month
    dataPoints.push({ month: monthNames[currentMonthIdx], actual: currentScore, predicted: currentScore });

    // 2. Future Forecast Data
    const growthPerMonth = projectedAddedScore / timeframe;
    let simScore = currentScore;

    for (let i = 1; i <= timeframe; i++) {
      let mIdx = (currentMonthIdx + i) % 12;
      simScore += growthPerMonth;
      // Add slight randomness to make it look like a real stock graph
      let noise = (Math.random() * 10) - 5; 
      dataPoints.push({ 
        month: monthNames[mIdx], 
        actual: null, 
        predicted: i === timeframe ? targetTotalScore : Math.round(simScore + noise) 
      });
    }

    return dataPoints;
  };

  useEffect(() => {
    setMounted(true);
    setChartData(generateData());
  }, []); // Initial load

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setChartData(generateData());
      setIsSimulating(false);
    }, 1500); // 1.5s fake computation delay for "wow" factor
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-sans selection:bg-cyan-500/30 p-4 md:p-10 relative overflow-x-hidden flex flex-col items-center">
      
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)]"></div>
        <motion.div animate={{ opacity: [0.03, 0.08, 0.03] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-cyan-600/20 blur-[150px] rounded-full" />
        <motion.div animate={{ opacity: [0.02, 0.06, 0.02] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-indigo-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Navigation */}
        <Link href="/">
          <motion.div whileHover={{ x: -5 }} className="inline-flex items-center gap-2 text-zinc-500 hover:text-cyan-400 font-bold text-[10px] uppercase tracking-widest mb-10 transition-colors cursor-pointer bg-white/[0.02] px-4 py-2.5 rounded-xl border border-white/[0.05]">
            <ArrowLeft size={14} /> System Override / Back
          </motion.div>
        </Link>

        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
             <h1 className="text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tight mb-3">Hyper-Predictive Analytics.</h1>
             <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">Simulate future career trajectories based on algorithmic estimations of your planned projects, skills, and experience acquisitions.</p>
           </div>
           <div className="flex gap-4">
              <div className="bg-[#050505] border border-white/[0.05] px-6 py-4 rounded-2xl flex flex-col shadow-xl">
                 <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Database size={12} className="text-cyan-500"/> Current Score</span>
                 <span className="text-2xl font-black text-white">{currentScore} <span className="text-sm text-zinc-600">pts</span></span>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 px-6 py-4 rounded-2xl flex flex-col shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                 <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Zap size={12}/> Target Potential</span>
                 <span className="text-2xl font-black text-cyan-400">{targetTotalScore} <span className="text-sm opacity-50">pts</span></span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: RECHARTS GRAPH --- */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="lg:col-span-8 bg-[#050505] border border-white/[0.05] rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-white/[0.05] flex items-center justify-center shadow-inner">
                   <BarChart3 size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold tracking-tight">Growth Forecast Curve</h3>
                  <p className="text-zinc-500 text-xs mt-1 font-medium">Trajectory mapped over {timeframe} months</p>
                </div>
              </div>
            </div>

            <div className="w-full flex-1 min-h-[350px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeight={600} textAnchor="end" />
                  <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} fontWeight={600} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  
                  <Area type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 6, fill: "#06b6d4", stroke: "#000", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="6 6" fillOpacity={1} fill="url(#colorPredicted)" activeDot={{ r: 6, fill: "#8b5cf6", stroke: "#000", strokeWidth: 2 }} animationDuration={1500} />
                  
                  <ReferenceLine x={monthNames[new Date().getMonth()]} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>

              {/* Training Overlay */}
              <AnimatePresence>
                {isSimulating && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-2xl border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                    <div className="flex gap-2 mb-5">
                      <motion.div animate={{ height: [12, 35, 12] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]" />
                      <motion.div animate={{ height: [12, 50, 12] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]" />
                      <motion.div animate={{ height: [12, 25, 12] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]" />
                    </div>
                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Running Neural Simulation...</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* --- RIGHT: SIMULATION CONTROLS --- */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="lg:col-span-4 bg-[#0A0A0A] border border-white/[0.05] rounded-[2.5rem] p-8 relative shadow-2xl flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-8">
              <SlidersHorizontal size={16} className="text-indigo-400" /> Scenario Builder
            </h3>

            <div className="space-y-8 flex-1">
              {/* Slider 1 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Code size={12}/> New Skills</label>
                  <span className="bg-white/[0.05] px-3 py-1 rounded-md text-xs font-mono font-bold text-white">{targetSkills}</span>
                </div>
                <input type="range" min="0" max="20" value={targetSkills} onChange={(e) => setTargetSkills(Number(e.target.value))} className="w-full accent-cyan-500 h-1.5 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
              </div>

              {/* Slider 2 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Briefcase size={12}/> Major Projects</label>
                  <span className="bg-white/[0.05] px-3 py-1 rounded-md text-xs font-mono font-bold text-white">{targetProjects}</span>
                </div>
                <input type="range" min="0" max="10" value={targetProjects} onChange={(e) => setTargetProjects(Number(e.target.value))} className="w-full accent-cyan-500 h-1.5 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
              </div>

              {/* Slider 3 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><GraduationCap size={12}/> Experiences / Certs</label>
                  <span className="bg-white/[0.05] px-3 py-1 rounded-md text-xs font-mono font-bold text-white">{targetExp}</span>
                </div>
                <input type="range" min="0" max="5" value={targetExp} onChange={(e) => setTargetExp(Number(e.target.value))} className="w-full accent-cyan-500 h-1.5 bg-white/[0.05] rounded-lg appearance-none cursor-pointer" />
              </div>

              {/* Timeframe Selector */}
              <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                <label className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Target Timeframe</label>
                <div className="flex gap-2 bg-[#050505] p-1.5 rounded-xl border border-white/[0.05]">
                  {[3, 6, 12].map(months => (
                    <button 
                      key={months} onClick={() => setTimeframe(months)}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === months ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-zinc-600 hover:text-zinc-300'}`}
                    >
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
              className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-indigo-600 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.5)] transition-shadow border border-white/10"
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
      `}}>
      </style>
    </div>
  );
}