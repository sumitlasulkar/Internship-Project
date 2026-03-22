export const analyzeATS = (userData: any, jobDesc: string) => {
  let gScore = 0; 
  let mScore = 0; 
  const suggestions: string[] = [];
  const missing: string[] = [];
  const heatmap: any[] = [];

  if (!userData) return { gScore, mScore, suggestions, missing, heatmap };

  // 1. Profile Health Logic (Existing)
  if (userData.gmail && userData.linkedin && userData.github) gScore += 30;
  else suggestions.push("Add LinkedIn, GitHub and Contact info.");

  const skillsArr = userData.skills?.flatMap((s: any) => s.items?.split(',').map((i: string) => i.trim().toLowerCase())) || [];
  if (skillsArr.length >= 10) gScore += 40;
  else suggestions.push("Skill density is low. Add 10+ core skills.");

  if (userData.projects?.length >= 2) gScore += 30;
  else suggestions.push("Add at least 2 detailed projects.");

  // 2. JD Matching & Heatmap Logic
  if (jobDesc && jobDesc.length > 5) {
    const stopWords = new Set(['and', 'the', 'is', 'are', 'with', 'this', 'that', 'from', 'your', 'skills', 'experience', 'using', 'working']);
    const jdWords = jobDesc.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
    
    const resumePool = [
      userData.tagline, userData.aboutIntro, ...skillsArr,
      ...(userData.projects?.map((p: any) => `${p.name} ${p.description} ${p.techStack}`) || []),
      ...(userData.experiences?.map((e: any) => `${e.name} ${e.note}`) || [])
    ].join(' ').toLowerCase();

    const uniqueJD = Array.from(new Set(jdWords));
    const matched = uniqueJD.filter(kw => resumePool.includes(kw));

    // 📊 Real-time Heatmap Data
    uniqueJD.slice(0, 10).forEach(word => {
        heatmap.push({
            word: word,
            found: resumePool.includes(word)
        });
    });
    
    mScore = uniqueJD.length > 0 ? Math.round((matched.length / uniqueJD.length) * 100) : 0;
    missing.push(...uniqueJD.filter(kw => !resumePool.includes(kw)).slice(0, 15));

    // 📝 NLP Style Bullet Point Improver Logic
    const weakVerbs = ['made', 'did', 'helped', 'worked', 'used', 'created'];
    const resumeText = resumePool.toLowerCase();
    const foundWeakVerbs = weakVerbs.filter(verb => resumeText.includes(verb));
    
    if (foundWeakVerbs.length > 0) {
        suggestions.push(`NLP Tip: Replace weak verbs like "${foundWeakVerbs.slice(0,2).join(', ')}" with Action Verbs like "Spearheaded", "Architected", or "Optimized".`);
    }
  }

  return { gScore, mScore, suggestions, missing, heatmap };
};