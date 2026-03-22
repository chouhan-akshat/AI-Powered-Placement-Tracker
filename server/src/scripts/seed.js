import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { Topic } from '../models/Topic.js';
import { Test } from '../models/Test.js';
import { User } from '../models/User.js';

const topics = [
  {
    slug: 'arrays-strings',
    title: 'Arrays & Strings',
    category: 'dsa',
    semesterHint: 3,
    branchTags: ['CSE', 'IT'],
    description: 'Two pointers, sliding window, prefix sums.',
    order: 1,
    resources: [
      { title: 'NeetCode Arrays', url: 'https://www.youtube.com/watch?v=KLlXCFG5TnA', type: 'youtube' },
      { title: 'LeetCode Explore', url: 'https://leetcode.com/explore/learn/card/fun-with-arrays/', type: 'doc' },
    ],
    practiceLinks: [
      { title: 'LeetCode problem set', url: 'https://leetcode.com/tag/array/' },
      { title: 'Codeforces', url: 'https://codeforces.com/problemset' },
    ],
  },
  {
    slug: 'linked-list',
    title: 'Linked Lists',
    category: 'dsa',
    semesterHint: 3,
    order: 2,
    resources: [{ title: 'Striver LL', url: 'https://www.youtube.com/watch?v=qB9xQId31I0', type: 'youtube' }],
    practiceLinks: [{ title: 'LeetCode Linked List', url: 'https://leetcode.com/tag/linked-list/' }],
  },
  {
    slug: 'trees',
    title: 'Binary Trees & BST',
    category: 'dsa',
    semesterHint: 4,
    order: 3,
    resources: [{ title: 'Trees playlist', url: 'https://www.youtube.com/watch?v=I_JNQUzxUoQ', type: 'youtube' }],
    practiceLinks: [{ title: 'LeetCode Trees', url: 'https://leetcode.com/tag/tree/' }],
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    category: 'dsa',
    semesterHint: 5,
    order: 4,
    resources: [{ title: 'Graph basics', url: 'https://www.youtube.com/watch?v=tWVWeAqZ0WU', type: 'youtube' }],
    practiceLinks: [{ title: 'LeetCode Graph', url: 'https://leetcode.com/tag/graph/' }],
  },
  {
    slug: 'os-deadlock',
    title: 'OS — Deadlock & Scheduling',
    category: 'core',
    semesterHint: 4,
    order: 10,
    resources: [{ title: 'Gate Smashers OS', url: 'https://www.youtube.com/watch?v=9ETgDHHt8yM', type: 'youtube' }],
    practiceLinks: [{ title: 'InterviewBit OS', url: 'https://www.interviewbit.com/operating-system-interview-questions/' }],
  },
  {
    slug: 'dbms-sql',
    title: 'DBMS — SQL & Transactions',
    category: 'core',
    semesterHint: 4,
    order: 11,
    resources: [{ title: 'DBMS concepts', url: 'https://www.youtube.com/watch?v=dl00fOcw7hs', type: 'youtube' }],
    practiceLinks: [{ title: 'SQL practice', url: 'https://leetcode.com/studyplan/top-sql-50/' }],
  },
  {
    slug: 'cn-basics',
    title: 'Computer Networks Basics',
    category: 'core',
    semesterHint: 5,
    order: 12,
    resources: [{ title: 'CN crash course', url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8', type: 'youtube' }],
    practiceLinks: [{ title: 'CN questions', url: 'https://www.geeksforgeeks.org/computer-networks/' }],
  },
  {
    slug: 'aptitude-quant',
    title: 'Aptitude — Quant',
    category: 'aptitude',
    semesterHint: 3,
    order: 20,
    resources: [{ title: 'Aptitude tricks', url: 'https://www.youtube.com/watch?v=EIyZTPwiJC0', type: 'youtube' }],
    practiceLinks: [{ title: 'IndiaBIX', url: 'https://www.indiabix.com/aptitude/questions-and-answers/' }],
  },
  {
    slug: 'portfolio-mern',
    title: 'Project — MERN portfolio',
    category: 'project',
    semesterHint: 5,
    order: 30,
    description: 'Auth, CRUD, deploy to Render/Vercel.',
    resources: [{ title: 'MERN tutorial', url: 'https://www.youtube.com/watch?v=PBTYxXADG_k', type: 'youtube' }],
    practiceLinks: [{ title: 'GitHub student pack', url: 'https://education.github.com/pack' }],
  },
];

function buildQuestions(prefix, n, type) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    out.push({
      text: `${prefix} question ${i}: Choose the best answer.`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex: (i + type.length) % 4,
      explanation: `Correct because pattern ${i % 4}.`,
    });
  }
  return out;
}

async function run() {
  await connectDB();
  await Topic.deleteMany({ slug: { $in: topics.map((t) => t.slug) } });
  await Topic.insertMany(topics);

  await Test.deleteMany({ title: { $in: ['Sample Aptitude Sprint', 'Sample Technical Sprint'] } });
  await Test.create({
    title: 'Sample Aptitude Sprint',
    type: 'aptitude',
    durationMinutes: 10,
    questions: buildQuestions('Aptitude', 8, 'ap'),
  });
  await Test.create({
    title: 'Sample Technical Sprint',
    type: 'technical',
    durationMinutes: 15,
    questions: buildQuestions('Technical', 10, 'te'),
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@mentor.local';
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'admin12345', 10);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hash,
      role: 'admin',
      branch: 'CSE',
      semester: 6,
      goal: 'product',
    });
    console.log('Admin user:', adminEmail, '/ password from SEED_ADMIN_PASSWORD or default admin12345');
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
