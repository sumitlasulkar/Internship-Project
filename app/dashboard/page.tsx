'use client';
import Header from "../Home/header";
import Footer from "../Home/Footer";
import styles from "./dashboard.module.css";
import { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useReactToPrint } from 'react-to-print';
import { ResumeView } from '@/components/ResumeView';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 
  const router = useRouter();

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Resume_${new Date().getTime()}`,
  });

  const uploadToCloudinary = async (file: File) => {
    const cloudName = "dtr503zbv"; 
    const uploadPreset = "portfolio"; 

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: data }
      );
      const result = await response.json();
      return result.secure_url;
    } catch (err) {
      console.error("Cloudinary Error:", err);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadedUrl = await uploadToCloudinary(file);
    
    if (uploadedUrl) {
      setFormData((prev) => ({ ...prev, [fieldName]: uploadedUrl }));
      alert(`${fieldName.toUpperCase()} uploaded successfully! ☁️`);
    } else {
      alert("Upload failed! Settings check kar bhai.");
    }
    setUploading(false);
  };

  const initialState = {
    username: "", 
    name: "", tagline: "", profilePic: "", cv: "",
    aboutHeader: "", aboutSubheader: "", aboutIntro: "",
    birthday: "", pronoun: "", city: "", age: "",
    profession: "", nationality: "", careerObjectives: "",
    mobile: "", gmail: "", linkedin: "", github: "", youtube: "",
    skills: [{ category: "", items: "" }],
    education: [{ name: "", year: "", grade: "", college: "", university: "", note: "" }],
    projects: [{ name: "", description: "", techStack: "", note: "", link: "" }],
    experiences: [{ name: "", description: "", issuedBy: "", note: "" }]
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docSnap = await getDoc(doc(db, "portfolios", currentUser.uid));
        if (docSnap.exists()) {
          setFormData({ ...initialState, ...docSnap.data() });
        }
        setLoading(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index: number, field: string, value: string, section: string) => {
    const updatedSection = [...(formData as any)[section]];
    updatedSection[index][field] = value;
    setFormData({ ...formData, [section]: updatedSection });
  };

  const addItem = (section: string, emptyObj: object) => {
    setFormData({ ...formData, [section]: [...((formData as any)[section] || []), emptyObj] });
  };

  const removeItem = (section: string, index: number) => {
    const updated = ((formData as any)[section] || []).filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [section]: updated });
  };

  const handleSave = async () => {
    if (!user) return alert("Login First!");
    try {
      await setDoc(doc(db, "portfolios", user.uid), formData);
      alert("Portfolio Live! 🚀");
    } catch (err) {
      alert("Error saving data");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#030014] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin"></div>
          <div className="text-sm font-bold tracking-[0.3em] uppercase animate-pulse text-fuchsia-400">
            Authenticating...
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Glassmorphic UI Classes
  const inputClass = "w-full bg-white/[0.03] border border-white/[0.08] p-4 rounded-xl outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-fuchsia-500/10 text-zinc-100 placeholder-zinc-600 transition-all duration-300 text-sm shadow-inner shadow-black/50";
  const labelClass = "block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2 ml-1";
  const cardClass = "relative bg-white/[0.02] p-6 md:p-8 rounded-3xl border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-500 hover:border-white/[0.1] hover:bg-white/[0.03]";
  const sectionHeaderClass = "flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-violet-400 font-black text-sm uppercase tracking-[0.2em] mb-8 pb-4 border-b border-white/[0.08]";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#030014] text-white p-6 font-sans relative overflow-hidden">
        
        {/* Animated Background Glowing Orbs */}
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000 delay-500" />

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
          
          {/* Dashboard Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/[0.08] pb-6 mb-6 sticky top-0 bg-[#030014]/80 backdrop-blur-2xl z-50 gap-4 md:gap-0 pt-4 rounded-b-3xl px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-violet-400 tracking-tighter text-center md:text-left drop-shadow-lg">
              PORTFOLIO DASHBOARD
            </h1>

            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
              <button 
                onClick={() => router.push('/ats-checker')} 
                className="flex-1 md:flex-none bg-white/[0.05] border border-white/[0.1] px-5 py-3 rounded-xl text-[10px] md:text-xs font-bold text-fuchsia-400 hover:bg-fuchsia-500/10 hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] transition-all duration-300"
              >
                ✨ ATS OPTIMIZER
              </button>
              <button onClick={() => handlePrint()} className="flex-1 md:flex-none bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:text-white px-5 py-3 rounded-xl text-xs md:text-sm font-bold hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300">
                📄 EXPORT RESUME
              </button>
              <button onClick={handleSave} className="flex-[1.5] md:flex-none bg-gradient-to-r from-fuchsia-600 to-violet-600 px-8 py-3 rounded-xl text-xs md:text-sm font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_40px_rgba(217,70,239,0.5)] text-white border border-white/20">
                SAVE CHANGES
              </button>
            </div>
          </div>

          {/* Live Link Section */}
          <div className="p-6 bg-gradient-to-r from-fuchsia-900/20 to-violet-900/20 border border-fuchsia-500/30 rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h3 className="text-fuchsia-400 font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Live Portfolio Status
              </h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1 bg-black/40 border border-white/10 px-5 py-4 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap shadow-inner">
                  <a 
                    href={`/p/${formData.username || user.uid}`} 
                    target="_blank" 
                    className="text-zinc-300 font-mono text-sm hover:text-fuchsia-400 transition-colors"
                  >
                    {typeof window !== 'undefined' ? window.location.origin : ""}/p/{formData.username || user.uid}
                  </a>
                </div>
                <button 
                  onClick={() => { 
                    const link = `${window.location.origin}/p/${formData.username || user.uid}`;
                    navigator.clipboard.writeText(link); 
                    alert("Portfolio Link Copied! 🔥"); 
                  }} 
                  className="w-full md:w-auto text-xs bg-white/5 text-fuchsia-400 border border-fuchsia-500/30 px-8 py-4 rounded-xl hover:bg-fuchsia-500 hover:text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all duration-300 font-bold uppercase tracking-wider"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>

          {/* Profile & Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={cardClass}>
              <h2 className={sectionHeaderClass}>Profile Setup</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Custom URL Handle</label>
                  <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-fuchsia-500/60 focus-within:ring-4 focus-within:ring-fuchsia-500/10 transition-all shadow-inner">
                    <span className="pl-5 text-zinc-500 text-sm font-mono">/p/</span>
                    <input name="username" value={formData.username || ""} onChange={handleChange} placeholder="e.g. johndoe" className="w-full bg-transparent p-4 outline-none text-zinc-100 text-sm" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Full Name</label>
                  <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Hero Tagline</label>
                  <input name="tagline" value={formData.tagline || ""} onChange={handleChange} placeholder="Creative Developer & Designer" className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Mobile</label>
                    <input name="mobile" value={formData.mobile || ""} onChange={handleChange} placeholder="+1 234 567 890" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input name="gmail" value={formData.gmail|| ""} onChange={handleChange} placeholder="hello@example.com" className={inputClass} />
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className={labelClass}>Profile Photo</label>
                  <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.08] p-2 rounded-xl">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} className="text-xs text-zinc-400 w-full file:bg-white/[0.05] file:hover:bg-white/[0.1] file:text-white file:border-none file:px-5 file:py-3 file:rounded-lg cursor-pointer file:transition-colors" />
                    {uploading && <span className="text-xs text-fuchsia-400 font-bold animate-pulse pr-4">Uploading...</span>}
                  </div>
                </div>
              </div>
            </div>
           
            <div className={cardClass}>
              <h2 className={sectionHeaderClass}>Social Links</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Portfolio / Website</label>
                  <input name="youtube" value={formData.youtube || ""} onChange={handleChange} placeholder="https://..." className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input name="linkedin" value={formData.linkedin || ""} onChange={handleChange} placeholder="https://linkedin.com/in/..." className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>GitHub URL</label>
                  <input name="github" value={formData.github || ""} onChange={handleChange} placeholder="https://github.com/..." className={inputClass} />
                </div>
                
                <div className="pt-2">
                  <label className={labelClass}>Resume Document (PDF)</label>
                  <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.08] p-2 rounded-xl">
                    <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'cv')} className="text-xs text-zinc-400 w-full file:bg-white/[0.05] file:hover:bg-white/[0.1] file:text-white file:border-none file:px-5 file:py-3 file:rounded-lg cursor-pointer file:transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Info Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${cardClass} p-6 md:p-8`}>
            <div className="space-y-6">
              <h2 className={sectionHeaderClass}>About Me</h2>
              <div>
                <label className={labelClass}>Section Header</label>
                <input name="aboutHeader" value={formData.aboutHeader || ""} onChange={handleChange} placeholder="E.g. Discover My Journey" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Section Subheader</label>
                <input name="aboutSubheader" value={formData.aboutSubheader || ""} onChange={handleChange} placeholder="E.g. A passionate developer..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Short Introduction</label>
                <textarea name="aboutIntro" value={formData.aboutIntro || ""} onChange={handleChange} placeholder="Write a brief intro..." className={`${inputClass} min-h-[120px] resize-y`} />
              </div>
              <div>
                <label className={labelClass}>Career Objectives</label>
                <textarea name="careerObjectives" value={formData.careerObjectives || ""} onChange={handleChange} placeholder="Where are you heading?" className={`${inputClass} min-h-[120px] resize-y`} />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className={sectionHeaderClass}>Demographics</h2>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <input name="birthday" value={formData.birthday || ""} onChange={handleChange} placeholder="DD/MM/YYYY" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input name="age" value={formData.age || ""} onChange={handleChange} placeholder="E.g. 24" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Profession Title</label>
                <input name="profession" value={formData.profession || ""} onChange={handleChange} placeholder="Software Engineer" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Nationality</label>
                  <input name="nationality" value={formData.nationality || ""} onChange={handleChange} placeholder="Indian" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Pronouns</label>
                  <input name="pronoun" value={formData.pronoun|| ""} onChange={handleChange} placeholder="He/Him" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Current City</label>
                <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="New York, USA" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className={cardClass}>
            <h2 className={sectionHeaderClass}>Technical Arsenal</h2>
            <div className="space-y-5">
              {(formData.skills || []).map((s: any, i: number) => (
                <div key={i} className="relative group p-6 bg-white/[0.01] rounded-2xl border border-white/[0.05] hover:border-fuchsia-500/30 hover:bg-white/[0.03] transition-all duration-300 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full md:flex-1">
                      <label className={labelClass}>Skill Category</label>
                      <input placeholder="e.g. Frameworks" value={s.category || ""} onChange={(e) => handleArrayChange(i, 'category', e.target.value, 'skills')} className={inputClass} />
                    </div>
                    <div className="w-full md:flex-[2]">
                      <label className={labelClass}>Technologies (Comma Separated)</label>
                      <input placeholder="e.g. React, Next.js, Vue" value={s.items || ""} onChange={(e) => handleArrayChange(i, 'items', e.target.value, 'skills')} className={inputClass} />
                    </div>
                    <button onClick={() => removeItem('skills', i)} className="absolute top-4 right-4 md:relative md:top-6 md:right-0 p-2.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('skills', { category: "", items: "" })} className="mt-6 w-full py-4 border border-dashed border-white/[0.1] rounded-xl text-zinc-400 font-bold tracking-widest uppercase text-[10px] hover:border-fuchsia-500/50 hover:text-fuchsia-400 hover:bg-fuchsia-500/5 hover:shadow-[0_0_15px_rgba(217,70,239,0.1)] transition-all duration-300">
              + Add Skill Category
            </button>
          </div>

          {/* Projects Section */}
          <div className={cardClass}>
            <h2 className={sectionHeaderClass}>Featured Projects</h2>
            <div className="space-y-6">
              {(formData.projects || []).map((proj, i) => (
                <div key={i} className="relative p-6 md:p-8 bg-white/[0.01] rounded-2xl border border-white/[0.05] space-y-6 group hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-violet-900/10 hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-violet-400/50 font-mono text-xs font-bold tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">PROJECT_0{i + 1}</span>
                    <button onClick={() => removeItem('projects', i)} className="text-xs font-bold text-red-400/50 hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      Delete Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Project Name</label>
                      <input placeholder="E.g. Thinkhatch AI" value={proj.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'projects')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Live Link / Repo URL</label>
                      <input placeholder="https://..." value={proj.link || ""} onChange={(e) => handleArrayChange(i, 'link', e.target.value, 'projects')} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Tech Stack Used</label>
                    <input placeholder="React, Tailwind, Firebase..." value={proj.techStack || ""} onChange={(e) => handleArrayChange(i, 'techStack', e.target.value, 'projects')} className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Short Description</label>
                      <textarea placeholder="What does this project do?" value={proj.description || ""} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'projects')} className={`${inputClass} min-h-[120px] resize-y`} />
                    </div>
                    <div>
                      <label className={labelClass}>Key Achievements & Notes</label>
                      <textarea placeholder="Specific accomplishments, challenges solved..." value={proj.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'projects')} className={`${inputClass} min-h-[120px] resize-y`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('projects', { name: "", description: "", techStack: "", note: "", link: "" })} className="mt-6 w-full py-5 border border-dashed border-white/[0.1] rounded-xl text-zinc-400 font-bold tracking-widest uppercase text-[10px] hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/5 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all duration-300">
              + Add New Project
            </button>
          </div>

          {/* Education Section */}
          <div className={cardClass}>
            <h2 className={sectionHeaderClass}>Academic History</h2>
            <div className="space-y-6">
              {Array.isArray(formData?.education) ? formData.education.map((edu, i) => (
                <div key={i} className="relative p-6 md:p-8 bg-white/[0.01] rounded-2xl border border-white/[0.05] space-y-6 group hover:border-fuchsia-500/30 hover:bg-white/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-900/10 hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-fuchsia-400/50 font-mono text-xs font-bold tracking-widest bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/20">EDUCATION_0{i + 1}</span>
                    <button type="button" onClick={() => removeItem('education', i)} className="text-xs font-bold text-red-400/50 hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      Delete Entry
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Degree / Course</label>
                      <input placeholder="B.Tech Computer Science" value={edu.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'education')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Duration</label>
                      <input placeholder="2020 - 2024" value={edu.year || ""} onChange={(e) => handleArrayChange(i, 'year', e.target.value, 'education')} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Institute / College</label>
                      <input placeholder="XYZ Engineering College" value={edu.college || ""} onChange={(e) => handleArrayChange(i, 'college', e.target.value, 'education')} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>University</label>
                        <input placeholder="State University" value={edu.university || ""} onChange={(e) => handleArrayChange(i, 'university', e.target.value, 'education')} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Grade / CGPA</label>
                        <input placeholder="8.5 CGPA" value={edu.grade || ""} onChange={(e) => handleArrayChange(i, 'grade', e.target.value, 'education')} className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Additional Notes / Coursework</label>
                    <textarea placeholder="Key coursework, activities..." value={edu.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'education')} className={`${inputClass} min-h-[100px] resize-y`} />
                  </div>
                </div>
              )) : null}
            </div>
            <button type="button" onClick={() => addItem('education', { name: "", year: "", grade: "", college: "", note: "", university: "" })} className="mt-6 w-full py-5 border border-dashed border-white/[0.1] rounded-xl text-zinc-400 font-bold tracking-widest uppercase text-[10px] hover:border-fuchsia-500/50 hover:text-fuchsia-400 hover:bg-fuchsia-500/5 hover:shadow-[0_0_15px_rgba(217,70,239,0.1)] transition-all duration-300">
              + Add Education Entry
            </button>
          </div>

          {/* Experience Section */}
          <div className={cardClass}>
            <h2 className={sectionHeaderClass}>Professional Experience</h2>
            <div className="space-y-6">
              {(formData.experiences || []).map((exp, i) => (
                <div key={i} className="relative p-6 md:p-8 bg-white/[0.01] rounded-2xl border border-white/[0.05] space-y-6 group hover:border-violet-500/30 hover:bg-white/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-violet-900/10 hover:-translate-y-1">
                   <div className="flex justify-between items-center mb-2">
                    <span className="text-violet-400/50 font-mono text-xs font-bold tracking-widest bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">EXPERIENCE_0{i + 1}</span>
                    <button onClick={() => removeItem('experiences', i)} className="text-xs font-bold text-red-400/50 hover:text-red-400 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100">
                      Delete Role
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Job Title / Role</label>
                      <input placeholder="Frontend Developer Intern" value={exp.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'experiences')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Company</label>
                      <input placeholder="Nexonica Systems" value={exp.issuedBy || ""} onChange={(e) => handleArrayChange(i, 'issuedBy', e.target.value, 'experiences')} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Duration / Timeline</label>
                    <input placeholder="Jan 2026 - Present" value={exp.description || ""} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'experiences')} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Roles & Responsibilities</label>
                    <textarea placeholder="Developed X, improved performance by Y%..." value={exp.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'experiences')} className={`${inputClass} min-h-[120px] resize-y`} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('experiences', { name: "", issuedBy: "", description: "", note: "" })} className="mt-6 w-full py-5 border border-dashed border-white/[0.1] rounded-xl text-zinc-400 font-bold tracking-widest uppercase text-[10px] hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/5 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all duration-300">
              + Add Work Experience
            </button>
          </div>

          <div style={{ display: 'none' }}>
            <ResumeView ref={componentRef} data={formData} />
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}