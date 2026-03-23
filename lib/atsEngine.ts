export const analyzeATS = (userData: any, jobDesc: string) => {
  let gScore = 0; 
  let mScore = 0; 
  const suggestions: string[] = [];
  const missing: string[] = [];
  const heatmap: any[] = [];

  if (!userData) return { gScore, mScore, suggestions, missing, heatmap };

  // ==========================================
  // 1. PROFILE HEALTH LOGIC (Base Score)
  // ==========================================
  if (userData.gmail && userData.linkedin && userData.github) {
    gScore += 30;
  } else {
    suggestions.push("Profile Setup: Add missing contact links (LinkedIn, GitHub, Email) to pass basic ATS filters.");
  }

  const skillsArr = userData.skills?.flatMap((s: any) => s.items?.split(',').map((i: string) => i.trim().toLowerCase())) || [];
  if (skillsArr.length >= 12) {
    gScore += 40;
  } else {
    suggestions.push("Skill Density Low: Add at least 12-15 core technical skills to improve your baseline ranking.");
  }

  if (userData.projects?.length >= 2 || userData.experiences?.length >= 1) {
    gScore += 30;
  } else {
    suggestions.push("Experience Gap: Ensure you have detailed at least 2 projects or 1 professional role.");
  }

  // ==========================================
  // 2. SMART JD MATCHING & KEYWORD EXTRACTION
  // ==========================================
  if (jobDesc && jobDesc.length > 10) {
    
    // 🔥 Massive list of corporate fluff to ignore so we focus on actual skills
    const stopWords = new Set([
      'and', 'the', 'is', 'are', 'with', 'this', 'that', 'from', 'your', 'skills', 'experience', 
      'using', 'working', 'work', 'team', 'ability', 'strong', 'knowledge', 'excellent', 'good', 
      'will', 'have', 'must', 'required', 'preferred', 'years', 'understanding', 'design', 
      'development', 'support', 'business', 'data', 'software', 'application', 'system', 'build', 
      'create', 'including', 'such', 'other', 'role', 'responsibilities', 'company', 'opportunity', 
      'looking', 'join', 'environment', 'about', 'what', 'which', 'who', 'how', 'when', 'where', 
      'there', 'their', 'they', 'our', 'you', 'can', 'could', 'should', 'would', 'may', 'might', 
      'into', 'upon', 'within', 'through', 'over', 'under', 'between', 'after', 'before', 'during', 
      'since', 'until', 'while', 'because', 'although', 'though', 'even', 'some', 'any', 'many', 
      'much', 'more', 'most', 'less', 'least', 'few', 'all', 'both', 'either', 'neither', 'each', 
      'every', 'only', 'also', 'too', 'very', 'quite', 'rather', 'almost', 'nearly', 'just', 'well', 
      'better', 'best', 'bad', 'worse', 'high', 'low', 'large', 'small', 'big', 'little', 'fast', 
      'slow', 'hard', 'easy', 'heavy', 'light', 'full', 'empty', 'needs', 'help', 'part', 'time'
    ]);

    // Format Resume Pool: We replace symbols with spaces EXCEPT for +, #, and . to save C++, C#, Node.js
    const rawResumeText = [
      userData.tagline, userData.aboutIntro, ...skillsArr,
      ...(userData.projects?.map((p: any) => `${p.name} ${p.description} ${p.techStack} ${p.note}`) || []),
      ...(userData.experiences?.map((e: any) => `${e.name} ${e.description} ${e.note}`) || []),
      ...(userData.education?.map((ed: any) => `${ed.name} ${ed.note} ${ed.college}`) || [])
    ].join(' ').toLowerCase();

    // Pad with spaces for Exact Word Boundary matching later
    const resumeCleaned = ' ' + rawResumeText.replace(/[^a-z0-9+#.]/g, ' ') + ' ';

    // Extract JD Words and calculate frequency
    const wordCounts: Record<string, number> = {};
    const rawJDWords = jobDesc.toLowerCase().replace(/[^a-z0-9+#.\-]/g, ' ').split(/\s+/);

    rawJDWords.forEach(w => {
       const cleanWord = w.replace(/^[.-]+|[.-]+$/g, ''); // Trim trailing/leading dots or hyphens
       if (cleanWord.length > 2 && !stopWords.has(cleanWord) && !/^\d+$/.test(cleanWord)) {
           wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
       }
    });

    // 🚀 Sort keywords by frequency (Most repeated words are likely core requirements)
    const sortedKeywords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    
    // We only benchmark against the Top 25 most relevant keywords to prevent score dilution
    const targetKeywords = sortedKeywords.slice(0, 25);
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    // Exact word boundary check using padded spaces
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

    // 🔥 NEW: Check for quantifiable metrics (numbers/percentages)
    const hasMetrics = /\d|%/.test(rawResumeText);
    if (!hasMetrics) {
        suggestions.push(`NLP Tip: Your profile lacks quantifiable metrics. ATS algorithms heavily favor data-backed achievements (e.g., "Increased efficiency by 20%").`);
    }
    
    // Check if JD mentions degree requirements that might be missing
    if ((jobDesc.toLowerCase().includes('bachelor') || jobDesc.toLowerCase().includes('degree')) && !rawResumeText.includes('bachelor') && !rawResumeText.includes('b.tech') && !rawResumeText.includes('degree')) {
        suggestions.push(`Education Alert: The JD mentions a degree requirement. Ensure your education section clearly lists your qualifications.`);
    }
  }

  return { gScore, mScore, suggestions, missing, heatmap };
};