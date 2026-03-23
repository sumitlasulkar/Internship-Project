'use client';
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
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl font-bold italic animate-pulse text-orange-600">
          CHECKING_AUTH_STATUS...
        </div>
      </div>
    );
  }

  // Common input classes for a classy look
  const inputClass = "w-full bg-zinc-950/50 border border-zinc-800 p-3.5 rounded-xl outline-none focus:border-orange-500/80 focus:bg-zinc-900 focus:ring-1 focus:ring-orange-500/20 text-zinc-100 placeholder-zinc-700 transition-all text-sm";
  const labelClass = "block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5 ml-1";
  const sectionHeaderClass = "flex items-center gap-3 text-orange-500 font-bold text-sm uppercase tracking-[0.2em] mb-8 pb-4 border-b border-zinc-800/80";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-10">
          
          {/* Dashboard Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-orange-600/30 pb-6 mb-6 sticky top-0 bg-[#050505]/90 backdrop-blur-md z-50 gap-4 md:gap-0 pt-4">
            <h1 className="text-2xl md:text-3xl font-black italic text-orange-600 tracking-tighter text-center md:text-left drop-shadow-md">
              PORTFOLIO DASHBOARD
            </h1>

            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
              <button 
                onClick={() => router.push('/ats-checker')} 
                className="flex-1 md:flex-none bg-zinc-900 border border-orange-600/50 px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-bold text-orange-500 hover:bg-orange-600 hover:text-white transition shadow-lg"
              >
                ✨ ATS_OPTIMIZER
              </button>
              <button onClick={() => handlePrint()} className="flex-1 md:flex-none bg-blue-600/10 border border-blue-600/50 text-blue-500 hover:text-white px-4 md:px-6 py-3 rounded-xl text-xs md:text-sm font-bold hover:bg-blue-600 transition shadow-lg">
                RESUME 📄
              </button>
              <button onClick={handleSave} className="flex-[1.5] md:flex-none bg-gradient-to-r from-orange-600 to-orange-500 px-6 md:px-10 py-3 rounded-xl text-xs md:text-sm font-bold hover:scale-105 active:scale-95 transition shadow-lg shadow-orange-900/20 text-white">
                SAVE_CHANGES
              </button>
            </div>
          </div>

          {/* Live Link Section */}
          <div className="p-6 md:p-8 bg-zinc-900/40 border border-orange-500/20 rounded-3xl backdrop-blur-sm">
            <h3 className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-3">Live Portfolio Status:</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 bg-black/50 border border-zinc-800 px-4 py-3 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap">
                <a 
                  href={`/p/${formData.username || user.uid}`} 
                  target="_blank" 
                  className="text-zinc-300 font-mono text-sm hover:text-orange-400 transition"
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
                className="w-full md:w-auto text-xs bg-zinc-800 text-orange-500 border border-zinc-700 px-6 py-3 rounded-xl hover:bg-orange-600 hover:text-white hover:border-orange-500 transition font-bold"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Profile & Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Info */}
            <div className="bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
              <h2 className={sectionHeaderClass}>Profile_Info</h2>
              
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Custom URL Handle</label>
                  <div className="flex items-center bg-zinc-950/50 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500/20 transition-all">
                    <span className="pl-4 text-zinc-500 text-sm font-mono">/p/</span>
                    <input name="username" value={formData.username || ""} onChange={handleChange} placeholder="e.g. johndoe" className="w-full bg-transparent p-3.5 outline-none text-zinc-100 text-sm" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Full Name</label>
                  <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Hero Tagline</label>
                  <input name="tagline" value={formData.tagline || ""} onChange={handleChange} placeholder="Full Stack Developer & Designer" className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <input name="mobile" value={formData.mobile || ""} onChange={handleChange} placeholder="+1 234 567 890" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input name="gmail" value={formData.gmail|| ""} onChange={handleChange} placeholder="hello@example.com" className={inputClass} />
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className={labelClass}>Profile Photo</label>
                  <div className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-800 p-2 rounded-xl">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} className="text-xs text-zinc-400 w-full file:bg-zinc-800 file:hover:bg-zinc-700 file:text-white file:border-none file:px-4 file:py-2.5 file:rounded-lg cursor-pointer transition" />
                    {uploading && <span className="text-xs text-orange-500 font-bold animate-pulse pr-4">Uploading...</span>}
                  </div>
                </div>
              </div>
            </div>
           
            {/* Contacts */}
            <div className="bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
              <h2 className={sectionHeaderClass}>Social_Links</h2>
              
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>YouTube / Portfolio Link</label>
                  <input name="youtube" value={formData.youtube || ""} onChange={handleChange} placeholder="https://youtube.com/..." className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input name="linkedin" value={formData.linkedin || ""} onChange={handleChange} placeholder="https://linkedin.com/in/..." className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>GitHub Profile</label>
                  <input name="github" value={formData.github || ""} onChange={handleChange} placeholder="https://github.com/..." className={inputClass} />
                </div>
                
                <div className="pt-2">
                  <label className={labelClass}>Upload Resume PDF</label>
                  <div className="flex items-center gap-4 bg-zinc-950/50 border border-zinc-800 p-2 rounded-xl">
                    <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'cv')} className="text-xs text-zinc-400 w-full file:bg-zinc-800 file:hover:bg-zinc-700 file:text-white file:border-none file:px-4 file:py-2.5 file:rounded-lg cursor-pointer transition" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
            <div className="space-y-5">
              <h2 className={sectionHeaderClass}>About_Details</h2>
              
              <div>
                <label className={labelClass}>About Header</label>
                <input name="aboutHeader" value={formData.aboutHeader || ""} onChange={handleChange} placeholder="E.g. Get to know me" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>About Subheader</label>
                <input name="aboutSubheader" value={formData.aboutSubheader || ""} onChange={handleChange} placeholder="E.g. A passionate developer..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Short Introduction</label>
                <textarea name="aboutIntro" value={formData.aboutIntro || ""} onChange={handleChange} placeholder="Write a brief intro about yourself..." className={`${inputClass} min-h-[100px] resize-y`} />
              </div>
              <div>
                <label className={labelClass}>Career Objectives</label>
                <textarea name="careerObjectives" value={formData.careerObjectives || ""} onChange={handleChange} placeholder="What are your long term goals?" className={`${inputClass} min-h-[100px] resize-y`} />
              </div>
            </div>

            <div className="space-y-5">
              <h2 className={sectionHeaderClass}>Personal_Info</h2>
              
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
                <label className={labelClass}>Profession</label>
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
                <label className={labelClass}>City / Location</label>
                <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="New York, USA" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
            <h2 className={sectionHeaderClass}>Technical_Skills</h2>
            
            <div className="space-y-4">
              {(formData.skills || []).map((s: any, i: number) => (
                <div key={i} className="relative group p-5 bg-zinc-950/40 rounded-2xl border border-zinc-800/60">
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    <div className="w-full md:flex-1">
                      <label className={labelClass}>Category</label>
                      <input placeholder="e.g. Frontend, Languages" value={s.category || ""} onChange={(e) => handleArrayChange(i, 'category', e.target.value, 'skills')} className={inputClass} />
                    </div>
                    <div className="w-full md:flex-[2]">
                      <label className={labelClass}>Skills (Comma Separated)</label>
                      <input placeholder="e.g. React, Next.js, Node.js" value={s.items || ""} onChange={(e) => handleArrayChange(i, 'items', e.target.value, 'skills')} className={inputClass} />
                    </div>
                    <button onClick={() => removeItem('skills', i)} className="absolute top-4 right-4 md:relative md:top-6 md:right-0 p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('skills', { category: "", items: "" })} className="mt-6 w-full py-3.5 border border-dashed border-zinc-700/80 rounded-xl text-zinc-400 font-semibold hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all text-sm">
              + Add Skill Category
            </button>
          </div>

          {/* Projects Section */}
          <div className="bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
            <h2 className={sectionHeaderClass}>Projects_Showcase</h2>
            
            <div className="space-y-6">
              {(formData.projects || []).map((proj, i) => (
                <div key={i} className="relative p-6 bg-zinc-950/40 rounded-2xl border border-zinc-800/60 space-y-5 group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-500 font-mono text-xs font-bold">PROJECT #0{i + 1}</span>
                    <button onClick={() => removeItem('projects', i)} className="text-xs font-bold text-red-500/70 hover:text-red-500 flex items-center gap-1 transition">
                      Delete Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <label className={labelClass}>Tech Stack</label>
                    <input placeholder="React, Tailwind, Firebase..." value={proj.techStack || ""} onChange={(e) => handleArrayChange(i, 'techStack', e.target.value, 'projects')} className={inputClass} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Short Description</label>
                      <textarea placeholder="What does this project do?" value={proj.description || ""} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'projects')} className={`${inputClass} min-h-[100px] resize-y`} />
                    </div>
                    <div>
                      <label className={labelClass}>Additional Notes / Achievements</label>
                      <textarea placeholder="Specific accomplishments, challenges solved..." value={proj.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'projects')} className={`${inputClass} min-h-[100px] resize-y`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('projects', { name: "", description: "", techStack: "", note: "", link: "" })} className="mt-6 w-full py-4 border border-dashed border-zinc-700/80 rounded-xl text-zinc-400 font-semibold hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all text-sm">
              + Add Project
            </button>
          </div>

          {/* Education Section */}
          <div className="bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
            <h2 className={sectionHeaderClass}>Education_History</h2>
            
            <div className="space-y-6">
              {Array.isArray(formData?.education) ? formData.education.map((edu, i) => (
                <div key={i} className="relative p-6 bg-zinc-950/40 rounded-2xl border border-zinc-800/60 space-y-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-500 font-mono text-xs font-bold">EDUCATION #0{i + 1}</span>
                    <button type="button" onClick={() => removeItem('education', i)} className="text-xs font-bold text-red-500/70 hover:text-red-500 flex items-center gap-1 transition">
                      Delete Entry
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Degree / Course Name</label>
                      <input placeholder="B.Tech Computer Science" value={edu.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'education')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Duration (Years)</label>
                      <input placeholder="2020 - 2024" value={edu.year || ""} onChange={(e) => handleArrayChange(i, 'year', e.target.value, 'education')} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Institute / College Name</label>
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
                    <label className={labelClass}>Description / Achievements</label>
                    <textarea placeholder="Key coursework, activities..." value={edu.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'education')} className={`${inputClass} min-h-[80px] resize-y`} />
                  </div>
                </div>
              )) : (
                <p className="text-zinc-500 text-sm italic">No education profiles initialized.</p>
              )}
            </div>

            <button type="button" onClick={() => addItem('education', { name: "", year: "", grade: "", college: "", note: "", university: "" })} className="mt-6 w-full py-4 border border-dashed border-zinc-700/80 rounded-xl text-zinc-400 font-semibold hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all text-sm">
              + Add Education Entry
            </button>
          </div>

          {/* Experience Section */}
          <div className="bg-zinc-900/60 p-6 md:p-8 rounded-3xl border border-zinc-800/80 shadow-2xl">
            <h2 className={sectionHeaderClass}>Work_Experience</h2>
            
            <div className="space-y-6">
              {(formData.experiences || []).map((exp, i) => (
                <div key={i} className="relative p-6 bg-zinc-950/40 rounded-2xl border border-zinc-800/60 space-y-5">
                   <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-500 font-mono text-xs font-bold">EXPERIENCE #0{i + 1}</span>
                    <button onClick={() => removeItem('experiences', i)} className="text-xs font-bold text-red-500/70 hover:text-red-500 flex items-center gap-1 transition">
                      Delete Role
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Job Title / Role</label>
                      <input placeholder="Frontend Developer Intern" value={exp.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'experiences')} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Company / Issued By</label>
                      <input placeholder="Nexonica Systems" value={exp.issuedBy || ""} onChange={(e) => handleArrayChange(i, 'issuedBy', e.target.value, 'experiences')} className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Short Description / Duration</label>
                    <input placeholder="Jan 2026 - Feb 2026" value={exp.description || ""} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'experiences')} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Detailed Responsibilities & Notes</label>
                    <textarea placeholder="Developed X, improved performance by Y%..." value={exp.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'experiences')} className={`${inputClass} min-h-[100px] resize-y`} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => addItem('experiences', { name: "", issuedBy: "", description: "", note: "" })} className="mt-6 w-full py-4 border border-dashed border-zinc-700/80 rounded-xl text-zinc-400 font-semibold hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/5 transition-all text-sm">
              + Add Experience Role
            </button>
          </div>

          {/* Hidden Print Component */}
          <div style={{ display: 'none' }}>
            <ResumeView ref={componentRef} data={formData} />
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}