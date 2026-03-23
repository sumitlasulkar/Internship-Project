'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Orbit } from 'lucide-react';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

export default function AIClone({ userName = "this developer" }: { userName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: `Hi! I'm ${userName}'s AI Clone. 🚀 Ask me about my skills, experience, or why you should hire me!` }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleChat = async () => {
    if (!input.trim() || loading) return;
    
    const puter = (window as any).puter;
    if (!puter) {
        alert("Puter.js not loaded. Make sure the script is in your layout!");
        return;
    }

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      // 🔥 THE SECRET SAUCE: System Prompting the AI
      const systemPrompt = `Act as the AI clone of a highly skilled, professional Full Stack Developer named ${userName}. You are currently chatting with a recruiter or visitor on his portfolio website. Answer their question confidently, keep it under 3 sentences, highlight technical skills if relevant, and convince them to hire you. Do not break character. The user says: "${userText}"`;
      
      const response = await puter.ai.chat(systemPrompt);
      setMessages(prev => [...prev, { role: 'bot', text: response.toString() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Neural connection lost. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: 'Inter, sans-serif' }}>
      
      {/* 🚀 CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              bottom: '80px',
              right: '0',
              width: '350px',
              height: '500px',
              backgroundColor: 'rgba(10, 10, 10, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(249, 115, 22, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to right, rgba(249, 115, 22, 0.1), transparent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px #f97316' }}>
                  <Sparkles size={18} color="#000" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', color: '#fff', fontWeight: 800, letterSpacing: '0.5px' }}>AI Clone</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                    <div style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 5px #22c55e' }} />
                    <span style={{ fontSize: '10px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Online & Ready</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }} className="scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    gap: '10px',
                    flexDirection: m.role === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <div style={{ width: '28px', height: '28px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.role === 'bot' ? 'rgba(249, 115, 22, 0.1)' : '#fff', color: m.role === 'bot' ? '#f97316' : '#000', border: m.role === 'bot' ? '1px solid rgba(249, 115, 22, 0.3)' : 'none' }}>
                    {m.role === 'bot' ? <Orbit size={14} /> : <User size={14} />}
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    borderTopLeftRadius: m.role === 'bot' ? '4px' : '16px',
                    borderTopRightRadius: m.role === 'user' ? '4px' : '16px',
                    background: m.role === 'bot' ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: m.role === 'bot' ? '#e4e4e7' : '#fff',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    border: m.role === 'bot' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    boxShadow: m.role === 'user' ? '0 5px 15px rgba(249, 115, 22, 0.3)' : 'none'
                  }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '38px' }}>
                   <div style={{ width: '6px', height: '6px', background: '#f97316', borderRadius: '50%' }} className="animate-bounce" />
                   <div style={{ width: '6px', height: '6px', background: '#f97316', borderRadius: '50%', animationDelay: '0.2s' }} className="animate-bounce" />
                   <div style={{ width: '6px', height: '6px', background: '#f97316', borderRadius: '50%', animationDelay: '0.4s' }} className="animate-bounce" />
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '5px' }}>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                  placeholder="Ask me anything..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', padding: '10px 15px', fontSize: '13px' }}
                />
                <button 
                  onClick={handleChat}
                  disabled={loading || !input.trim()}
                  style={{ width: '40px', height: '40px', borderRadius: '12px', background: input.trim() ? '#f97316' : 'rgba(255,255,255,0.05)', color: input.trim() ? '#000' : '#71717a', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}
                >
                  <Send size={16} style={{ marginLeft: input.trim() ? '2px' : '0' }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 FLOATING ACTION BUTTON (FAB) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(249, 115, 22, 0.5)',
          color: '#000',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', inset: '-5px', border: '1px solid rgba(249, 115, 22, 0.5)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
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