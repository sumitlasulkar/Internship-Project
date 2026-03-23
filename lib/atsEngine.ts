export const analyzeATS = (userData: any, jobDesc: string) => {
  let gScore = 0; 
  let mScore = 0; 
  const suggestions: string[] = [];
  const missing: string[] = [];
  const heatmap: any[] = [];

  // If no user data is loaded yet, return 0
  if (!userData) return { gScore, mScore, suggestions, missing, heatmap };

  // ==========================================
  // 1. DYNAMIC PROFILE HEALTH LOGIC (gScore)
  // ==========================================
  
  // A. Contact Info (Max 20 Points)
  let contactScore = 0;
  if (userData.gmail && userData.gmail.trim().length > 3) contactScore += 5;
  if (userData.linkedin && userData.linkedin.trim().length > 5) contactScore += 10;
  if (userData.github && userData.github.trim().length > 5) contactScore += 5;
  
  gScore += contactScore;
  if (contactScore < 20) {
    suggestions.push("Profile Setup: Add missing contact links (LinkedIn, GitHub, Email) to maximize ATS discoverability.");
  }

  // B. Skills Density (Max 40 Points)
  // Clean up empty skills from the dashboard form
  const skillsArr = userData.skills?.flatMap((s: any) => 
    (s.items || '').split(',')
      .map((i: string) => i.trim().toLowerCase())
      .filter((i: string) => i.length > 1) // Ignore empty commas
  ) || [];
  
  const validSkillsCount = skillsArr.length;

  // Incremental scoring for skills
  if (validSkillsCount >= 15) gScore += 40;
  else if (validSkillsCount >= 10) gScore += 30;
  else if (validSkillsCount >= 5) gScore += 20;
  else if (validSkillsCount > 0) gScore += 10;

  if (validSkillsCount < 12) {
    suggestions.push(`Skill Density Low: You only have ${validSkillsCount} valid skills listed. Aim for 12-15 core technical skills.`);
  }

  // C. Experience & Projects (Max 40 Points)
  let expScore = 0;
  
  // Filter out empty templates from the dashboard
  const validProjects = userData.projects?.filter((p: any) => p.name && p.name.trim().length > 2) || [];
  const validExp = userData.experiences?.filter((e: any) => e.name && e.name.trim().length > 2) || [];

  expScore += (validProjects.length * 10); // +10 pts per project
  expScore += (validExp.length * 15);      // +15 pts per experience

  if (expScore > 40) expScore = 40; // Cap at 40 points
  gScore += expScore;

  if (validProjects.length === 0 && validExp.length === 0) {
    suggestions.push("Experience Gap: Add at least 1 professional role or 2 detailed projects to boost your baseline score.");
  } else if (expScore < 30) {
    suggestions.push("Strengthen Portfolio: Add more descriptive projects or work experiences to hit a 100% Base Health score.");
  }

  // Safety cap for Base Health
  if (gScore > 100) gScore = 100;

  // ==========================================
  // 2. SMART JD MATCHING & KEYWORD EXTRACTION (mScore)
  // ==========================================
  if (jobDesc && jobDesc.trim().length > 10) {
    
    // Corporate fluff words to ignore
    const stopWords = new Set([
      'and', 'the', 'is', 'are', 'with', 'this', 'that', 'from', 'your', 'skills', 'experience', 
      'using', 'working', 'work', 'team', 'ability', 'strong', 'knowledge', 'excellent', 'good', 
      'will', 'have', 'must', 'required', 'preferred', 'years', 'understanding', 'design', 
      'development', 'support', 'business', 'data', 'software', 'application', 'system', 'build', 
      'create', 'including', 'such', 'other', 'role', 'responsibilities', 'company', 'opportunity', 
      'looking', 'join', 'environment', 'about', 'what', 'which', 'who', 'how', 'when', 'where', 
      'needs', 'help', 'part', 'time', 'fast', 'slow', 'hard', 'easy'
    ]);

    // Format Resume Pool: Replace symbols with spaces EXCEPT for +, #, and . (Saves C++, C#, Node.js)
    const rawResumeText = [
      userData.tagline, userData.aboutIntro, ...skillsArr,
      ...(validProjects.map((p: any) => `${p.name} ${p.description} ${p.techStack} ${p.note}`)),
      ...(validExp.map((e: any) => `${e.name} ${e.description} ${e.note}`)),
      ...(userData.education?.map((ed: any) => `${ed.name} ${ed.note} ${ed.college}`) || [])
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

    // Sort keywords by frequency (Most repeated words = Core requirements)
    const sortedKeywords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    
    // Benchmark against Top 25 keywords
    const targetKeywords = sortedKeywords.slice(0, 25);
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    // Exact word boundary check
    targetKeywords.forEach(kw => {
        if (resumeCleaned.includes(` ${kw} `)) {
            matchedKeywords.push(kw);
        } else {
            missingKeywords.push(kw);
        }
    });

    // Calculate Match Score
    mScore = targetKeywords.length > 0 ? Math.round((matchedKeywords.length / targetKeywords.length) * 100) : 0;
    
    // Populate UI Data structures
    missing.push(...missingKeywords.slice(0, 15));

    // 📊 Real-time Heatmap Data (Top 12 keywords for the grid UI)
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

    // Check for quantifiable metrics (numbers/percentages)
    const hasMetrics = /\d|%/.test(rawResumeText);
    if (!hasMetrics) {
        suggestions.push(`NLP Tip: Your profile lacks quantifiable metrics. ATS algorithms heavily favor data-backed achievements (e.g., "Increased efficiency by 20%").`);
    }
    
    // Check Degree Requirements
    if ((jobDesc.toLowerCase().includes('bachelor') || jobDesc.toLowerCase().includes('degree')) && !rawResumeText.includes('bachelor') && !rawResumeText.includes('b.tech') && !rawResumeText.includes('degree')) {
        suggestions.push(`Education Alert: The JD mentions a degree requirement. Ensure your education section clearly lists your qualifications.`);
    }
  }

  return { gScore, mScore, suggestions, missing, heatmap };
};