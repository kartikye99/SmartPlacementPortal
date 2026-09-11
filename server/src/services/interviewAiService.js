const { GoogleGenAI } = require('@google/genai');

/**
 * Question banks for instant fallback
 */
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

/**
 * Generate initial opening question
 */
const generateInitialQuestion = (category = 'Technical', company = 'Amazon', jobTitle = 'Software Engineer') => {
  const bank = QUESTION_BANKS[category] || QUESTION_BANKS.Technical;
  const companyPrefix = company && company !== 'General Technical Mock' ? `Welcome to your ${company} ${jobTitle} interview! Let's begin. ` : 'Welcome to your mock interview session! Let\'s begin. ';
  return `${companyPrefix}${bank[0]}`;
};

/**
 * Generate adaptive follow-up or next question
 */
const generateNextResponse = async (transcript = [], category = 'Technical', company = 'Amazon', jobTitle = 'SDE') => {
  const lastUserMessage = [...transcript].reverse().find((m) => m.role === 'user')?.message || '';
  const questionCount = transcript.filter((m) => m.role === 'ai').length;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const historyText = transcript
        .slice(-6)
        .map((t) => `${t.role.toUpperCase()}: ${t.message}`)
        .join('\n');

      const prompt = `
You are a senior technical interviewer at ${company} conducting a ${category} interview for a ${jobTitle} candidate.
Current interview history:
${historyText}

The candidate just answered: "${lastUserMessage}"
Total questions asked so far: ${questionCount}.

Task:
- If the candidate's answer was good but could be probed deeper, formulate a sharp, direct technical follow-up challenge.
- If the answer has been thoroughly covered, transition naturally to the next question in ${category}.
- Keep your response conversational, concise (2-3 sentences max), professional, and realistic like a real senior interviewer.
Do not evaluate or score right now; speak directly to the candidate as the interviewer.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text && response.text.trim()) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn(`[InterviewAiService] Gemini follow-up error (${err.message}). Using adaptive fallback.`);
    }
  }

  // Adaptive deterministic follow-up logic
  const normAns = lastUserMessage.toLowerCase();
  if (questionCount === 1) {
    if (normAns.includes('redis') || normAns.includes('cache')) {
      return `Good explanation. When using an in-memory cache like Redis, how would you protect your database against cache stampedes or thundering herd problems during cache invalidation?`;
    }
    if (normAns.includes('scale') || normAns.includes('horizontal') || normAns.includes('load')) {
      return `Interesting point on scaling. How do you maintain session state and data consistency when scaling microservices across multiple geographical regions?`;
    }
    return `You touched on some foundational concepts. Could you dive deeper into the specific time and space trade-offs associated with that approach?`;
  }

  // Cycle through questions bank
  const bank = QUESTION_BANKS[category] || QUESTION_BANKS.Technical;
  const nextIdx = questionCount % bank.length;
  return `Understood. Let's transition to the next topic: ${bank[nextIdx]}`;
};

/**
 * Generate comprehensive final post-interview report with 8-dimension analysis & weakness engine
 */
