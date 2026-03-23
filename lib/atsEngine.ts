export const analyzeATS = (userData: any, jobDesc: string) => {
  let gScore = 0; 
  let mScore = 0; 
  const suggestions: string[] = [];
  const missing: string[] = [];
  const heatmap: any[] = [];

  // Guard against null or empty object (Prevents crashes)
  if (!userData || Object.keys(userData).length === 0) return { gScore, mScore, suggestions, missing, heatmap };

  // Helper to safely check and clean strings from the database
  const isValidStr = (val: any, minLen: number) => typeof val === 'string' && val.trim().length > minLen;

  // ==========================================
  // 1. 100% DYNAMIC BASE HEALTH LOGIC (gScore)
  // ==========================================
  
  // A. Contact & Basic Info (Max 10 Points)
  let contactScore = 0;
  if (isValidStr(userData.name, 2)) contactScore += 2.5;
  if (isValidStr(userData.gmail, 5)) contactScore += 2.5;
  if (isValidStr(userData.linkedin, 5)) contactScore += 2.5;
  if (isValidStr(userData.github, 5)) contactScore += 2.5;
  gScore += contactScore;

  if (contactScore < 10) {
    suggestions.push("Profile Setup: Complete your basic info (Name, Email, LinkedIn, GitHub) for better visibility.");
  }

  // B. Education (Max 15 Points)
  const validEdu = Array.isArray(userData.education) ? userData.education.filter((ed: any) => isValidStr(ed?.name, 2)) : [];
  let eduScore = Math.min(validEdu.length * 15, 15); 
  gScore += eduScore;

  if (eduScore === 0) {
    suggestions.push("Education Missing: Add at least 1 education entry (Degree/College) to your profile.");
  }

  // C. Skills Density (Max 30 Points -> 2 points per skill)
  const skillsArr = Array.isArray(userData.skills) ? userData.skills.flatMap((s: any) => 
    (typeof s?.items === 'string' ? s.items : '').split(',')
      .map((i: string) => i.trim().toLowerCase())
      .filter((i: string) => i.length > 1) 
  ) : [];
  
  const validSkillsCount = skillsArr.length;
  let skillScore = Math.min(validSkillsCount * 2, 30); 
  gScore += skillScore;

  if (validSkillsCount < 15) {
    suggestions.push(`Skill Density: You have ${validSkillsCount}/15 recommended skills. Add ${15 - validSkillsCount} more to max out this section.`);
  }

  // D. Projects (Max 25 Points -> 12.5 points per project)
  const validProjects = Array.isArray(userData.projects) ? userData.projects.filter((p: any) => isValidStr(p?.name, 2)) : [];
  let projScore = Math.min(validProjects.length * 12.5, 25); 
  gScore += projScore;

  if (validProjects.length < 2) {
    suggestions.push(`Projects: You only have ${validProjects.length} project(s). Add at least ${2 - validProjects.length} more detailed project to boost your score.`);
  }

  // E. Experience (Max 20 Points -> 10 points per experience)
  const validExp = Array.isArray(userData.experiences) ? userData.experiences.filter((e: any) => isValidStr(e?.name, 2)) : [];
  let expScore = Math.min(validExp.length * 10, 20);
  gScore += expScore;

  if (validExp.length === 0) {
    suggestions.push("Experience: Add at least 1-2 professional roles or internships to hit a 100% score.");
  }

  gScore = Math.round(gScore);
  if (gScore > 100) gScore = 100;

  // ==========================================
  // 2. SMART JD MATCHING & KEYWORD EXTRACTION (mScore)
  // ==========================================
  if (jobDesc && jobDesc.trim().length > 10) {
    
    const stopWords = new Set([
      'and', 'the', 'is', 'are', 'with', 'this', 'that', 'from', 'your', 'skills', 'experience', 
      'using', 'working', 'work', 'team', 'ability', 'strong', 'knowledge', 'excellent', 'good', 
      'will', 'have', 'must', 'required', 'preferred', 'years', 'understanding', 'design', 
      'development', 'support', 'business', 'data', 'software', 'application', 'system', 'build', 
      'create', 'including', 'such', 'other', 'role', 'responsibilities', 'company', 'opportunity', 
      'looking', 'join', 'environment', 'about', 'what', 'which', 'who', 'how', 'when', 'where', 
      'needs', 'help', 'part', 'time', 'fast', 'slow', 'hard', 'easy'
    ]);

    // Format Resume Pool
    const rawResumeText = [
      userData.tagline, userData.aboutIntro, ...skillsArr,
      ...(validProjects.map((p: any) => `${p.name} ${p.description} ${p.techStack} ${p.note}`)),
      ...(validExp.map((e: any) => `${e.name} ${e.description} ${e.note}`)),
      ...(validEdu.map((ed: any) => `${ed.name} ${ed.note} ${ed.college}`))
    ].join(' ').toLowerCase();

    // Pad with spaces for Exact Word Boundary matching
    const resumeCleaned = ' ' + rawResumeText.replace(/[^a-z0-9+#.]/g, ' ') + ' ';

    // Extract JD Words and calculate frequency
    const wordCounts: Record<string, number> = {};
    const rawJDWords = jobDesc.toLowerCase().replace(/[^a-z0-9+#.\-]/g, ' ').split(/\s+/);

    rawJDWords.forEach(w => {
       const cleanWord = w.replace(/^[.-]+|[.-]+$/g, ''); 
       if (cleanWord.length > 2 && !stopWords.has(cleanWord) && !/^\d+$/.test(cleanWord)) {
           wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
       }
    });

    const sortedKeywords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    const targetKeywords = sortedKeywords.slice(0, 25);
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    targetKeywords.forEach(kw => {
        if (resumeCleaned.includes(` ${kw} `)) {
            matchedKeywords.push(kw);
        } else {
            missingKeywords.push(kw);
        }
    });

    mScore = targetKeywords.length > 0 ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) : 0;
    missing.push(...missingKeywords.slice(0, 15));

    targetKeywords.slice(0, 12).forEach(word => {
        heatmap.push({
            word: word,
            found: matchedKeywords.includes(word)
        });
    });

    // ==========================================
    // 3. ADVANCED NLP STYLE ANALYZER
    // ==========================================
    const weakVerbs = ['made', 'did', 'helped', 'worked', 'used', 'created', 'built', 'managed', 'was', 'responsible', 'handled'];
    const foundWeakVerbs = weakVerbs.filter(verb => resumeCleaned.includes(` ${verb} `));
    
    if (foundWeakVerbs.length > 0) {
        suggestions.push(`NLP Tip: Replace weak verbs like "${foundWeakVerbs.slice(0,2).join(', ')}" with strong action verbs like "Architected", "Spearheaded", or "Optimized".`);
    }

    const hasMetrics = /\d|%/.test(rawResumeText);
    if (!hasMetrics) {
        suggestions.push(`NLP Tip: Your profile lacks quantifiable metrics. ATS algorithms heavily favor data-backed achievements (e.g., "Increased efficiency by 20%").`);
    }
    
    if ((jobDesc.toLowerCase().includes('bachelor') || jobDesc.toLowerCase().includes('degree')) && !rawResumeText.includes('bachelor') && !rawResumeText.includes('b.tech') && !rawResumeText.includes('degree')) {
        suggestions.push(`Education Alert: The JD mentions a degree requirement. Ensure your education section clearly lists your qualifications.`);
    }
  }

  return { gScore, mScore, suggestions, missing, heatmap };
};