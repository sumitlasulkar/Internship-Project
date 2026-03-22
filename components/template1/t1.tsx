'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from "./t1.module.css"

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

export default function TemplateOne({ data }: { data: PortfolioData }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // 🚀 SAFETY CHECK: Agar data gayab hai toh loading ya empty screen dikhao
  if (!data) {
    return <div style={{color: 'white', textAlign: 'center', padding: '50px'}}>Loading Portfolio Data...</div>;
  }

  return (
    <div className={styles.tmp}>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <img src={data?.profilePic || "/default-avatar.png"} className={styles.logo} alt="logo" />
        </Link>

        <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✖' : '☰'}
        </div>

        {/* 🚀 FIXED: Removed double <nav> nesting */}
        <nav className={`${styles.nav} ${menuOpen ? styles.active : ''}`}>
          <a href="#home" className={styles.button} onClick={() => setMenuOpen(false)}> Home </a>
          <a href="#about" className={styles.button} onClick={() => setMenuOpen(false)}> About </a>
          <a href="#skills" className={styles.button} onClick={() => setMenuOpen(false)}> Skills </a>
          <a href="#education" className={styles.button} onClick={() => setMenuOpen(false)}> Education </a>
          <a href="#projects" className={styles.button} onClick={() => setMenuOpen(false)}> Projects </a>
          <a href="#experience" className={styles.button} onClick={() => setMenuOpen(false)}> Experience </a>
          <a href="#contacts" className={styles.button} id={styles.contact} onClick={() => setMenuOpen(false)}> Contacts </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.home} id='home'>
        <div className={styles.name}><h1>{data?.name || "Your Name"}</h1></div>
        <div className={styles.tagline}><h2>{data?.tagline || "Your Tagline"}</h2></div>
        <div className={styles.hero_buttons}>
          <a href="#contacts"><button className={styles.button}>Contact</button></a>
        </div>
      </section>

      {/* About Section */}
      <div className={styles.Section_header}>About</div>
      <section className={styles.about} id='about'>
        <div className="about_info">
          <p className= {styles.aboutHeader} id={styles.about_p1}>{data?.aboutHeader || "Your About Header"}</p><br />
          <p className= {styles.aboutSubheader} id={styles.about_p2}>{data?.aboutSubheader || "Your About Subheader"}</p>
        </div>
        <div className={styles.about_mainbx}>
          <div className={styles.about_img}>
            <img src={data?.profilePic || "/default-avatar.png"} alt="profile" />
          </div>
          <div className={styles.about_sumit}>
            <h1>{data?.name || "Your Name"}</h1>
            <p id={styles.about_intro}><span>{data?.aboutIntro || "Intro text..."}</span></p>
            <div className={styles.myinfo}>
              <ul className={styles.mi1}>
                <li>◉ Birthday:<span>{data?.birthday || "..."}</span></li>
                <li>◉ Pronoun:<span>{data?.pronoun || "..."}</span></li>
                <li>◉ City:<span>{data?.city || "..."}</span></li>
                <li>◉ Available to<span> Freelance</span></li>
              </ul>
              <ul className={styles.mi2}>
                <li>◉ Age:<span>{data?.age || "..."}</span></li>
                <li>◉ Profession:<span>{data?.profession || "..."}</span></li>
                <li>◉ Nationality:<span>{data?.nationality || "..."}</span></li>
                <li>◉ Available to<span> Job</span></li>
              </ul>
            </div>
            <p id={styles.about_footer}>Career Objectives:<span>{data?.careerObjectives || "..."}</span></p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <div className={styles.Section_header}>Skills</div>
      <section className={styles.skills} id='skills'>
        <div className={styles.skill_card}>
          <div className={styles.skills_list}>
            <ul>
              {(data?.skills || []).map((skill, index) => (
                <li key={index}>◉ {skill.category}: {skill.items}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <div className={styles.Section_header}>Education</div>
      <section className={styles.education} id='education'>
        {/* 🚀 Bulletproof Fix: Check if it's actually an array before mapping */}
        {Array.isArray(data?.education) ? (
          data.education.map((edu: any, index: number) => (
            <div key={index} className={styles.education_card} style={{ marginBottom: '20px' }}>
              <h1>{edu.name}</h1>
              <h1>{edu.year}</h1>
              <h1>{edu.grade}</h1>
              <p>{edu.college}</p>
              <p>{edu.university}</p>
              <p>{edu.note}</p>
            </div>
          ))
        ) : null}
      </section>

      {/* Projects Section */}
      <div className={styles.Section_header}>Projects</div>
      <section className={styles.projects} id='projects'>
        {Array.isArray(data?.projects) ? (
          data.projects.map((proj: any, index: number) => (
            <div key={index} className={styles.project_card} style={{ marginBottom: '30px' }}>
              <h1>{proj.name}</h1>
              <p>{proj.description}</p>
              <p><strong>Tech Stack:</strong> {proj.techStack}</p>
              <p><em>{proj.note}</em></p>
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noopener noreferrer">View Project ↗</a>
              )}
            </div>
          ))
        ) : null}
      </section>

      {/* Experience Section */}
      <div className={styles.Section_header}>Experiences(Certificates)</div>
      <section className={styles.experience} id='experience'>
        {Array.isArray(data?.experiences) ? (
          data.experiences.map((exp: any, index: number) => (
            <div key={index} className={styles.experience_card} style={{ marginBottom: '30px' }}>
              <h1>{exp.name}</h1>
              <p>{exp.description}</p>
              <p><strong>Issued By:</strong> {exp.issuedBy}</p>
              <p><em>{exp.note}</em></p>
            </div>
          ))
        ) : null}
      </section>

      {/* Contacts Section */}
      <div className={styles.Section_header}>Contacts</div>
      <section className={styles.contacts} id='contacts'>
        <div className={styles.about_info}>
          <p id={styles.contacts_p1}>For any Query and Service Contact us!</p>
        </div>
        <div className={styles.about_mainbx}>
          <div className={styles.about_img} id={styles.contact_image}>
            <img src="/contact.jpeg" alt="contact" />
          </div>
          <div className={styles.contact_sumit}>
            <div className={styles.linkedin}><span>linkedin</span> <a href={data?.linkedin || "#"} target="_blank"><button>+Connect</button></a></div>
            <div className={styles.github}><span>GitHub</span> <a href={data?.github || "#"} target="_blank"><button>+Follow</button></a></div>
            <div className={styles.utube}><span>Social Media</span> <a href={data?.youtube || "#"} target="_blank"><button>+Follow</button></a></div>
            <div className={styles.cv}><a href={data?.cv || "resume.pdf"} target="_blank"><button>Download CV</button></a></div>
            <div className={styles.gmail}><span>Gmail</span><button>{data?.gmail || "sumit.lasulkar4u@gmail.com"}</button></div>
            <div className={styles.mobile}><span>Mobile </span><button>{data?.mobile || "+91 8007299291"}</button></div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <h5> Copyright © ||All Rights Reserved || {data?.name || "Your Name"}</h5>
      </footer>
    </div>
  );
}