const generateFinalEvaluation = async (transcript = [], category = 'Technical', company = 'Amazon', jobTitle = 'SDE') => {
  const userAnswers = transcript.filter((m) => m.role === 'user');
  const aiQuestions = transcript.filter((m) => m.role === 'ai');

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && userAnswers.length > 0) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const fullTranscript = transcript
        .map((t) => `${t.role.toUpperCase()}: ${t.message}`)
        .join('\n\n');

      const prompt = `
You are a Staff Technical Recruiter and Engineering Bar Raiser at ${company}.
Evaluate this complete mock interview transcript for a ${jobTitle} position (${category}):

${fullTranscript}

Task: Perform a deep analytical evaluation across 8 performance dimensions, perform 3-tier weakness detection, and formulate an actionable re-preparation plan.

Respond strictly in valid JSON matching this schema:
{
  "overallScore": 78,
  "technicalScore": 84,
  "problemSolvingScore": 85,
  "communicationScore": 72,
  "confidenceScore": 68,
  "clarityScore": 76,
  "structureScore": 81,
  "concisenessScore": 70,
  "summary": "Demonstrated solid technical grasp of core systems but requires more concise framing and deeper dynamic programming rigor.",
  "strengths": ["Clear articulation of database indexing", "Maintained composure during technical follow-up probes", "Solid architecture reasoning"],
  "improvements": ["Quantify results more frequently", "Structure behavioral responses using STAR method", "Improve conciseness"],
  "weaknessAnalysis": {
    "critical": [
      {
        "topic": "Dynamic Programming",
        "reason": "Struggled with optimal substructure formulation and memoization table design."
      }
    ],
    "needsImprovement": [
      {
        "topic": "DBMS",
        "reason": "Could not clearly articulate dirty read vs phantom read isolation levels."
      },
      {
        "topic": "Communication",
        "reason": "Explanations occasionally wandered into secondary tangents before addressing the core question."
      }
    ],
    "strong": [
      {
        "topic": "OOP",
        "reason": "Clear, practical application of SOLID principles and interface segregation."
      },
      {
        "topic": "Arrays & Caching",
        "reason": "Strong grasp of LRU cache eviction and two-pointer traversal trade-offs."
      }
    ]
  },
  "recommendedPlan": [
    {
      "action": "Revise Dynamic Programming",
      "category": "revision",
      "topic": "Dynamic Programming",
      "detail": "Review 1D and 2D state transitions, knapsack variations, and top-down vs bottom-up trade-offs."
    },
    {
      "action": "Practice 5 DP problems",
      "category": "coding",
      "topic": "Dynamic Programming",
      "targetCount": 5,
      "link": "/student/practice?topic=Dynamic%20Programming",
      "detail": "Complete 5 high-frequency LeetCode/GFG questions in the Coding Arena."
    },
    {
      "action": "Study DBMS Normalization & Transactions",
      "category": "corecs",
      "topic": "DBMS",
      "detail": "Review 1NF to BCNF, ACID guarantees, and 2-phase locking concurrency."
    },
    {
      "action": "Practice STAR Behavioral Answers",
      "category": "behavioral",
      "detail": "Draft and rehearse concise 90-second STAR stories for leadership principles."
    },
    {
      "action": "Retake Targeted Mock Interview",
      "category": "interview",
      "detail": "Schedule another focused 15-minute mock interview to measure score improvements.",
      "link": "/student/interview"
    }
  ],
  "questionBreakdown": [
    {
      "question": "Question text",
      "answer": "Candidate answer summary",
      "rating": 85,
      "feedback": "Specific feedback for this answer"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const parsed = JSON.parse(response.text);
      return parsed;
    } catch (err) {
      console.warn(`[InterviewAiService] Gemini evaluation error (${err.message}). Using deterministic evaluation.`);
    }
  }

  // Deterministic evaluation fallback with full 8 dimensions & weakness analysis
  const totalAnswers = userAnswers.length;
  const avgWords = totalAnswers > 0
    ? userAnswers.reduce((acc, a) => acc + a.message.split(' ').length, 0) / totalAnswers
    : 0;

  const combinedText = userAnswers.map((a) => a.message.toLowerCase()).join(' ');

  // Base scoring calibrated around 68-88
  const baseScore = Math.min(88, Math.max(65, Math.round(68 + Math.min(20, avgWords * 0.4))));
  const techScore = Math.min(92, Math.max(60, baseScore + (combinedText.includes('redis') || combinedText.includes('cache') ? 6 : 2)));
  const problemSolvingScore = Math.min(94, Math.max(62, baseScore + (combinedText.includes('hash') || combinedText.includes('tree') ? 5 : 1)));
  const commScore = Math.min(88, Math.max(58, avgWords > 30 ? 76 : 68));
  const confScore = Math.min(86, Math.max(60, baseScore - 2));
  const clarityScore = Math.min(90, Math.max(60, baseScore + 1));
  const structureScore = Math.min(90, Math.max(62, combinedText.includes('approach') || combinedText.includes('trade-off') ? 83 : 75));
  const concisenessScore = Math.min(88, Math.max(55, avgWords > 60 ? 68 : 80));

  const weightedOverall = Math.round(
    techScore * 0.25 +
    problemSolvingScore * 0.2 +
    commScore * 0.15 +
    structureScore * 0.15 +
    clarityScore * 0.1 +
    confScore * 0.08 +
    concisenessScore * 0.07
  );

  // Dynamic Weakness Engine
  const critical = [];
  const needsImprovement = [];
  const strong = [];

  if (category === 'DSA' || !combinedText.includes('dp') || !combinedText.includes('dynamic')) {
    critical.push({
      topic: 'Dynamic Programming',
      reason: 'State transitions and subproblem recurrence relation were not fully proven.',
    });
  }

  if (combinedText.includes('redis') || combinedText.includes('cache')) {
    strong.push({
      topic: 'Distributed Caching',
      reason: 'Demonstrated solid grasp of Redis sharding, LRU eviction, and mutex invalidation.',
    });
  } else {
    needsImprovement.push({
      topic: 'System Scalability',
      reason: 'Could elaborate more thoroughly on caching layers and distributed bottlenecks.',
    });
  }

  if (combinedText.includes('hash') || combinedText.includes('oop') || combinedText.includes('interface')) {
    strong.push({
      topic: 'OOP & Architecture',
      reason: 'Effective decomposition of modular components and data structures.',
    });
  } else {
    strong.push({
      topic: 'Core CS Foundations',
      reason: 'Good foundational grasp of operating systems and network protocols.',
    });
  }

  if (commScore < 75 || avgWords < 20) {
    needsImprovement.push({
      topic: 'Communication & Pacing',
      reason: 'Answers would benefit from structured STAR framing and concise summaries.',
    });
  }

  if (needsImprovement.length === 0) {
    needsImprovement.push({
      topic: 'DBMS Normalization',
      reason: 'Strengthen explanation of isolation anomalies and transaction consistency under high concurrency.',
    });
  }

  const breakdown = [];
  for (let i = 0; i < Math.min(aiQuestions.length, userAnswers.length); i++) {
    breakdown.push({
      question: aiQuestions[i].message,
      answer: userAnswers[i].message,
      rating: Math.min(95, 74 + i * 5),
      feedback: i === 0
        ? 'Clear conceptual start with appropriate terminology and architectural context.'
        : 'Good technical reasoning; incorporating exact performance metrics would strengthen the response.',
    });
  }

  return {
    overallScore: weightedOverall,
    technicalScore: techScore,
    problemSolvingScore: problemSolvingScore,
    communicationScore: commScore,
    confidenceScore: confScore,
    clarityScore: clarityScore,
    structureScore: structureScore,
    concisenessScore: concisenessScore,
    summary: `Demonstrated solid ${category.toLowerCase()} proficiency for ${company} ${jobTitle}. Strongest in problem decomposition and caching fundamentals, with opportunities to sharpen dynamic programming rigor and behavioral structure.`,
    strengths: [
      'Articulated trade-offs clearly between competing algorithmic and architectural designs.',
      'Maintained composure and technical focus during adaptive follow-up probes.',
      'Showcased practical knowledge of system scalability, distributed caching, and concurrency.',
    ],
    improvements: [
      'Quantify results more frequently (e.g., specific latency reductions, asymptotic complexity).',
      'Use the STAR method (Situation, Task, Action, Result) more rigorously for behavioral and problem-solving prompts.',
      'Keep initial answers concise before diving into low-level implementation details.',
    ],
    weaknessAnalysis: {
      critical,
      needsImprovement,
      strong,
    },
    recommendedPlan: [
      {
        action: 'Revise Dynamic Programming',
        category: 'revision',
        topic: 'Dynamic Programming',
        detail: 'Review optimal substructure, 1D/2D memoization tables, and space optimization techniques.',
      },
      {
        action: 'Practice 5 DP problems',
        category: 'coding',
        topic: 'Dynamic Programming',
        targetCount: 5,
        link: '/student/practice?topic=Dynamic%20Programming',
        detail: 'Solve 5 recommended questions from the Phase 4 Coding Arena.',
      },
      {
        action: 'Study DBMS Normalization & ACID',
        category: 'corecs',
        topic: 'DBMS',
        detail: 'Deep dive into 1NF-BCNF normalization, isolation levels, and MVCC.',
      },
      {
        action: 'Practice STAR Behavioral Answers',
        category: 'behavioral',
        detail: 'Draft structured STAR narratives for conflict resolution and high-pressure delivery.',
      },
      {
        action: 'Retake Targeted Interview',
        category: 'interview',
        detail: 'Schedule a 15-minute follow-up session to verify weakness remediation.',
        link: '/student/interview',
      },
    ],
    questionBreakdown: breakdown,
  };
};

module.exports = {
  generateInitialQuestion,
  generateNextResponse,
  generateFinalEvaluation,
};
