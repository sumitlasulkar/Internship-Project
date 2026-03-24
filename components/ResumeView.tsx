import React, { forwardRef } from 'react';

export const ResumeView = forwardRef<HTMLDivElement, { data: any }>(({ data }, ref) => {
  return (
    <div 
      ref={ref} 
      className="p-10 bg-white text-black font-serif leading-tight min-h-[1123px] w-[794px] mx-auto"
      style={{ color: '#000', backgroundColor: '#fff', fontSize: '11pt' }}
    >
      {/* 1. HEADER - CENTERED [cite: 2, 3] */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-normal mb-1">{data.name || "MAYURI KOLHE"}</h1>
        <div className="flex justify-center flex-wrap gap-x-2 text-[10pt]">
          <span className="underline">{data.mobile || "8698648377"}</span> |
          <span className="underline">{data.gmail || "kolhem10@gmail.com"}</span> |
          <span className="underline">{data.city || "Nashik, India"}</span>
          {data.portfolio && <> | <span className="underline text-blue-700">Portfolio</span></>}
        </div>
      </div>

      {/* 2. EDUCATION SECTION [cite: 1, 4, 5] */}
      <div className="mb-4">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2">Education</h2>
        {data.education && data.education.map((edu: any, i: number) => (
          <div key={i} className="mb-2">
            <div className="flex justify-between font-bold">
              <span>{edu.college || "Pune Institute of Computer Technology"}</span>
              <span>{edu.year || "2022 – 2025"}</span>
            </div>
            <div className="flex justify-between italic text-[10pt]">
              <span>{edu.name || "Bachelor's of Engineering in Computer Engineering"}</span>
              <span>{edu.grade ? `CGPA: ${edu.grade}` : "Nashik, India"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. EXPERIENCE SECTION [cite: 6, 7, 8, 15, 17, 20] */}
      <div className="mb-4">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2">Experience</h2>
        {data.experiences && data.experiences.map((exp: any, i: number) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between font-bold">
              <span>{exp.name || "Mastercard"}</span>
              <span>{exp.issuedBy || "May 2024 – July 2024"}</span>
            </div>
            <div className="flex justify-between italic text-[10pt] mb-1">
              <span>{exp.description || "Software Engineer Intern"}</span>
           
            </div>
            <ul className="list-disc ml-5 text-[10pt] space-y-1">
              {exp.note && exp.note.split('\n').map((line: string, idx: number) => (
                <li key={idx} className="text-justify">{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 4. PROJECTS SECTION [cite: 29, 30, 31, 33, 34] */}
      <div className="mb-4">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2">Projects</h2>
        {data.projects && data.projects.map((proj: any, i: number) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between font-bold">
              <span>{proj.name || "InnoVenture"} | <span className="font-normal italic text-[9pt]">{proj.techStack || "ReactJS, Firebase"}</span></span>
           
            </div>
            <ul className="list-disc ml-5 text-[10pt] space-y-1 mt-1">
              <li className="text-justify">{proj.description}</li>
              {proj.note && <li className="text-justify">{proj.note}</li>}
            </ul>
          </div>
        ))}
      </div>

      {/* 5. TECHNICAL SKILLS [cite: 25, 26, 27, 28] */}
      <div className="mb-4">
        <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
        <div className="text-[10pt] space-y-1">
          {data.skills && data.skills.map((s: any, i: number) => (
            <div key={i}>
              <span className="font-bold">{s.category || "Languages"}: </span>
              <span>{s.items || "C/C++, Python, Javascript"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. ACHIEVEMENTS (Optional) [cite: 37, 38, 39] */}
      {data.achievements && (
        <div className="mb-4">
          <h2 className="text-[11pt] font-bold uppercase border-b border-black mb-2">Achievements</h2>
          <ul className="list-disc ml-5 text-[10pt] space-y-1">
             {data.achievements.split('\n').map((ach: string, idx: number) => (
                <li key={idx}>{ach}</li>
             ))}
          </ul>
        </div>
      )}
    </div>
  );
});

ResumeView.displayName = "ResumeView";