const { GoogleGenAI } = require('@google/genai');
const { generateGroundedEvaluation } = require('./interviewEvaluationService');

const QUESTION_BANKS = {
  Technical: [
    'Explain how you would design a cache eviction policy for a high-concurrency distributed system handling millions of reads.',
    'What is the difference between horizontal and vertical scaling, and how does consistent hashing assist distributed sharding?',
    'How do relational databases implement ACID transactions under high concurrent write loads using isolation levels?',
    'Walk me through a scenario where you debugged a memory leak or severe CPU spike in production code.',
  ],
  DSA: [
    'How would you detect a cycle in a directed graph versus an undirected graph, and what are the respective time complexities?',
    'Explain how Lowest Common Ancestor is calculated in a general binary tree compared to a Binary Search Tree.',
    'When choosing between Dynamic Programming and Greedy algorithms, what mathematical criteria dictate optimal substructure and greedy-choice properties?',
    'How does a Min-Heap support merging K sorted linked lists in O(N log K) time?',
  ],
  'Core CS': [
    'What is the difference between a process and a thread, and how does the operating system handle context switching overhead?',
    'Explain the TCP Three-Way Handshake and the rationale behind the TIME_WAIT state during connection teardown.',
    'Describe the structural differences between B-Trees and B+ Trees, and why B+ Trees are favored for database indexing on disk.',
    'What are the four necessary conditions for deadlocks in operating systems, and how can resource allocation graphs prevent them?',
  ],
  'HR & Behavioral': [
    'Tell me about a challenging technical project where you faced strict deadlines or ambiguous requirements. How did you prioritize?',
    'Describe a situation where you had a strong disagreement with a teammate or lead regarding architectural design. How did you resolve it?',
    'Why are you interested in joining this company specifically, and how do our core values align with your long-term engineering ambitions?',
    'Give an example of a mistake you made in code or communication. What was the impact and what safeguards did you put in place afterward?',
  ],
  Comprehensive: [
    'Tell me briefly about yourself, your core technical interests, and why you are excited about this engineering opportunity.',
    'Walk me through the architecture of your most technically complex project. What trade-offs did you make?',
    'Explain how you optimize database queries when dealing with millions of records in PostgreSQL or MongoDB.',
    'Describe how you handle conflict within an engineering team under tight delivery schedules.',
  ],
};

const generateInitialQuestion = (category = 'Technical', company = 'Amazon', jobTitle = 'Software Engineer') => {
  const bank = QUESTION_BANKS[category] || QUESTION_BANKS.Technical;
  const prefix = company && company !== 'General Technical Mock'
    ? `Welcome to your ${company} ${jobTitle} interview. Let's begin. `
    : 'Welcome to your mock interview session. Let\'s begin. ';
  return `${prefix}${bank[0]}`;
};

const generateNextResponse = async (transcript = [], category = 'Technical', company = 'Amazon', jobTitle = 'SDE') => {
  const lastUserMessage = [...transcript].reverse().find((item) => item.role === 'user')?.message || '';
  const questionCount = transcript.filter((item) => item.role === 'ai').length;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const historyText = transcript.slice(-6).map((item) => `${item.role.toUpperCase()}: ${item.message}`).join('\n');
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash',
        contents: `You are a senior technical interviewer at ${company} conducting a ${category} interview for a ${jobTitle} candidate.\n\nInterview history:\n${historyText}\n\nThe latest answer is: "${lastUserMessage}"\n\nAsk one concise follow-up that directly tests missing depth or move to the next ${category} topic. Do not score or praise an incorrect answer. Speak directly to the candidate in no more than three sentences.`,
      });
      if (response.text?.trim()) return response.text.trim();
    } catch (error) {
      console.warn(`[InterviewAiService] Gemini follow-up error (${error.message}). Using adaptive fallback.`);
    }
  }

  const normalized = lastUserMessage.toLowerCase();
  const currentQuestion = [...transcript].reverse().find((item) => item.role === 'ai')?.message || '';
  if (/cache|eviction/i.test(currentQuestion) && !/lru|lfu|ttl|evict|recency|frequency|cache|redis/i.test(normalized)) {
    return 'That response does not address cache eviction. How would you choose between LRU, LFU, and TTL-based eviction when memory is full, and how would you make the decision thread-safe?';
  }
  if (/cache|eviction/i.test(currentQuestion)) {
    return 'How would you prevent race conditions and cache stampedes while applying that eviction policy across concurrent requests?';
  }
  if (normalized.includes('scale') || normalized.includes('horizontal') || normalized.includes('load')) {
    return 'How would you maintain session state and data consistency while scaling that architecture across multiple regions?';
  }
  if (questionCount === 1) {
    return 'Your answer needs more depth. Explain the exact approach, its time and space costs, and one important trade-off.';
  }

  const bank = QUESTION_BANKS[category] || QUESTION_BANKS.Technical;
  return `Let's move to the next topic. ${bank[questionCount % bank.length]}`;
};

