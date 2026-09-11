const { GoogleGenAI } = require('@google/genai');

// High-precision fallback analyzer tailored for top tech roles when offline or GEMINI_API_KEY is not set
const generateDeterministicAnalysis = (job) => {
  const companyName = job.company?.name || 'Tech Company';
  const roleTitle = job.title || 'Software Engineer';
  const jd = job.description || '';

  // Extract programming languages from JD or provide standard defaults
  const knownLangs = ['Python', 'Java', 'C++', 'Go', 'TypeScript', 'JavaScript', 'C#', 'Rust', 'Kotlin', 'SQL'];
  const matchedLangs = knownLangs.filter((l) => {
    const escaped = l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:\\b|(?<=\\s))${escaped}(?:\\b|(?=\\s))`, 'i').test(jd);
  });
  const programmingLanguages = matchedLangs.length > 0 ? matchedLangs : ['Java', 'C++', 'Python', 'Go'];

  // Company-specific flavor adjustments
  const isGoogle = /google/i.test(companyName);
  const isAmazon = /amazon/i.test(companyName);
  const isMicrosoft = /microsoft/i.test(companyName);
  const isGoldman = /goldman/i.test(companyName);
  const isApple = /apple/i.test(companyName);

  return {
    summary: `${companyName} is hiring for the ${roleTitle} position. This role demands deep mastery of scalable software engineering, robust algorithm optimization, and clean microservice architecture to build production-grade distributed systems.`,
    responsibilities: [
      `Design, implement, and maintain high-throughput backend services and distributed data flows.`,
      `Collaborate with cross-functional engineering teams to translate product requirements into resilient software architecture.`,
      `Write production-grade, maintainable, and unit-tested code in ${programmingLanguages.slice(0, 3).join(', ')}.`,
      `Analyze latency bottlenecks, optimize memory allocations, and ensure 99.99% service availability.`,
      `Participate in peer code reviews, CI/CD automation, and architectural design reviews.`,
    ],
    requiredSkills: [
      'Data Structures & Algorithms',
      'Object-Oriented Design & Clean Architecture',
      'REST APIs & Microservices',
      'Relational / NoSQL Databases',
      'Git Version Control & CI/CD Pipelines',
    ],
    preferredSkills: [
      'Distributed Systems & Caching (Redis/Memcached)',
      'Docker & Container Orchestration (Kubernetes)',
      'Cloud Platforms (GCP / AWS / Azure)',
      'Asynchronous Messaging (Kafka / RabbitMQ)',
    ],
    programmingLanguages,
    dsaTopics: [
      'Dynamic Programming (Knapsack, LCS, Matrix Traversal)',
      'Graph Algorithms (BFS, DFS, Dijkstra, Topological Sort)',
      'Trees & Binary Search Trees (LCA, Serialization)',
      'Sliding Window & Two Pointers',
      'Heap & Priority Queue (Top-K Elements, Median of Stream)',
      'Trie & Prefix Tree Lookup',
    ],
    coreCsTopics: [
      'Operating Systems: Multi-threading, Mutex/Semaphores, Virtual Memory, Deadlock Prevention',
      'DBMS: ACID Properties, B+ Tree Indexing, Normalization, Query Optimization',
      'Computer Networks: TCP/IP Stack, Three-Way Handshake, DNS Resolution, HTTP/2 & HTTPS TLS',
      'System Design: Scalability, Load Balancing, Horizontal vs Vertical Scaling, CAP Theorem',
    ],
    softSkills: [
      isAmazon ? 'Customer Obsession & Bias for Action (Amazon Leadership Principles)' : 'Problem Solving & Algorithmic Rigor',
      'Clear Architectural Communication & Trade-off Articulation',
      'Ownership Mentality & Self-Directed Debugging',
      'Constructive Code Reviewing & Collaboration',
    ],
    interviewFocus: [
      'Round 1 — Online Assessment (OA): 2 Algorithmic LeetCode Medium/Hard challenges (70-90 mins).',
      'Round 2 — Technical Screening: Core Data Structures, Big-O Complexity, and Live Coding.',
      'Round 3 — Advanced Technical & Low-Level Design (LLD): Concurrency, Database Schema, and Clean OOP.',
      isAmazon
        ? 'Round 4 — Bar Raiser & Amazon Leadership Principles (STAR Format Behavioral Evaluation).'
        : 'Round 4 — Managerial & Culture Fit: Past projects, conflict resolution, and architectural dilemmas.',
    ],
    skillImportance: [
      { skill: 'Data Structures & Algorithms', importance: 'Must-Have', reason: 'Elimination round in OA and primary filter in Technical Round 1.' },
      { skill: 'Operating Systems & Concurrency', importance: 'Must-Have', reason: 'Essential for building high-concurrency microservices without race conditions.' },
      { skill: 'System Design & Database Indexing', importance: 'Important', reason: 'Differentiates candidates moving from intermediate to senior interview feedback.' },
      { skill: 'Cloud & Docker Containers', importance: 'Nice-to-Have', reason: 'Provides bonus edge during team matching and deployment discussions.' },
    ],
    topicPriority: [
      { topic: 'Dynamic Programming & Memoization', category: 'DSA', priority: 'High', expectedQuestions: '1-2 Questions in OA' },
      { topic: 'Graph Traversals (BFS/DFS/Shortest Path)', category: 'DSA', priority: 'High', expectedQuestions: '1 Question in Tech Round' },
      { topic: 'B+ Tree Indexing & Transaction Isolation', category: 'Core CS', priority: 'High', expectedQuestions: '2-3 In-depth concept checks' },
      { topic: 'Multi-threading, Deadlocks & Virtual Memory', category: 'Core CS', priority: 'High', expectedQuestions: 'Deep dive in Technical Round 2' },
      { topic: 'Load Balancing & Consistent Hashing', category: 'System Design', priority: 'Medium', expectedQuestions: 'Design scenario challenge' },
      { topic: 'TCP 3-Way Handshake & HTTPS Flow', category: 'Core CS', priority: 'Medium', expectedQuestions: 'Foundational networking check' },
    ],
    roadmap: [
      {
        week: 1,
        title: 'Week 1: Algorithmic Foundations & Core Arrays/Strings',
        description: 'Master high-yield DSA patterns and time/space complexity analysis.',
        milestones: [
          'Solve 15 Sliding Window and Two Pointer problems.',
          'Review String matching and HashMap/Prefix Sum algorithms.',
          'Time yourself: Complete 2 medium problems within 45 minutes.',
        ],
      },
      {
        week: 2,
        title: 'Week 2: Non-Linear Data Structures (Trees, Graphs & DP)',
        description: 'Tackle the highest elimination topics in tech recruitment screenings.',
        milestones: [
          'Implement Tree LCA, Invert Tree, and Level Order Traversal.',
          'Solve 10 Graph BFS/DFS connected components and cycle detection problems.',
          'Master classic 1D & 2D Dynamic Programming states (LCS, LIS, Coin Change).',
        ],
      },
      {
        week: 3,
        title: 'Week 3: Core Computer Science Theory & System Design Basics',
        description: 'Prepare for rapid-fire technical questions from senior engineers.',
        milestones: [
          'Revise OS Processes, Threads, Context Switching, and Semaphore vs Mutex.',
          'Review DBMS Indexing, ACID guarantees, and SQL query optimization.',
          'Study System Design building blocks: Caching, Load Balancers, and CDNs.',
        ],
      },
      {
        week: 4,
        title: 'Week 4: Mock OA Tests, Behavioral STAR Stories & Final Polish',
        description: 'Simulate the exact interview environment under realistic pressure.',
        milestones: [
          'Complete 3 timed 90-minute mock coding assessments.',
          'Structure 4 project STAR stories (Situation, Task, Action, Result).',
          'Review your resume line-by-line; be ready to defend every technical choice.',
        ],
      },
    ],
    codingProblems: [
      { id: 'cp-1', title: 'Two Sum & 3Sum Patterns', difficulty: 'Medium', topic: 'Arrays & Two Pointers', link: 'https://leetcode.com/problems/3sum/' },
      { id: 'cp-2', title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Sliding Window', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: 'cp-3', title: 'Number of Islands (Grid BFS/DFS)', difficulty: 'Medium', topic: 'Graphs', link: 'https://leetcode.com/problems/number-of-islands/' },
      { id: 'cp-4', title: 'Course Schedule (Topological Sort / Cycle Detection)', difficulty: 'Medium', topic: 'Graphs', link: 'https://leetcode.com/problems/course-schedule/' },
      { id: 'cp-5', title: 'Coin Change & 0/1 Knapsack', difficulty: 'Medium', topic: 'Dynamic Programming', link: 'https://leetcode.com/problems/coin-change/' },
      { id: 'cp-6', title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers & Stacks', link: 'https://leetcode.com/problems/trapping-rain-water/' },
      { id: 'cp-7', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
    ],
    coreCsFlashcards: [
      {
        subject: 'Operating Systems',
        question: 'What is the difference between a Process and a Thread?',
        answer: 'A Process is an independent executing program with its own dedicated virtual address space and resources. A Thread is a lightweight subunit of execution within a process that shares the code, data, and heap segments with other threads of the same process, but maintains its own stack and registers.',
        keyPoints: ['Process = Isolated memory', 'Thread = Shared memory, low context switch overhead'],
      },
      {
        subject: 'Database Management',
        question: 'How do B+ Trees enable fast index lookups and range scans?',
        answer: 'B+ Trees store all actual data pointers in leaf nodes while internal nodes store only routing keys. Leaf nodes are linked as a doubly-linked list, enabling O(log N) point lookups and extremely fast sequential range scans without traversing back up the tree.',
        keyPoints: ['High fan-out reduces disk I/O', 'Linked leaves enable efficient range queries'],
      },
      {
        subject: 'Computer Networks',
        question: 'Explain the TCP 3-Way Handshake and why SYN-ACK is required.',
        answer: '1. Client sends SYN (synchronize sequence number). 2. Server responds with SYN-ACK (acknowledging client and proposing server sequence number). 3. Client sends ACK. This guarantees both parties verify that bidirectional data transmission channels are functional before payload transfer.',
        keyPoints: ['Establishes initial sequence numbers', 'Guarantees reliable bidirectional delivery'],
      },
      {
        subject: 'System Design',
        question: 'What is the CAP Theorem and how does it influence architectural choices?',
        answer: 'In any distributed data store, you can guarantee at most two of three properties: Consistency (every read receives most recent write), Availability (every non-failing node returns non-error response), and Partition Tolerance (system continues operating despite arbitrary network dropped messages). Since network partitions are inevitable in distributed systems, architects must choose between CP or AP.',
        keyPoints: ['P is mandatory in networks', 'Choose CP for banking/fintech, AP for social feeds'],
      },
    ],
    interviewQuestions: [
      {
        round: 'OA & Screening',
        question: 'Given an array of integers representing stock prices, find the maximum profit you can achieve with at most 2 transactions.',
        tip: 'Think of dynamic programming with states: buy1, sell1, buy2, sell2.',
      },
      {
        round: 'Technical Round 1',
        question: 'How would you detect a memory leak in a Node.js or Java production service?',
        tip: 'Mention heap snapshots, profiling tools (v8-profiler, JConsole), and monitoring Garbage Collection frequency trends.',
      },
      {
        round: 'Technical Round 2 (LLD)',
        question: 'Design an in-memory Rate Limiter with a Token Bucket or Sliding Window Log algorithm.',
        tip: 'Discuss thread safety, synchronized locks vs Redis atomic scripts, and memory consumption under 100k requests/sec.',
      },
      {
        round: 'Behavioral & Leadership',
        question: 'Tell me about a time you faced technical disagreement with a team member. How did you resolve it?',
        tip: 'Use the STAR format: Explain the technical dilemma, how you gathered objective benchmark data, and focused on customer impact over ego.',
      },
    ],
    resumeTips: [
      {
        category: 'Action Verbs & Impact Metrics',
        recommendation: 'Quantify your engineering achievements instead of listing job duties (e.g. "Reduced API p99 latency from 420ms to 85ms by adding Redis caching").',
        keywords: ['Optimized', 'Architected', 'Reduced Latency', 'Refactored', 'Deployed'],
      },
      {
        category: 'Tech Stack Alignment',
        recommendation: `Ensure ${programmingLanguages.slice(0, 3).join(', ')} and your core database experience are clearly visible in your top skills bar.`,
        keywords: programmingLanguages.slice(0, 4),
      },
      {
        category: 'Full-Stack & Systems Project',
        recommendation: 'Highlight projects demonstrating end-to-end development, Docker containerization, and API security (JWT, rate limiting).',
        keywords: ['Docker', 'REST API', 'Microservices', 'Distributed Cache', 'PostgreSQL'],
      },
    ],
    analyzedAt: new Date().toISOString(),
    engine: 'SmartPlacement AI (Deterministic NLP & Gemini Fallback)',
  };
};

/**
 * Analyze a job description using Google Gen AI SDK (gemini-2.5-flash)
 * with robust fallback to deterministic high-precision analysis
 */
const analyzeJobDescription = async (job) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log(`[AI JD Intelligence] GEMINI_API_KEY not provided. Generating deterministic intelligence for ${job.company?.name || 'Job'}.`);
    return generateDeterministicAnalysis(job);
  }

  try {
    console.log(`[AI JD Intelligence] Calling Gemini API (gemini-3.6-flash) for ${job.company?.name} — ${job.title}...`);
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a Principal Campus Placement Officer & Senior Tech Interviewer. Analyze this Job Description (JD) and produce structured preparation intelligence for students.
Company: ${job.company?.name}
Role Title: ${job.title}
Compensation: ${job.package}
Location: ${job.location}
Job Description:
${job.description}

Respond strictly in valid JSON format matching this exact schema:
{
  "summary": "2-3 sentence strategic executive summary of role",
  "responsibilities": ["bullet 1", "bullet 2", "bullet 3"],
  "requiredSkills": ["skill 1", "skill 2", "skill 3"],
  "preferredSkills": ["skill 1", "skill 2"],
  "programmingLanguages": ["Language 1", "Language 2"],
  "dsaTopics": ["DSA topic 1", "DSA topic 2", "DSA topic 3"],
  "coreCsTopics": ["Core CS topic 1", "Core CS topic 2", "Core CS topic 3"],
  "softSkills": ["Soft skill 1", "Soft skill 2"],
  "interviewFocus": ["Round 1 OA info", "Round 2 Tech info", "Round 3 LLD info", "Round 4 HR info"],
  "skillImportance": [
    { "skill": "Skill Name", "importance": "Must-Have", "reason": "Why it is critical" }
  ],
  "topicPriority": [
    { "topic": "Topic Name", "category": "DSA", "priority": "High", "expectedQuestions": "1-2 in OA" }
  ],
  "roadmap": [
    {
      "week": 1,
      "title": "Week 1: Algorithmic Foundations",
      "description": "Weekly focus",
      "milestones": ["milestone 1", "milestone 2"]
    }
  ],
  "codingProblems": [
    { "id": "cp-1", "title": "Problem Name", "difficulty": "Medium", "topic": "Array", "link": "https://leetcode.com" }
  ],
  "coreCsFlashcards": [
    { "subject": "Operating Systems", "question": "Question", "answer": "Answer", "keyPoints": ["point 1", "point 2"] }
  ],
  "interviewQuestions": [
    { "round": "Technical Round 1", "question": "Question text", "tip": "Interview tip" }
  ],
  "resumeTips": [
    { "category": "Action Verbs", "recommendation": "Recommendation", "keywords": ["Keyword 1"] }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text);
    return {
      ...parsed,
      analyzedAt: new Date().toISOString(),
      engine: 'Google Gemini 3.6 Flash',
    };
  } catch (error) {
    console.warn(`[AI JD Intelligence Warning] Gemini API call failed (${error.message}). Using deterministic fallback.`);
    return generateDeterministicAnalysis(job);
  }
};

module.exports = {
  analyzeJobDescription,
  generateDeterministicAnalysis,
};
