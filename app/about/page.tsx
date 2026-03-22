'use client';
import { motion } from 'framer-motion';
import { 
  Briefcase, Zap, Target, Code2, Cpu, Award, Terminal, 
  User, Sparkles, Shield, BarChart, Layers, Globe, Database, List, CheckCircle2,
  BookOpen, Rocket, Lightbulb, Workflow, ArrowLeft
} from 'lucide-react';
import Header from '../Home/header';
import Footer from '../Home/Footer';
import './about.css'; 

const indexItems = [
  { id: "internship", label: "1. Internship Overview" },
  { id: "thinkhatch", label: "2. Thinkhatch Resume" },
  { id: "sdlc", label: "3. SDLC (Lifecycle)" },
  { id: "modules", label: "4. Core System Modules" },
  { id: "features", label: "5. Core System Features" },
  { id: "benefits", label: "6. System Benefits & Capabilities" },
  { id: "outcomes", label: "7. Key Project Outcomes" },
  { id: "learnings", label: "8. Technical & Professional Learnings" },
  { id: "conclusion", label: "Conclusion" },
];

export default function MegaPresentation() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reusable component for "Back to Index" link
  const BackToIndex = () => (
    <button onClick={() => scrollTo('index')} className="back-link">
      <ArrowLeft size={12} /> Back to Index
    </button>
  );

  return (
    <div className="about-wrapper">
      <Header />
      <main className="about-main">
        
        {/* --- SLIDE 1: FRONT PAGE (LOGO CENTERED) --- */}
        <section className="about-hero" id="top">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="hero-inner">
            <div className="college-header-centered">
               <img src="/college_logo.jpg" alt="GCOERC Logo" className="clg-logo-main" />
               <p className="clg-name">Guru Gobind Singh College of Engineering and Research Centre, Nashik</p>
            </div>
            <h1 className="about-title">Thinkhatch <span>Resume.</span></h1>
            
            <div className="presentation-credits">
               <div className="credit-block">
                  <span className="label">Presented by</span>
                  <p className="val">Sumit Sunil Lasulkar</p>
                  <p className="sub-val">Computer Engineering | TECO - A - 69</p>
               </div>
               <div className="credit-block">
                  <span className="label">Under the Guidance of</span>
                  <p className="val">Professor. Pradnya Shirsath</p>
                  <p className="sub-val">Dept. of Computer Engineering, GCOERC</p>
               </div>
            </div>
            <div className="year-footer">Academic Year: 2025 - 2026</div>
          </motion.div>
        </section>

        {/* --- SLIDE 2: INTERACTIVE INDEX --- */}
        <section className="index-section" id="index">
          <div className="section-tag"><List size={14} /> Global_Index</div>
          <h2 className="section-heading">Project Roadmap</h2>
          <div className="index-grid">
            {indexItems.map((item, i) => (
              <motion.div 
                whileHover={{ x: 10, backgroundColor: "rgba(59, 130, 246, 0.15)", borderColor: "#3b82f6" }}
                key={i} 
                onClick={() => scrollTo(item.id)}
                className="index-card"
              >
                <span>{item.label}</span>
                <div className="dot"></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- 1. INTERNSHIP DETAILS --- */}
        <section className="content-slide" id="internship">
           <BackToIndex />
           <div className="slide-card">
              <div className="card-header"><Briefcase className="text-blue-500" /> <h2>Internship Details</h2></div>
              <div className="card-body">
                 <p className="focus-text">Internship is for <b>Full Stack Development</b></p>
                 <div className="topic-box">
                    <h4>Covers Topics:</h4>
                    <div className="tags">
                       <span>Frontend</span><span>Backend</span><span>APIs</span><span>Databases</span><span>Hosting</span><span>And Much More</span>
                    </div>
                 </div>
                 <div className="project-link-info">
                    <h4>Project:</h4>
                    <p className="project-name">Thinkhatch Resume Platform</p>
                 </div>
              </div>
           </div>
        </section>

        {/* --- 2. PROJECT DESCRIPTION --- */}
        <section className="content-slide" id="thinkhatch">
           <BackToIndex />
           <div className="slide-card highlight">
              <div className="card-header"><Sparkles className="text-blue-500" /> <h2>Thinkhatch Resume</h2></div>
              <div className="card-body">
                 <p className="description-para">
                    <b>Thinkhatch</b> is a futuristic, all-in-one career intelligence platform designed to bridge the gap between emerging talent and the modern corporate world. At its core, the system features a <b>Neural ATS Optimizer</b> that algorithmically analyzes resumes to provide candidates with strategic insights. To ensure a seamless user experience, it integrates an <b>Intelligent Assistant</b> for real-time career guidance. Beyond resume building, Thinkhatch operates as a <b>Dynamic Opportunities Hub</b> and a complete <b>Digital Career OS</b> focused on automating professional growth.
                 </p>
              </div>
           </div>
        </section>

        {/* --- 3. SDLC --- */}
        <section className="content-slide" id="sdlc">
           <BackToIndex />
           <div className="section-tag"><Workflow size={14} /> Dev_Lifecycle</div>
           <h2 className="section-heading">Software Development Life Cycle</h2>
           <div className="sdlc-list">
              {[
                { p: "Phase 1: Requirement Analysis & Planning", o: "Objective: Identifying pain points in traditional hiring.", r: "Outcome: Finalized the need for an AI-driven ATS scorer." },
                { p: "Phase 2: System Architecture & Design", o: "Tech Strategy: Serverless architecture (NoSQL).", r: "Logic Flow: Designed Neural Core for secure AI interfacing." },
                { p: "Phase 3: Implementation & Coding", o: "Modular Build: Portfolio, Community Hub, and ATS Engine.", r: "Security: Enforced strict rules for data isolation." },
                { p: "Phase 4: Quality Assurance & Testing", o: "Testing: Verified responsive layouts (Mobile/Desktop).", r: "Logic Verification: Stress-tested AI accuracy and write permissions." },
                { p: "Phase 5: Deployment & Integration", o: "Edge Hosting: Leveraged global CDN for low-latency.", r: "CI/CD: Automatic deployment via GitHub." }
              ].map((step, i) => (
                <div key={i} className="sdlc-row">
                   <div className="sdlc-title">{step.p}</div>
                   <div className="sdlc-desc">
                      <p><b>→</b> {step.o}</p>
                      <p><b>→</b> {step.r}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* --- 4. CORE SYSTEM MODULES --- */}
        <section className="content-slide" id="modules">
           <BackToIndex />
           <div className="section-tag"><Layers size={14} /> Architecture_Blocks</div>
           <h2 className="section-heading">Core System Modules</h2>
           <div className="module-grid">
              {[
                { id: "1", t: "Centralized Dashboard", d: "Manage professional identity with a bird's-eye view of stats." },
                { id: "2", t: "Smart Portfolio Engine", d: "CMS for building high-end, responsive web portfolios." },
                { id: "3", t: "Neural ATS Checker", d: "Uses NLP to scan resumes against specific job descriptions." },
                { id: "4", t: "Opportunities Hub", d: "A bridge for job matching and internship discovery." },
                { id: "5", t: "Unity Community", d: "Peer-to-peer networking and professional discussions." },
                { id: "6", t: "Neural-Sync AI Chatbot", d: "24/7 personalized coaching and support via LLMs." },
                { id: "7", t: "Utility Framework", d: "Header, Footer, Policies, and Secure Inquiry Vault." }
              ].map((m, i) => (
                <div key={i} className="module-card">
                   <span className="num">{m.id}</span>
                   <h3>{m.t}</h3>
                   <p>{m.d}</p>
                </div>
              ))}
           </div>
        </section>

        {/* --- 5. CORE SYSTEM FEATURES --- */}
        <section className="content-slide" id="features">
           <BackToIndex />
           <div className="section-tag"><Zap size={14} /> Core_Features</div>
           <h2 className="section-heading">Thinkhatch: Core System Features</h2>
           <div className="feature-list-custom">
              {[
                { t: "Intelligent Dashboard", d: "Real-time analytics and unified tool access." },
                { t: "Resume Architect", d: "Dynamic CMS with industry-standard templates." },
                { t: "Neural ATS Scorer", d: "Keyword optimization and compatibility match score." },
                { t: "Global Grow Hub", d: "Live job matching and real-time database sync." },
                { t: "Developer Community", d: "Collaborative networking and knowledge exchange." },
                { t: "Virtual Assistant", d: "24/7 Career coaching and automated navigation." },
                { t: "Utility Framework", d: "Secure Inquiry Vault and Compliance Ethics." }
              ].map((f, i) => (
                <div key={i} className="feat-item">
                   <div className="feat-bullet"><CheckCircle2 size={16} /></div>
                   <div className="feat-text"><b>{f.t}:</b> {f.d}</div>
                </div>
              ))}
           </div>
        </section>

        {/* --- 6. BENEFITS & CAPABILITIES --- */}
        <section className="content-slide" id="benefits">
           <BackToIndex />
           <div className="benefits-capabilities">
              <div className="side-box">
                 <h3>System Benefits</h3>
                 <ul>
                    <li><b>Algorithmic Competitive Edge:</b> Higher interview call rates.</li>
                    <li><b>Identity Branding:</b> 24/7 digital footprint.</li>
                    <li><b>Seamless Growth:</b> Direct job matching transition.</li>
                    <li><b>Data-Driven Guidance:</b> Eliminates information gaps.</li>
                    <li><b>Zero-Trust Security:</b> Enterprise-grade isolation.</li>
                 </ul>
              </div>
              <div className="side-box">
                 <h3>Technical Capabilities</h3>
                 <ul>
                    <li><b>Heuristic Processing:</b> Parses complex structures.</li>
                    <li><b>Autonomous Intel:</b> Natural language workflows.</li>
                    <li><b>Real-Time Sync:</b> NoSQL concurrent updates.</li>
                    <li><b>Scalable Multi-Tenancy:</b> Hosts 1000s of portfolios.</li>
                    <li><b>Edge Delivery:</b> Low-latency global access.</li>
                 </ul>
              </div>
           </div>
        </section>

        {/* --- 7 & 8. OUTCOMES & LEARNINGS --- */}
        <section className="content-slide" id="outcomes">
           <BackToIndex />
           <div className="dual-grid">
              <div className="box outcome-box">
                 <div className="box-header"><Rocket size={20} /> <h2>Project Outcomes</h2></div>
                 <ul className="list-v2">
                    <li>Successful AI Integration with Neural Core.</li>
                    <li>End-to-End Secure Architecture for data privacy.</li>
                    <li>High-Performance Global Deployment on Vercel.</li>
                    <li>Live Community Engagement & Real-time Updates.</li>
                    <li>Automated Professional Career Branding.</li>
                 </ul>
              </div>
              <div className="box learning-box" id="learnings">
                 <div className="box-header"><BookOpen size={20} /> <h2>Professional Learnings</h2></div>
                 <ul className="list-v2">
                    <li>Mastering Full Stack (Next.js & Firebase).</li>
                    <li>AI Implementation & Prompt Engineering Patterns.</li>
                    <li>Security-First Backend Development.</li>
                    <li>Agile SDLC Problem Solving & QA Testing.</li>
                    <li>Industry Standards of ATS Dynamics.</li>
                    <li>User-Centric Responsive UI/UX Design.</li>
                 </ul>
              </div>
           </div>
        </section>

        {/* --- CONCLUSION --- */}
        <section className="content-slide conclusion-final" id="conclusion">
           <div className="final-card">
              <h2 className="section-heading">Conclusion</h2>
              <p>
                 Thinkhatch represents a paradigm shift in how professional identities are managed and discovered. This project successfully automates critical aspects of the recruitment lifecycle. Moving forward, the platform is designed for infinite scalability, with plans to integrate advanced networking and verified digital credentialing, making it a truly intelligent bridge to global opportunities.
              </p>
              <button className="top-btn" onClick={() => scrollTo('top')}>End Presentation</button>
           </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}