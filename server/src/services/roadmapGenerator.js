/**
 * Dynamic JSON roadmap: semester-wise DSA, core, aptitude, projects.
 * Merges branch / semester / goal for personalization labels.
 */

const BASE_DSA = [
  { key: 'arrays_strings', title: 'Arrays & Strings', weeks: 2 },
  { key: 'linked_list_stack_queue', title: 'Linked List, Stack, Queue', weeks: 2 },
  { key: 'trees_graphs', title: 'Trees & Graphs', weeks: 3 },
  { key: 'dp_greedy', title: 'DP & Greedy', weeks: 2 },
  { key: 'heap_hashing', title: 'Heap & Hashing patterns', weeks: 1 },
];

const CORE = [
  { key: 'os', title: 'Operating Systems', topics: ['Processes', 'Deadlock', 'Paging', 'Scheduling'] },
  { key: 'dbms', title: 'DBMS', topics: ['SQL', 'Normalization', 'Transactions', 'Indexing'] },
  { key: 'cn', title: 'Computer Networks', topics: ['OSI/TCP', 'HTTP', 'DNS', 'TCP flow'] },
];

const APTITUDE_TRACK = [
  { key: 'quant', title: 'Quantitative Aptitude', items: ['Percentages', 'Time & Work', 'Ratios'] },
  { key: 'logical', title: 'Logical Reasoning', items: ['Puzzles', 'Series', 'Data sufficiency'] },
  { key: 'verbal', title: 'Verbal', items: ['Reading comp', 'Para jumbles', 'Grammar'] },
];

function goalLabel(goal, goalDetail) {
  const map = {
    service: 'Service companies (TCS, Infosys, Wipro focus: aptitude + communication)',
    product: 'Product / startups (DSA + system hints + strong projects)',
    specific_role: goalDetail || 'Target role: customize projects & core depth',
    general: 'Balanced placement prep',
  };
  return map[goal] || map.general;
}

function projectIdeas(branch, goal) {
  const b = (branch || 'CSE').toUpperCase();
  const common = [
    'Full-stack CRUD app with auth (MERN)',
    'Real-time dashboard (REST + charts)',
    'CLI tool or API microservice',
  ];
  if (goal === 'product') {
    return [...common, 'System design blog or LRU cache implementation', 'Open-source contribution'];
  }
  if (b.includes('IT') || b.includes('CSE')) {
    return [...common, 'Mini compiler / parser OR OS scheduler simulator'];
  }
  return [...common, 'Domain-specific portfolio project'];
}

function companyPaths(goal) {
  const paths = {
    service: [
      { company: 'Service majors', focus: ['Aptitude packs', 'Communication', 'Basic DSA'] },
    ],
    product: [
      { company: 'Product / FAANG-style', focus: ['Hard DSA', 'System design basics', 'Strong resume'] },
    ],
    specific_role: [{ company: 'Role-specific', focus: ['Deep-dive projects', 'Mock interviews'] }],
    general: [
      { company: 'Mixed track', focus: ['DSA medium', 'Core subjects', 'Aptitude weekly'] },
    ],
  };
  return paths[goal] || paths.general;
}

export function buildRoadmapPlan({ branch, semester, goal, goalDetail }) {
  const sem = Math.min(Math.max(Number(semester) || 5, 1), 8);
  const g = goal || 'general';

  const semesters = [];
  for (let s = 1; s <= 8; s++) {
    const phase =
      s <= 2
        ? 'foundation'
        : s <= 4
          ? 'core_build'
          : s <= 6
            ? 'dsa_intensive'
            : 'interview_ready';

    const dsaSlice =
      phase === 'foundation'
        ? BASE_DSA.slice(0, 2)
        : phase === 'core_build'
          ? BASE_DSA.slice(0, 3)
          : phase === 'dsa_intensive'
            ? BASE_DSA
            : BASE_DSA;

    semesters.push({
      semester: s,
      phase,
      active: s === sem,
      dsa: dsaSlice.map((t) => ({
        ...t,
        priority: s >= sem ? 'current_or_upcoming' : 'completed_or_review',
      })),
      core: CORE.map((c) => ({
        ...c,
        depth: s >= 5 ? 'interview' : 'course',
      })),
      aptitude: APTITUDE_TRACK,
      projects: projectIdeas(branch, g),
      milestones: [
        { label: 'Complete weekly topic targets', week: 1 },
        { label: 'Finish one mock test', week: 1 },
        { label: 'One AI mock interview', week: s >= sem ? 1 : 0 },
      ].filter((m) => m.week),
    });
  }

  return {
    meta: {
      branch: branch || 'CSE',
      semester: sem,
      goal: g,
      goalNarrative: goalLabel(g, goalDetail),
      generatedAt: new Date().toISOString(),
    },
    summary: {
      focusThisSemester: sem <= 4 ? 'Strengthen fundamentals + start DSA' : 'DSA + core revision + mocks',
      weeklySuggestion: ['3 DSA problems', '1 core topic revision', '1 aptitude drill', '1 mock activity'],
    },
    companyPaths: companyPaths(g),
    semesters,
  };
}
