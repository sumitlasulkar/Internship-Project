'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from "./t1.module.css";
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Youtube } from 'lucide-react';
import AIClone from '@/app/AIClone.tsx/page';

interface Skill { category: string; items: string; }
interface ExperienceItem { name: string; description: string; issuedBy: string; note: string; }
interface ProjectItem { name: string; description: string; techStack: string; note: string; link?: string; }
interface EducationItem { name: string; year: string; grade: string; college: string; university: string; note: string; }

interface PortfolioData {
  profilePic: string; cv: string; mobile: string; gmail: string; youtube: string;
  github: string; linkedin: string; careerObjectives: string; pronoun: string;
  city: string; age: string; profession: string; nationality: string;
  birthday: string; aboutIntro: string; aboutSubheader: string; aboutHeader: string;
  tagline: string; experiences: ExperienceItem[]; projects: ProjectItem[];
  education: EducationItem[]; skills: Skill[]; name?: string;
}

// --- ANIMATION VARIANTS (Fixed TypeScript Errors) ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function TemplateOne({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Smart Sticky Header Logic
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) {
    return (
      <div className={styles.loadingScreen}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className={styles.loader} />
        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>Initializing Profile...</motion.p>
      </div>
    );
  }

  return (
    <div className={styles.tmp}>
      {/* SCROLL PROGRESS BAR */}
      <motion.div className={styles.progressBar} style={{ scaleX }} />

      {/* SMART STICKY HEADER */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <Link href="/" className={styles.logoLink}>
          <motion.img 
            whileHover={{ scale: 1.1, rotate: 5 }}
            src={data?.profilePic || "/default-avatar.png"} 
            className={styles.logo} 
            alt="logo" 
          />
        </Link>

        <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </div>

        <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
          {['home', 'about', 'skills', 'education', 'projects', 'experience', 'contacts'].map((item) => (
            <a key={item} href={`#${item}`} className={item === 'contacts' ? styles.contactBtn : styles.button} onClick={() => setMenuOpen(false)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className={styles.home} id='home'>
        <motion.div className={styles.heroContent} initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className={styles.badge}>
            <span className={styles.pulseDot} /> Available for Opportunities
          </motion.div>
          <motion.h1 className={styles.name} variants={fadeInUp}>
            {data?.name || "Your Name"}
          </motion.h1>
          <motion.h2 className={styles.tagline} variants={fadeInUp}>
            {data?.tagline || "Visionary Developer & Creator"}
          </motion.h2>
          <motion.div className={styles.hero_buttons} variants={fadeInUp}>
            <a href="#contacts" className={styles.primaryBtn}>
              Initialize Contact <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a href={data?.cv || "#"} target="_blank" rel="noreferrer" className={styles.secondaryBtn}>
              <Download className="w-4 h-4 mr-2" /> View Resume
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp}>
        <span>01.</span> About Me
      </motion.div>
      <section className={styles.about} id='about'>
        <motion.div className={styles.about_header_text} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h3 className={styles.aboutHeader}>{data?.aboutHeader || "Your About Header"}</h3>
          <p className={styles.aboutSubheader}>{data?.aboutSubheader || "Your About Subheader"}</p>
        </motion.div>
        
        <div className={styles.about_mainbx}>
          <motion.div className={styles.about_img_wrapper} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, type: "spring" }}>
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
              <img src={data?.profilePic || "/default-avatar.png"} alt="profile" className={styles.about_img} />
              <div className={styles.img_glow}></div>
            </motion.div>
          </motion.div>
          
          <motion.div className={styles.about_sumit} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={staggerItem} className={styles.about_name}>{data?.name || "Your Name"}</motion.h2>
            <motion.p variants={staggerItem} className={styles.about_intro}>{data?.aboutIntro || "Intro text..."}</motion.p>
            
            <motion.div variants={staggerItem} className={styles.myinfo}>
              <ul className={styles.mi_list}>
                <li><span className={styles.highlight}>Birthday:</span> {data?.birthday || "..."}</li>
                <li><span className={styles.highlight}>Age:</span> {data?.age || "..."}</li>
                <li><span className={styles.highlight}>Pronoun:</span> {data?.pronoun || "..."}</li>
                <li><span className={styles.highlight}>City:</span> {data?.city || "..."}</li>
                <li><span className={styles.highlight}>Available:</span> Freelance</li>
              </ul>
              <ul className={styles.mi_list}>
                <li><span className={styles.highlight}>Profession:</span> {data?.profession || "..."}</li>
                <li><span className={styles.highlight}>Nationality:</span> {data?.nationality || "..."}</li>
                <li><span className={styles.highlight}>Available:</span> Full-time Job</li>
              </ul>
            </motion.div>
            
            <motion.div variants={staggerItem} className={styles.career_obj}>
              <span className={styles.highlight}>Career Objectives:</span> {data?.careerObjectives || "..."}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SKILLS SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>02.</span> Skills
      </motion.div>
      <section className={styles.skills} id='skills'>
        <motion.div className={styles.skill_grid} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}>
          {Array.isArray(data?.skills) && data.skills.map((skill, index) => (
            <motion.div key={index} className={styles.skill_card} variants={staggerItem} whileHover={{ y: -8, scale: 1.02 }}>
              <div className={styles.card_glow} />
              <h3 className={styles.skill_category}>{skill.category}</h3>
              <div className={styles.skill_items}>
                {skill.items.split(',').map((item, i) => (
                  <span key={i} className={styles.skill_badge}>{item.trim()}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* EDUCATION SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>03.</span> Education
      </motion.div>
      <section className={styles.education} id='education'>
        <motion.div className={styles.timeline_grid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {Array.isArray(data?.education) ? (
            data.education.map((edu: any, index: number) => (
              <motion.div key={index} className={styles.timeline_card} variants={staggerItem} whileHover={{ y: -5 }}>
                <div className={styles.card_glow} />
                <div className={styles.card_header_flex}>
                  <h2 className={styles.card_title}>{edu.name}</h2>
                  <span className={styles.card_badge}>{edu.year}</span>
                </div>
                <h4 className={styles.card_subtitle}>{edu.college} | {edu.university}</h4>
                <p className={styles.card_grade}>Grade: <span>{edu.grade}</span></p>
                <p className={styles.card_desc}>{edu.note}</p>
              </motion.div>
            ))
          ) : null}
        </motion.div>
      </section>

      {/* PROJECTS SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>04.</span> Projects
      </motion.div>
      <section className={styles.projects} id='projects'>
        <motion.div className={styles.bento_grid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {Array.isArray(data?.projects) ? (
            data.projects.map((proj: any, index: number) => (
              <motion.div key={index} className={styles.bento_card} variants={staggerItem} whileHover={{ y: -8 }}>
                <div className={styles.card_glow} />
                <h2 className={styles.card_title}>{proj.name}</h2>
                <p className={styles.card_desc}>{proj.description}</p>
                <div className={styles.tech_stack}>
                  {proj.techStack?.split(',').map((tech: string, i: number) => (
                    <span key={i} className={styles.tech_badge}>{tech.trim()}</span>
                  ))}
                </div>
                {proj.note && <p className={styles.card_note}>{proj.note}</p>}
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className={styles.card_link}>
                    View Project <ArrowRight className="w-3 h-3 inline ml-1" />
                  </a>
                )}
              </motion.div>
            ))
          ) : null}
        </motion.div>
      </section>

      {/* EXPERIENCE SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>05.</span> Experiences (Certificates)
      </motion.div>
      <section className={styles.experience} id='experience'>
        <motion.div className={styles.timeline_grid} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          {Array.isArray(data?.experiences) ? (
            data.experiences.map((exp: any, index: number) => (
              <motion.div key={index} className={styles.timeline_card} variants={staggerItem} whileHover={{ y: -5 }}>
                <div className={styles.card_glow} />
                <h2 className={styles.card_title}>{exp.name}</h2>
                <h4 className={styles.card_subtitle_highlight}>Issued By: {exp.issuedBy}</h4>
                <p className={styles.card_desc}>{exp.description}</p>
                {exp.note && <p className={styles.card_note_box}>{exp.note}</p>}
              </motion.div>
            ))
          ) : null}
        </motion.div>
      </section>

      {/* CONTACTS SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>06.</span> Contacts
      </motion.div>
      <section className={styles.contacts} id='contacts'>
        <motion.div className={styles.contact_container} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className={styles.contact_text_area}>
            <h2 className={styles.contact_title}>For any Query and Service Contact us!</h2>
            <p className={styles.contact_p}>I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
            <a href={`mailto:${data?.gmail}`} className={styles.primaryBtn}>
              <Mail className="w-4 h-4 mr-2 inline" /> Email Me
            </a>
          </div>
          
          <motion.div className={styles.contact_links_grid} variants={staggerContainer}>
             <motion.a variants={staggerItem} href={data?.linkedin || "#"} target="_blank" rel="noreferrer" className={styles.social_card}>
                <span className={styles.social_label}>LinkedIn</span>
                <span className={styles.social_action}>+ Connect</span>
             </motion.a>
             <motion.a variants={staggerItem} href={data?.github || "#"} target="_blank" rel="noreferrer" className={styles.social_card}>
                <span className={styles.social_label}>GitHub</span>
                <span className={styles.social_action}>+ Follow</span>
             </motion.a>
             <motion.a variants={staggerItem} href={data?.youtube || "#"} target="_blank" rel="noreferrer" className={styles.social_card}>
                <span className={styles.social_label}>Social Media</span>
                <span className={styles.social_action}>+ Follow</span>
             </motion.a>
             <motion.a variants={staggerItem} href={data?.cv || "#"} target="_blank" rel="noreferrer" className={styles.social_card}>
                <span className={styles.social_label}>Resume / CV</span>
                <span className={styles.social_action}>Download ⬇</span>
             </motion.a>
             <motion.div variants={staggerItem} className={styles.social_card_static}>
                <span className={styles.social_label}>Gmail</span>
                <span className={styles.social_value}>{data?.gmail || "Not Provided"}</span>
             </motion.div>
             <motion.div variants={staggerItem} className={styles.social_card_static}>
                <span className={styles.social_label}>Mobile</span>
                <span className={styles.social_value}>{data?.mobile || "Not Provided"}</span>
             </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ... Baki saara code (Contacts, Experience, etc.) ... */}
      
      {/* 🤖 THE ULTIMATE FLEX: AI CLONE WIDGET */}
      <AIClone userName={data?.name} />

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>Engineered & Built by <span className={styles.highlight}>{data?.name || "You"}</span></p>
        <p className={styles.footer_copy}>© {new Date().getFullYear()} All Rights Reserved.</p>
      </footer>
    </div>
  );
}
