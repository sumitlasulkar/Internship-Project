'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Rocket, Briefcase, Terminal, FileText, Sparkles, 
  Zap, BarChart3, Binary, Workflow, 
  CheckCircle2, Activity, Cpu, Compass, ArrowRight 
} from 'lucide-react';
import Header from '../Home/header';
import Footer from '../Home/Footer';
const guidanceData = [
  {
    id: 'startup',
    title: 'Startup_Blueprint',
    icon: Rocket,
    accent: '#ea580c',
    stats: [ { label: 'Equity Potential', val: 98 }, { label: 'Market Velocity', val: 85 }, { label: 'Capital Burn', val: 40 } ],
    roadmap: [
      { t: 'Phase_01: First Principles', d: 'Identify core technical inefficiencies. Break down complex markets into basic truths before coding.' },
      { t: 'Phase_02: Lean Validation', d: 'Execute the 100-User Rule. Secure pre-launch commitments to confirm Product-Market Fit.' },
      { t: 'Phase_03: Institutional Scale', d: 'Deploy high-availability architecture. Focus on growth metrics and pitch to Tier-1 VCs.' }
    ]
  },
  {
    id: 'freelance',
    title: 'Freelance_Matrix',
    icon: Terminal,
    accent: '#2563eb',
    stats: [ { label: 'Hourly Value', val: 92 }, { label: 'Market Demand', val: 88 }, { label: 'Sales Friction', val: 70 } ],
    roadmap: [
      { t: 'Phase_01: Niche Mastery', d: 'Master high-ticket stacks like AI/LLM integration, Cloud Native, or Fintech Infra.' },
      { t: 'Phase_02: Authority Assets', d: 'Build flagship case studies. Your public GitHub repository is your ultimate proof of work.' },
      { t: 'Phase_03: Value Retainers', d: 'Pivot from hourly billing to impact-based retainers. Bill for the result, not the effort.' }
    ]
  },
  {
    id: 'jobs',
    title: 'Job_Protocol',
    icon: Briefcase,
    accent: '#10b981',
    stats: [ { label: 'Base Stability', val: 95 }, { label: 'Equity Vested', val: 50 }, { label: 'Network Reach', val: 90 } ],
    roadmap: [
      { t: 'Phase_01: Engine Tuning', d: 'ATS-Optimized profile. Quantify impact with hard metrics (e.g., 30% Latency Reduction).' },
      { t: 'Phase_02: Referral Loops', d: 'Engineer warm introductions through strategic networking nodes instead of generic portals.' },
      { t: 'Phase_03: Boardroom Mastery', d: 'Dominate HLD/LLD rounds and behavioral leadership evaluations at global tech giants.' }
    ]
  }
];

export default function GuidancePage() {
  const [activeTab, setActiveTab] = useState('startup');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const active = guidanceData.find(g => g.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-orange-600/30 overflow-x-hidden">
      {/* 🔥 Sticky Header Fix */}
      <div className="fixed top-0 left-0 w-full z-[100] border-b border-white/5 backdrop-blur-md">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto pt-40 md:pt-52 px-6 pb-32 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-zinc-500 mb-6 bg-white/5 w-fit px-4 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-orange-500" />
              Strategy_Module_v6.0
            </div>
            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8]">
              GUIDE<span style={{ color: active.accent }} className="transition-colors duration-500">.</span>
            </h1>
          </motion.div>

          {/* --- TABS WITH LAYOUT ANIMATION --- */}
          <LayoutGroup>
            <div className="flex bg-zinc-900/80 p-1.5 rounded-[2rem] border border-white/5 w-full lg:w-auto overflow-x-auto scrollbar-hide shadow-2xl relative">
              {guidanceData.map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 lg:flex-none px-8 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all relative z-10 ${activeTab === item.id ? 'text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="tab-pill"
                      className="absolute inset-0 bg-white rounded-[1.6rem] z-[-1]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {item.id}
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* STATS PANEL */}
          <motion.div 
            key={activeTab + "stats"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] backdrop-blur-3xl"
          >
            <div className="flex items-center gap-3 mb-10 text-zinc-500 font-black uppercase text-[10px] tracking-tighter">
              <BarChart3 className="w-4 h-4" /> Trajectory_Logic
            </div>
            <div className="space-y-10">
              {active.stats.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-3 items-end">
                    <span className="text-[10px] font-bold uppercase text-zinc-500">{s.label}</span>
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xl font-black italic" 
                      style={{ color: active.accent }}
                    >
                      {s.val}%
                    </motion.span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${s.val}%` }}
                      transition={{ duration: 1, ease: "circOut" }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: active.accent }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ROADMAP SECTION */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex items-center gap-3 mb-10 text-zinc-500 font-black uppercase text-[10px]">
              <Workflow className="w-4 h-4" /> Sequence_Architecture
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {active.roadmap.map((step, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-6 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                    >
                      <div className="text-3xl font-black italic text-zinc-800 uppercase group-hover:text-zinc-600 transition-colors">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xl font-black italic uppercase text-white mb-2 group-hover:text-orange-500 transition-colors">
                          {step.t}
                        </h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">{step.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- CARDS SECTION --- */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 hover:border-orange-500/20 transition-all"
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-orange-600/10 rounded-2xl">
                <FileText className="w-6 h-6 text-orange-500"/>
               </div>
               <h3 className="text-2xl font-black italic uppercase">Resume_Protocol</h3>
            </div>
            <ul className="space-y-4 text-zinc-400 text-sm font-medium">
               {[
                 'Metric-driven impact results.',
                 'ATS-compatible clean structure.',
                 'GitHub / Portfolio links embedded.'
               ].map((item, i) => (
                 <li key={i} className="flex gap-3 items-center">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0"/> {item}
                 </li>
               ))}
            </ul>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-10 rounded-[3rem] bg-zinc-900/40 border border-white/5 hover:border-blue-500/20 transition-all"
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-blue-600/10 rounded-2xl">
                <Zap className="w-6 h-6 text-blue-500"/>
               </div>
               <h3 className="text-2xl font-black italic uppercase">Social_Sync</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {['Cold DM 2.0', 'Build Public', 'Referrals', 'Authority'].map((t, i) => (
                 <motion.div 
                   key={t} 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[9px] font-black uppercase text-zinc-400 text-center hover:bg-white/10 transition-all cursor-default"
                 >
                   {t}
                 </motion.div>
               ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* --- HUD DECORATION --- */}
      <div className="fixed bottom-8 left-8 opacity-20 hidden md:flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">System_Sync_Active</span>
      </div>
    <Footer/>
    </div>
  );
}