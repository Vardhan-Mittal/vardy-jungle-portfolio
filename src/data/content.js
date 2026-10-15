// Single source of truth for every fact, number and link shown on the site.

export const person = {
  name: 'Vardhan Mittal',
  roles: ['Designs.', 'Builds.', 'Delights.'],
  tagline: 'Creative Designer × Software Engineer',
  email: 'logicalmittal@gmail.com',
};

export const links = [
  { id: 'email', label: 'Email', href: 'mailto:logicalmittal@gmail.com' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/Vardhan-Mittal' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/vardhan-mittal-0a0ab6227/' },
  { id: 'leetcode', label: 'LeetCode', href: 'https://leetcode.com/u/vardhan_mittal/' },
  { id: 'codechef', label: 'CodeChef', href: 'https://www.codechef.com/users/mittalnitdelhi' },
  { id: 'resume', label: 'Resume', href: '/resume.pdf' },
];

export const education = {
  school: 'NIT Delhi',
  degree: 'B.Tech ECE · Minor in ML',
  years: '2023 – 2027',
  cgpa: 9.56,
};

export const cp = [
  { value: 1628, suffix: '', label: 'Codeforces Expert' },
  { value: 3, suffix: '★', label: 'CodeChef' },
  { value: 600, suffix: '+', label: 'LeetCode problems' },
];

export const research = {
  role: 'Research Assistant · NIT Delhi',
  gain: 23.95,
  note: 'Solar-cell efficiency · Published',
};

export const projects = [
  {
    name: 'AI Interview Coach',
    stack: ['Next.js', 'TypeScript', 'Go (Gin)', 'PostgreSQL', 'Gemini'],
    blurb: 'Reads your resume, runs a 25-question adaptive mock interview, then hands you a study roadmap.',
    href: 'https://resumenichod.vercel.app',
  },
  {
    name: 'DevTrack',
    stack: ['Next.js 16', 'Prisma', 'PostgreSQL', 'NextAuth'],
    blurb: 'A developer command center syncing LeetCode and Codeforces stats, plus an AI architecture generator.',
    href: 'https://devtrack-plum.vercel.app/',
  },
  {
    name: 'WanderWise',
    stack: ['React Native', 'Expo', 'Firebase', 'Gemini'],
    blurb: 'An AI travel companion with smart itineraries and real-time tracking for budget student trips.',
    href: null,
  },
];

export const hackathons = [
  { big: '150k+', label: 'Flipkart GRID 6.0', note: 'Semi-finalist' },
  { big: '47k+', label: 'HackVega 2.0', note: 'Finalist' },
  { big: '#4', label: 'NxtWave DSA', note: 'of 1,000+' },
];

export const zscaler = {
  company: 'Zscaler',
  role: 'SDE Intern · 2026',
  detail: 'Fine-tuned small LMs with LoRA / QLoRA to read bug logs and find the root cause.',
  extra: 'Amazon ML Summer School ’26',
};

export const skills = [
  { group: 'Languages', items: ['C++', 'Python', 'Go', 'Java', 'JavaScript', 'SQL'] },
  { group: 'Frameworks', items: ['React', 'Next.js', 'Node', 'Express', 'Flask', 'Tailwind'] },
  { group: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'HF', 'LoRA', 'Sklearn', 'Pandas'] },
  { group: 'Tools', items: ['PostgreSQL', 'Firebase', 'Git', 'Linux', 'MySQL', 'VS Code'] },
];

// Chapter list drives the branch scrollbar.
export const chapters = [
  'Hello', 'Seed', 'Trunk', 'Vines', 'Sunlight', 'Design',
  'Treehouses', 'River', 'Logs', 'Fireflies', 'Treetop', 'Mailbox',
];