const clampScore = (value) => Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Math.round(Number(value)) : 0));

const normalizeAiEvaluation = (evaluation, grounded) => {
  if (!evaluation || typeof evaluation !== 'object') return grounded;
  if (grounded.overallScore <= 20 && clampScore(evaluation.overallScore) > 40) return grounded;

  const scoreFields = [
    'overallScore', 'technicalScore', 'problemSolvingScore', 'communicationScore',
    'confidenceScore', 'clarityScore', 'structureScore', 'concisenessScore',
  ];
  const normalized = { ...grounded, ...evaluation };
  scoreFields.forEach((field) => { normalized[field] = clampScore(evaluation[field]); });
  normalized.strengths = Array.isArray(evaluation.strengths) ? evaluation.strengths : grounded.strengths;
  normalized.improvements = Array.isArray(evaluation.improvements) ? evaluation.improvements : grounded.improvements;
  normalized.weaknessAnalysis = evaluation.weaknessAnalysis || grounded.weaknessAnalysis;
  normalized.recommendedPlan = Array.isArray(evaluation.recommendedPlan) ? evaluation.recommendedPlan : grounded.recommendedPlan;
  normalized.questionBreakdown = Array.isArray(evaluation.questionBreakdown) ? evaluation.questionBreakdown : grounded.questionBreakdown;
  return normalized;
};

const generateFinalEvaluation = async (transcript = [], category = 'Technical', company = 'Amazon', jobTitle = 'SDE') => {
  const grounded = generateGroundedEvaluation(transcript, category, company, jobTitle);
  const userAnswers = transcript.filter((item) => item.role === 'user' && item.message?.trim().split(/\s+/).length >= 4);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || userAnswers.length === 0) return grounded;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const fullTranscript = transcript.map((item) => `${item.role.toUpperCase()}: ${item.message}`).join('\n\n');
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash',
      contents: `You are an evidence-based technical interview assessor for ${company}. Evaluate this ${category} interview for a ${jobTitle} role.\n\n${fullTranscript}\n\nUse this strict rubric for every score: 0 = unanswered; 1-20 = irrelevant or no demonstrated knowledge; 21-40 = limited and substantially incorrect; 41-60 = partial understanding; 61-75 = competent; 76-90 = strong; 91-100 = exceptional and complete. Never assign a passing floor. Penalize unanswered follow-ups. Do not infer strengths or topics that are absent from the transcript. Base weaknesses on the actual questions asked.\n\nReturn JSON with: overallScore, technicalScore, problemSolvingScore, communicationScore, confidenceScore, clarityScore, structureScore, concisenessScore, summary, strengths (string array), improvements (string array), weaknessAnalysis {critical, needsImprovement, strong}, recommendedPlan, and questionBreakdown containing question, answer, rating, feedback.`,
      config: { responseMimeType: 'application/json', temperature: 0.1 },
    });
    return normalizeAiEvaluation(JSON.parse(response.text), grounded);
  } catch (error) {
    console.warn(`[InterviewAiService] Gemini evaluation error (${error.message}). Using grounded deterministic evaluation.`);
    return grounded;
  }
};

module.exports = { generateInitialQuestion, generateNextResponse, generateFinalEvaluation };
