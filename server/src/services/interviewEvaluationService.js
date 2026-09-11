const STOP_WORDS = new Set([
  'about', 'after', 'again', 'also', 'and', 'are', 'because', 'been', 'before', 'being', 'between', 'could',
  'does', 'from', 'have', 'help', 'how', 'into', 'just', 'more', 'most', 'that', 'the', 'their', 'them',
  'then', 'there', 'these', 'they', 'this', 'through', 'what', 'when', 'where', 'which', 'while', 'with',
  'would', 'your', 'you', 'were', 'will', 'using', 'specifically', 'particularly', 'think', 'explain',
]);

const TOPIC_RULES = [
  {
    pattern: /cache|eviction|memory when|redis|stampede|thundering herd/i,
    topic: 'Cache Eviction & Concurrency',
    expected: ['cache', 'eviction', 'lru', 'lfu', 'ttl', 'recency', 'frequency', 'memory', 'redis', 'lock', 'mutex', 'atomic', 'concurrency', 'consistent', 'invalidation', 'stampede'],
  },
  {
    pattern: /graph|bfs|dfs|dijkstra|cycle|topological/i,
    topic: 'Graph Algorithms',
    expected: ['graph', 'bfs', 'dfs', 'visited', 'cycle', 'directed', 'undirected', 'stack', 'queue', 'complexity', 'vertex', 'edge'],
  },
  {
    pattern: /dynamic programming|knapsack|memoization|optimal substructure/i,
    topic: 'Dynamic Programming',
    expected: ['dynamic', 'programming', 'state', 'transition', 'memoization', 'tabulation', 'subproblem', 'recurrence', 'complexity'],
  },
  {
    pattern: /database|acid|transaction|isolation|index|b\+ tree/i,
    topic: 'Database Systems',
    expected: ['acid', 'transaction', 'isolation', 'index', 'locking', 'mvcc', 'consistency', 'rollback', 'commit', 'concurrency', 'tree'],
  },
  {
    pattern: /horizontal|vertical scaling|sharding|load balanc|geographical region/i,
    topic: 'Distributed Systems & Scaling',
    expected: ['horizontal', 'vertical', 'scaling', 'sharding', 'load', 'balancer', 'replica', 'partition', 'consistency', 'session', 'region', 'stateless'],
  },
  {
    pattern: /process|thread|deadlock|operating system|context switch/i,
    topic: 'Operating Systems',
    expected: ['process', 'thread', 'memory', 'context', 'switch', 'deadlock', 'mutex', 'semaphore', 'scheduler', 'resource'],
  },
  {
    pattern: /tcp|http|network|handshake|time_wait/i,
    topic: 'Computer Networks',
    expected: ['tcp', 'syn', 'ack', 'handshake', 'socket', 'packet', 'connection', 'latency', 'protocol', 'network'],
  },
  {
    pattern: /project|deadline|disagreement|conflict|mistake|leadership|tell me about/i,
    topic: 'Behavioral Communication',
    expected: ['situation', 'task', 'action', 'result', 'team', 'decision', 'impact', 'learned', 'resolved', 'outcome'],
  },
];

const GENERIC_TECHNICAL_TERMS = new Set([
  'algorithm', 'api', 'architecture', 'asynchronous', 'complexity', 'concurrency', 'consistent', 'database',
  'distributed', 'latency', 'memory', 'performance', 'queue', 'scalable', 'server', 'service', 'space', 'thread',
  'throughput', 'time', 'tradeoff', 'trade-off',
]);

