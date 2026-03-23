'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from "./t1.module.css";

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

// 🚀 FIXED: Added 'as const' to resolve TypeScript Easing error
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function TemplateOne({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!data) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loader}></div>
        <p>Initializing Profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.tmp}>
      {/* HEADER */}
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <img src={data?.profilePic || "/default-avatar.png"} className={styles.logo} alt="logo" />
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
      <motion.section className={styles.home} id='home' initial="hidden" animate="visible" variants={fadeInUp}>
        <div className={styles.heroContent}>
          <motion.h1 className={styles.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            {data?.name || "Your Name"}
          </motion.h1>
          <motion.h2 className={styles.tagline} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {data?.tagline || "Visionary Developer & Creator"}
          </motion.h2>
          <motion.div className={styles.hero_buttons} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <a href="#contacts" className={styles.primaryBtn}>Initialize Contact</a>
            <a href={data?.cv || "#"} target="_blank" rel="noreferrer" className={styles.secondaryBtn}>View Resume</a>
          </motion.div>
        </div>
      </motion.section>

      {/* ABOUT SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>01.</span> About Me
      </motion.div>
      <motion.section className={styles.about} id='about' initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
        <div className={styles.about_header_text}>
          <h3 className={styles.aboutHeader}>{data?.aboutHeader || "Discover My Journey"}</h3>
          <p className={styles.aboutSubheader}>{data?.aboutSubheader || "Passionate about building digital experiences."}</p>
        </div>
        
        <div className={styles.about_mainbx}>
          <div className={styles.about_img_wrapper}>
            <img src={data?.profilePic || "/default-avatar.png"} alt="profile" className={styles.about_img} />
            <div className={styles.img_glow}></div>
          </div>
          
          <div className={styles.about_sumit}>
            <h2 className={styles.about_name}>{data?.name || "Hello, World!"}</h2>
            <p className={styles.about_intro}>{data?.aboutIntro || "I build things for the web."}</p>
            
            <div className={styles.myinfo}>
              <ul className={styles.mi_list}>
                <li><span className={styles.highlight}>Age:</span> {data?.age || "..."}</li>
                <li><span className={styles.highlight}>Pronouns:</span> {data?.pronoun || "..."}</li>
                <li><span className={styles.highlight}>City:</span> {data?.city || "..."}</li>
              </ul>
              <ul className={styles.mi_list}>
                <li><span className={styles.highlight}>Profession:</span> {data?.profession || "..."}</li>
                <li><span className={styles.highlight}>Nationality:</span> {data?.nationality || "..."}</li>
                <li><span className={styles.highlight}>Status:</span> Available for Hire</li>
              </ul>
            </div>
            
            <div className={styles.career_obj}>
              <span className={styles.highlight}>Objective:</span> {data?.careerObjectives || "To build scalable, beautiful applications."}
            </div>
          </div>
        </div>
      </motion.section>

      {/* SKILLS SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>02.</span> Technical Arsenal
      </motion.div>
      <motion.section className={styles.skills} id='skills' initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
        <div className={styles.skill_grid}>
          {Array.isArray(data?.skills) && data.skills.map((skill, index) => (
            <motion.div key={index} className={styles.skill_card} whileHover={{ y: -5, scale: 1.02 }}>
              <h3 className={styles.skill_category}>{skill.category}</h3>
              <div className={styles.skill_items}>
                {skill.items.split(',').map((item, i) => (
                  <span key={i} className={styles.skill_badge}>{item.trim()}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* EDUCATION SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>03.</span> Academic History
      </motion.div>
      <motion.section className={styles.education} id='education' initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className={styles.timeline_grid}>
          {Array.isArray(data?.education) ? (
            data.education.map((edu: any, index: number) => (
              <motion.div key={index} className={styles.timeline_card} whileHover={{ y: -5 }}>
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
        </div>
      </motion.section>

      {/* PROJECTS SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>04.</span> Featured Projects
      </motion.div>
      <motion.section className={styles.projects} id='projects' initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className={styles.bento_grid}>
          {Array.isArray(data?.projects) ? (
            data.projects.map((proj: any, index: number) => (
              <motion.div key={index} className={styles.bento_card} whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(249,115,22,0.15)" }}>
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
                    View Live Project ↗
                  </a>
                )}
              </motion.div>
            ))
          ) : null}
        </div>
      </motion.section>

      {/* EXPERIENCE SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>05.</span> Experience & Certs
      </motion.div>
      <motion.section className={styles.experience} id='experience' initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className={styles.timeline_grid}>
          {Array.isArray(data?.experiences) ? (
            data.experiences.map((exp: any, index: number) => (
              <motion.div key={index} className={styles.timeline_card} whileHover={{ y: -5 }}>
                <h2 className={styles.card_title}>{exp.name}</h2>
                <h4 className={styles.card_subtitle_highlight}>{exp.issuedBy}</h4>
                <p className={styles.card_desc}>{exp.description}</p>
                {exp.note && <p className={styles.card_note_box}>{exp.note}</p>}
              </motion.div>
            ))
          ) : null}
        </div>
      </motion.section>

      {/* CONTACTS SECTION */}
      <motion.div className={styles.Section_header} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <span>06.</span> Connect
      </motion.div>
      <motion.section className={styles.contacts} id='contacts' initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className={styles.contact_container}>
          <div className={styles.contact_text_area}>
            <h2 className={styles.contact_title}>Let's build something great together.</h2>
            <p className={styles.contact_p}>I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!</p>
            <a href={`mailto:${data?.gmail}`} className={styles.primaryBtn}>Say Hello</a>
          </div>
          
          <div className={styles.contact_links_grid}>
             <a href={data?.linkedin || "#"} target="_blank" rel="noreferrer" className={styles.social_card}>
                <span className={styles.social_label}>LinkedIn</span>
                <span className={styles.social_action}>Connect ↗</span>
             </a>
             <a href={data?.github || "#"} target="_blank" rel="noreferrer" className={styles.social_card}>
                <span className={styles.social_label}>GitHub</span>
                <span className={styles.social_action}>Follow ↗</span>
             </a>
             <a href={data?.youtube || "#"} target="_blank" rel="noreferrer" className={styles.social_card}>
                <span className={styles.social_label}>YouTube</span>
                <span className={styles.social_action}>Subscribe ↗</span>
             </a>
             <div className={styles.social_card_static}>
                <span className={styles.social_label}>Phone</span>
                <span className={styles.social_value}>{data?.mobile || "Not Provided"}</span>
             </div>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>Designed & Built by <span className={styles.highlight}>{data?.name || "You"}</span></p>
        <p className={styles.footer_copy}>© {new Date().getFullYear()} All Rights Reserved.</p>
      </footer>
    </div>
  );
}