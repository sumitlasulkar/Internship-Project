'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, MessageSquare, Send, User, Zap, 
  ShieldCheck, Instagram, Twitter, Linkedin, Github, 
  ArrowUpRight, Globe, Activity, Phone, Smartphone, AtSign
} from 'lucide-react';
import Footer from '../Home/Footer';
import Header from '../Home/header';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        timestamp: serverTimestamp()
      });
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (error) {
      console.error(error);
      alert("System Error: Check Neural Connection.");
    }
    setLoading(false);
  };

  const socialLinks = [
    { name: 'YouTube', icon: Instagram, url: 'https://www.youtube.com/@ThinkHatchStudio' },
    { name: 'YouTube', icon: Twitter, url: 'https://www.youtube.com/@Crafters.think_hatch' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/sumit-lasulkar-57931b308/' },
    { name: 'Github', icon: Github, url: 'https://github.com/sumitlasulkar' },
  ];

  return (
    <>
    <Header/>
    <section className="py-32 px-6 bg-[#020202] relative overflow-hidden selection:bg-orange-600/30" id="contact">
        
      {/* 🌌 High-Performance Background Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.1, 0.2, 0.1],
          rotate: [0, 90, 0] 
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 blur-[160px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2], 
          opacity: [0.05, 0.12, 0.05],
          rotate: [0, -90, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[160px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
        
        {/* --- LEFT: CORE CONTACT & SOCIALS --- */}
        <div className="lg:col-span-5 space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 text-orange-500 font-black text-[10px] uppercase tracking-[0.4em]">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Establish_Contact_Node
            </div>
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
              SAY<br /><span className="text-orange-600">HELLO.</span>
            </h2>
            <p className="text-zinc-500 text-lg font-medium max-w-sm leading-relaxed border-l-2 border-white/5 pl-6">
              Ready to scale your next big idea? Drop a line into the neural network.
            </p>
          </motion.div>

          {/* 📡 Direct Access Nodes (Gmail & Phone) */}
          <div className="space-y-4">
             <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Access_Points</p>
             <div className="space-y-3">
                <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all group">
                   <div className="p-4 bg-orange-600/10 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
                      <AtSign className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol_Email</p>
                      <p className="text-white font-bold text-sm md:text-base">sumit.lasulkar4u@gmail.com</p>
                   </div>
                </motion.div>

                <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all group">
                   <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
                      <Smartphone className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Mobile_Uplink</p>
                      <p className="text-white font-bold text-sm md:text-base">+91 8007299291</p>
                   </div>
                </motion.div>
             </div>
          </div>

          {/* 🌐 Social Grid */}
          <div className="space-y-4 pt-6">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-2">Social_Matrix</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.04)" }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 group transition-colors"
                >
                  <social.icon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                  <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white">{social.name}</span>
                  <ArrowUpRight className="w-3 h-3 text-zinc-800 group-hover:text-orange-500" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: THE INTERACTIVE FORM --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-7 bg-white/[0.02] border border-white/10 p-8 md:p-14 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 tracking-widest flex items-center gap-2">
                   <User className="w-3 h-3" /> Identity_Tag
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none focus:border-orange-600/50 focus:bg-black/60 transition-all font-medium placeholder:text-zinc-700"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 tracking-widest flex items-center gap-2">
                   <Mail className="w-3 h-3" /> Digital_Address
                </label>
                <input 
                  required
                  type="email" 
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none focus:border-orange-600/50 focus:bg-black/60 transition-all font-medium placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-500 ml-4 tracking-widest flex items-center gap-2">
                 <MessageSquare className="w-3 h-3" /> Mission_Payload
              </label>
              <textarea 
                required
                rows={5}
                placeholder="What are we building today? Describe the objective..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-black/40 border border-white/5 p-6 rounded-3xl text-white outline-none focus:border-orange-600/50 focus:bg-black/60 transition-all font-medium resize-none placeholder:text-zinc-700"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="w-full bg-white text-black py-7 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-orange-600 hover:text-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)] disabled:opacity-50"
            >
              {loading ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : sent ? (
                <>Transmission_Complete <ShieldCheck className="w-5 h-5 text-green-500" /></>
              ) : (
                <>Execute_Transmission <Send className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>
        </motion.div>

      </div>

      {/* --- HUD DECORATION --- */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4 opacity-10 pointer-events-none hidden md:flex">
        <div className="h-[1px] w-20 bg-white" />
        <div className="text-[9px] font-black uppercase tracking-[0.5em]">Terminal_Guidance_Active</div>
      </div>
      
    </section>
    <Footer/>
    </>
  );
}