const tokenize = (text = '') => (
  text.toLowerCase().match(/[a-z0-9+#-]+/g) || []
).filter((token) => token.length > 2 && !STOP_WORDS.has(token));

const detectTopic = (question = '') => (
  TOPIC_RULES.find((rule) => rule.pattern.test(question)) || {
    topic: 'Question Relevance',
    expected: [],
  }
);

const buildExchanges = (transcript = []) => {
  const exchanges = [];
  let current = null;

  for (const item of transcript) {
    if (item.role === 'ai') {
      if (current) exchanges.push(current);
      current = { question: item.message || '', answer: '' };
    } else if (item.role === 'user') {
      if (!current) current = { question: 'General interview response', answer: '' };
      current.answer = `${current.answer} ${item.message || ''}`.trim();
    }
  }

  if (current) exchanges.push(current);
  return exchanges;
};

const scoreExchange = ({ question, answer }) => {
  const cleanAnswer = (answer || '').trim();
  const answerTokens = tokenize(cleanAnswer);
  const wordCount = cleanAnswer.split(/\s+/).filter(Boolean).length;
  const topicRule = detectTopic(question);

  if (wordCount < 4 || /^(no answer|skip|pass|ghost|nothing|i don'?t know)[.!\s]*$/i.test(cleanAnswer)) {
    return {
      question,
      answer: cleanAnswer || 'No answer provided',
      topic: topicRule.topic,
      rating: 0,
      communication: 0,
      reasoning: 0,
      feedback: cleanAnswer
        ? 'No substantive answer was provided for this question.'
        : 'The interview ended before the candidate answered this question.',
      expectedHits: [],
    };
  }

  const answerSet = new Set(answerTokens);
  const questionSet = new Set(tokenize(question));
  const expectedHits = topicRule.expected.filter((term) => answerSet.has(term));
  const overlap = [...answerSet].filter((term) => questionSet.has(term)).length;
  const technicalHits = [...answerSet].filter((term) => GENERIC_TECHNICAL_TERMS.has(term)).length;
  const reasoningSignals = (cleanAnswer.match(/\b(because|therefore|however|for example|trade-?off|complexity|first|then|finally|compared|instead)\b/gi) || []).length;

  const relevance = Math.min(55, expectedHits.length * 11 + overlap * 4);
  const specificity = Math.min(15, technicalHits * 2.5);
  const depth = Math.min(15, Math.max(0, (wordCount - 7) * 0.45));
  const reasoning = Math.min(15, reasoningSignals * 5);
  let rating = Math.round(relevance + specificity + depth + reasoning);

  if (topicRule.expected.length > 0 && expectedHits.length === 0 && overlap < 2) rating = Math.min(rating, 18);
  if (wordCount < 8) rating = Math.min(rating, 12);
  rating = Math.max(0, Math.min(100, rating));

  const communication = Math.min(100, Math.round(
    12 + Math.min(35, wordCount * 1.15) + Math.min(20, reasoningSignals * 6) + (/[.!?]$/.test(cleanAnswer) ? 8 : 0)
  ));
  const problemSolving = Math.min(100, Math.round(rating * 0.75 + reasoning * 1.5));

  let feedback;
  if (rating <= 20) {
    feedback = `The response did not address ${topicRule.topic}. It needed specific concepts such as ${topicRule.expected.slice(0, 4).join(', ') || 'the key terms from the question'}.`;
  } else if (rating < 50) {
    feedback = `The answer showed limited relevance to ${topicRule.topic}, but lacked enough technical detail and reasoning.`;
  } else if (rating < 75) {
    feedback = `The answer addressed ${topicRule.topic}, but should explain trade-offs and implementation details more clearly.`;
  } else {
    feedback = `The answer was relevant and technically grounded, with clear reasoning about ${topicRule.topic}.`;
  }

  return { question, answer: cleanAnswer, topic: topicRule.topic, rating, communication, reasoning: problemSolving, feedback, expectedHits };
};

const average = (values) => values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
const uniqueByTopic = (items) => [...new Map(items.map((item) => [item.topic, item])).values()];

const generateGroundedEvaluation = (transcript = [], category = 'Technical', company = 'Company', jobTitle = 'Role') => {
  const exchanges = buildExchanges(transcript);
  const breakdown = exchanges.map(scoreExchange);
  const answered = breakdown.filter((item) => item.rating > 0 || item.answer !== 'No answer provided');
  const substantive = breakdown.filter((item) => item.rating > 0);
  const completionRatio = breakdown.length ? substantive.length / breakdown.length : 0;

  if (substantive.length === 0) {
    return {
      overallScore: 0,
      technicalScore: 0,
      problemSolvingScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      clarityScore: 0,
      structureScore: 0,
      concisenessScore: 0,
      summary: 'No substantive answers were provided, so interview performance could not be demonstrated.',
      strengths: [],
      improvements: ['Answer each question directly before adding supporting detail.', 'Use concrete concepts, examples, and trade-offs relevant to the question.'],
      weaknessAnalysis: {
        critical: uniqueByTopic(breakdown.map((item) => ({ topic: item.topic, reason: item.feedback }))).slice(0, 3),
        needsImprovement: [],
        strong: [],
      },
      recommendedPlan: uniqueByTopic(breakdown.map((item) => ({ action: `Revise ${item.topic}`, category: 'revision', topic: item.topic, detail: `Review the core concepts for ${item.topic}, then practice explaining one complete answer aloud.` }))).slice(0, 3),
      questionBreakdown: breakdown.map(({ question, answer, rating, feedback }) => ({ question, answer, rating, feedback })),
    };
  }

  const technicalScore = Math.round(average(breakdown.map((item) => item.rating)) * completionRatio);
  const problemSolvingScore = Math.round(average(breakdown.map((item) => item.reasoning)) * completionRatio);
  const rawCommunication = average(answered.map((item) => item.communication));
  const communicationScore = Math.round(rawCommunication * completionRatio);
  const relevanceAverage = average(substantive.map((item) => item.rating));
  const clarityScore = Math.round((rawCommunication * 0.65 + relevanceAverage * 0.35) * completionRatio);
  const structureScore = Math.round((problemSolvingScore * 0.55 + communicationScore * 0.45));
  const concisenessScore = Math.round((relevanceAverage * 0.7 + Math.min(100, rawCommunication) * 0.3) * completionRatio);
  const confidenceScore = Math.round((communicationScore * 0.6 + clarityScore * 0.4));
  const overallScore = Math.round(
    technicalScore * 0.32 + problemSolvingScore * 0.2 + communicationScore * 0.14 +
    clarityScore * 0.1 + structureScore * 0.1 + concisenessScore * 0.08 + confidenceScore * 0.06
  );

  const critical = uniqueByTopic(breakdown
    .filter((item) => item.rating < 35)
    .map((item) => ({ topic: item.topic, reason: item.feedback }))).slice(0, 3);
  const needsImprovement = uniqueByTopic(breakdown
    .filter((item) => item.rating >= 35 && item.rating < 70)
    .map((item) => ({ topic: item.topic, reason: item.feedback })));
  if (communicationScore < 50) {
    needsImprovement.push({ topic: 'Communication & Answer Structure', reason: 'Answers should directly address the question, then explain the approach, trade-offs, and a concrete example.' });
  }
  const strongEvidence = breakdown.filter((item) => item.rating >= 70);
  const strong = uniqueByTopic(strongEvidence.map((item) => ({ topic: item.topic, reason: `Demonstrated relevant concepts: ${item.expectedHits.slice(0, 5).join(', ')}.` })));

  const summary = overallScore < 20
    ? `The responses were incomplete or mostly unrelated to the ${category.toLowerCase()} questions. The candidate did not yet demonstrate the required ${jobTitle} depth for ${company}.`
    : overallScore < 40
      ? `The candidate showed limited relevant knowledge, but answers need substantially better topic alignment, technical depth, and structure.`
      : overallScore < 70
        ? `The candidate demonstrated partial understanding, with clear gaps in depth, trade-off analysis, and answer completeness.`
        : `The candidate gave mostly relevant, technically grounded answers with evidence of role-appropriate reasoning.`;

  const improvementTopics = uniqueByTopic([...critical, ...needsImprovement]).slice(0, 3);
  return {
    overallScore,
    technicalScore,
    problemSolvingScore,
    communicationScore,
    confidenceScore,
    clarityScore,
    structureScore,
    concisenessScore,
    summary,
    strengths: strong.map((item) => `${item.topic}: ${item.reason}`),
    improvements: improvementTopics.map((item) => item.reason),
    weaknessAnalysis: { critical, needsImprovement, strong },
    recommendedPlan: improvementTopics.map((item) => ({
      action: `Revise ${item.topic}`,
      category: 'revision',
      topic: item.topic,
      detail: `Review the core concepts for ${item.topic}, then practice a direct two-minute explanation with implementation details and trade-offs.`,
    })),
    questionBreakdown: breakdown.map(({ question, answer, rating, feedback }) => ({ question, answer, rating, feedback })),
  };
};

module.exports = { generateGroundedEvaluation };
