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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black text-white p-6 font-sans">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-orange-600 pb-6 mb-6 sticky top-0 bg-black z-50 gap-4 md:gap-0">
            <h1 className="text-2xl md:text-3xl font-black italic text-orange-600 tracking-tighter text-center md:text-left">
              PORTFOLIO DASHBOARD
            </h1>

            <div className="flex flex-wrap gap-3 w-full md:w-auto justify-center md:justify-end">
              {/* 🚀 NAYA ATS CHECKER BUTTON */}
              <button 
                onClick={() => router.push('/ats-checker')} 
                className="flex-1 md:flex-none bg-zinc-800 border border-orange-600/50 px-4 md:px-6 py-3 rounded-full text-[10px] md:text-xs font-bold text-orange-500 hover:bg-orange-600 hover:text-white transition shadow-lg"
              >
                ✨ ATS_OPTIMIZER
              </button>

              <button onClick={() => handlePrint()} className="flex-1 md:flex-none bg-blue-600 px-4 md:px-6 py-3 rounded-full text-xs md:text-base font-bold hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">RESUME 📄</button>
              <button onClick={handleSave} className="flex-[1.5] md:flex-none bg-orange-600 px-6 md:px-10 py-3 rounded-full text-xs md:text-base font-bold hover:scale-105 active:scale-95 transition shadow-lg shadow-orange-900/20">SAVE_CHANGES</button>
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-orange-600/30 rounded-3xl">
            <h3 className="text-orange-500 font-bold text-xs uppercase tracking-widest mb-2">Your Live Portfolio:</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <a 
                href={`/p/${formData.username || user.uid}`} 
                target="_blank" 
                className="text-zinc-300 font-mono break-all hover:text-orange-500 transition underline text-sm"
              >
                {typeof window !== 'undefined' ? window.location.origin : ""}/p/{formData.username || user.uid}
              </a>
              <button 
                onClick={() => { 
                  const link = `${window.location.origin}/p/${formData.username || user.uid}`;
                  navigator.clipboard.writeText(link); 
                  alert("Portfolio Link Copied! 🔥"); 
                }} 
                className="text-xs bg-orange-600/20 text-orange-500 border border-orange-600/50 px-4 py-2 rounded-lg hover:bg-orange-600 hover:text-white transition"
              >
                Copy Public Link
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <div className="space-y-4">
              <h2 className="text-orange-500 font-bold uppercase text-xs tracking-widest">Profile_Info</h2>
              
              <div className="space-y-1">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Custom URL Handle (e.g. mayuri)</p>
                <div className="flex items-center bg-black border border-zinc-800 rounded-xl overflow-hidden focus-within:border-orange-500">
                  <span className="pl-4 text-zinc-600 text-sm">/p/</span>
                  <input name="username" value={formData.username || ""} onChange={handleChange} placeholder="username" className="w-full bg-transparent p-4 outline-none text-white" />
                </div>
              </div>

              <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Full Name" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="tagline" value={formData.tagline || ""} onChange={handleChange} placeholder="Hero Tagline" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="mobile" value={formData.mobile || ""} onChange={handleChange} placeholder="mobile" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
              <input name="gmail" value={formData.gmail|| ""} onChange={handleChange} placeholder="e-mail" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
              
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Upload Profile Photo</p>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'profilePic')} className="text-xs text-zinc-400 file:bg-zinc-800 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg cursor-pointer" />
                {uploading && <p className="text-xs text-orange-500 animate-pulse">Uploading...</p>}
              </div>
            </div>
           
            <div className="space-y-4">
              <h2 className="text-orange-500 font-bold uppercase text-xs tracking-widest">Contacts</h2>
              <input name="youtube" value={formData.youtube || ""} onChange={handleChange} placeholder="Social Media" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
              <input name="linkedin" value={formData.linkedin || ""} onChange={handleChange} placeholder="LinkedIn URL" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
              <input name="github" value={formData.github || ""} onChange={handleChange} placeholder="github" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
              
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Upload Resume PDF</p>
                <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, 'cv')} className="text-xs text-zinc-400 file:bg-zinc-800 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <div className="space-y-4">
              <h2 className="text-orange-500 font-bold uppercase text-xs tracking-widest">About_Info</h2>
              <input name="aboutHeader" value={formData.aboutHeader || ""} onChange={handleChange} placeholder="About Header" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="aboutSubheader" value={formData.aboutSubheader || ""} onChange={handleChange} placeholder="About SubHeader" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="aboutIntro" value={formData.aboutIntro || ""} onChange={handleChange} placeholder="Short Introduction" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="careerObjectives" value={formData.careerObjectives || ""} onChange={handleChange} placeholder="Career Objectives" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-orange-500 font-bold uppercase text-xs tracking-widest">About_Info</h2>
              <input name="birthday" value={formData.birthday || ""} onChange={handleChange} placeholder="Date of Birth" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="age" value={formData.age || ""} onChange={handleChange} placeholder="Enter Age" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="profession" value={formData.profession || ""} onChange={handleChange} placeholder="profession" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="nationality" value={formData.nationality || ""} onChange={handleChange} placeholder="nationality" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
              <input name="pronoun" value={formData.pronoun|| ""} onChange={handleChange} placeholder="pronoun" className="w-full bg-black border border-zinc-800 p-4 rounded-xl outline-none focus:border-orange-500 text-white" />
              <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="city" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white" />
            </div>
          </div>

          <div className="bg-zinc-900 p-4 md:p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-orange-500 font-bold mb-6 text-xs uppercase text-white tracking-widest">Skills_List</h2>
            {(formData.skills || []).map((s: any, i: number) => (
              <div key={i} className="relative group mb-6 p-4 bg-black/40 rounded-2xl border border-zinc-800/50 md:border-none md:p-0 md:bg-transparent md:mb-4">
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center">
                  <div className="w-full md:flex-1">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1 md:hidden">Category</p>
                    <input placeholder="e.g. Languages" value={s.category || ""} onChange={(e) => handleArrayChange(i, 'category', e.target.value, 'skills')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 focus:border-orange-500 outline-none text-white text-sm transition" />
                  </div>
                  <div className="w-full md:flex-[2]">
                    <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1 md:hidden">Skills / Items</p>
                    <input placeholder="e.g. React, Next.js, Node.js" value={s.items || ""} onChange={(e) => handleArrayChange(i, 'items', e.target.value, 'skills')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 focus:border-orange-500 outline-none text-white text-sm transition" />
                  </div>
                  <button onClick={() => removeItem('skills', i)} className="absolute top-2 right-2 md:relative md:top-0 md:right-0 p-2 text-red-500/50 hover:text-red-500 transition-colors"><span className="text-lg">✕</span></button>
                </div>
              </div>
            ))}
            <button onClick={() => addItem('skills', { category: "", items: "" })} className="w-full md:w-auto mt-2 py-3 px-6 border border-dashed border-zinc-700 rounded-xl text-orange-500 font-bold hover:bg-orange-500/5 transition-all text-sm">+ Add Skill Group</button>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-orange-500 font-bold mb-6 text-xs uppercase text-white">Projects_Showcase</h2>
            {(formData.projects || []).map((proj, i) => (
              <div key={i} className="space-y-4 border-b border-zinc-800 pb-6 mb-6">
                <input placeholder="Project Name" value={proj.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'projects')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <textarea placeholder="Description" value={proj.description || ""} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'projects')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 h-20 text-white" />
                <textarea placeholder="techStack" value={proj.techStack || ""} onChange={(e) => handleArrayChange(i, 'techStack', e.target.value, 'projects')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 h-20 text-white" />
                <textarea placeholder="note" value={proj.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'projects')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 h-20 text-white" />
                <input placeholder="Link" value={proj.link || ""} onChange={(e) => handleArrayChange(i, 'link', e.target.value, 'projects')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <button onClick={() => removeItem('projects', i)} className="text-red-500 text-sm">Delete Project</button>
              </div>
            ))}
            <button onClick={() => addItem('projects', { name: "", description: "", techStack: "", note: "", link: "" })} className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-500 hover:text-orange-500 hover:border-orange-500 transition">+ Add Project Card</button>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-orange-500 font-bold mb-6 text-xs uppercase text-white">Education_Showcase</h2>
            {(formData.education || []).map((edu, i) => (
              <div key={i} className="space-y-4 border-b border-zinc-800 pb-6 mb-6">
                <input placeholder="Education Name" value={edu.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'education')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <input placeholder="Dates Of Studies" value={edu.year || ""} onChange={(e) => handleArrayChange(i, 'year', e.target.value, 'education')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <input placeholder="grade" value={edu.grade || ""} onChange={(e) => handleArrayChange(i, 'grade', e.target.value, 'education')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <input placeholder="Institute Name" value={edu.college || ""} onChange={(e) => handleArrayChange(i, 'college', e.target.value, 'education')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <input placeholder="University" value={edu.university || ""} onChange={(e) => handleArrayChange(i, 'university', e.target.value, 'education')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <textarea placeholder="Description" value={edu.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'education')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 h-20 text-white" />
                <button onClick={() => removeItem('education', i)} className="text-red-500 text-sm">Delete Education</button>
              </div>
            ))}
            <button onClick={() => addItem('education', { name: "", year: "", grade: "", college: "", note: "", university: "" })} className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-500 hover:text-orange-500 hover:border-orange-500 transition">+ Add Education Card</button>
          </div>

          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-orange-500 font-bold mb-6 text-xs uppercase text-white">Experience_Showcase</h2>
            {(formData.experiences || []).map((edu, i) => (
              <div key={i} className="space-y-4 border-b border-zinc-800 pb-6 mb-6">
                <input placeholder="Experience Name" value={edu.name || ""} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'experiences')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <input placeholder="note" value={edu.description || ""} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'experiences')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <input placeholder="issuedBy" value={edu.issuedBy || ""} onChange={(e) => handleArrayChange(i, 'issuedBy', e.target.value, 'experiences')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 text-white" />
                <textarea placeholder="Description" value={edu.note || ""} onChange={(e) => handleArrayChange(i, 'note', e.target.value, 'experiences')} className="w-full bg-black p-4 rounded-xl border border-zinc-800 h-20 text-white" />
                <button onClick={() => removeItem('experiences', i)} className="text-red-500 text-sm">Delete Experience</button>
              </div>
            ))}
            <button onClick={() => addItem('experiences', { name: "", issuedBy: "", description: "", note: "" })} className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-2xl text-zinc-500 hover:text-orange-500 hover:border-orange-500 transition">+ Add Experience Card</button>
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