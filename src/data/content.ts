// Everything you'd want to edit lives here. Components only lay it out.

export const profile = {
  firstName: 'Nikhil',
  lastName: 'Sahu',
  role: 'Backend developer',
  focus: 'Node.js & TypeScript',
  email: 'nikhilsahu3993@gmail.com',
  github: 'https://github.com/nikhilfiction',
  githubLabel: 'github.com/nikhilfiction',
};

export interface Project {
  name: string;
  summary: string;
  points: string[];
  tags: string[];
  live?: string;
  liveNote?: string;
  code?: string;
}

export const featuredProject: Project = {
  name: 'Aftershock',
  summary:
    'Change one function and Aftershock shows what else could break. It scans a codebase, traces calls while the app runs, and maps the blast radius of a change across files and dependencies.',
  points: [
    'Static scanner plus runtime tracing, so it catches calls that only happen at run time',
    'Works on Python and Node.js / TypeScript projects',
    'Live demo running on Render',
  ],
  tags: ['Static analysis', 'Runtime tracing', 'Python', 'Node.js', 'TypeScript'],
  live: 'https://aftershock-iqny.onrender.com',
  liveNote: 'Free hosting: may take up to a minute to wake up',
};

export const projects: Project[] = [
  {
    name: 'Resume Builder',
    summary: 'Write a resume from a template, let AI tighten the wording, then download it or share a public link.',
    points: [
      '"Enhance" button rewrites resume text with the Gemini API',
      'PDF export, public share links and several templates',
      'JWT sign-in, with images stored on ImageKit',
    ],
    tags: ['React + Vite', 'Express', 'MongoDB', 'Node.js'],
    live: 'https://resume-builder-inky-kappa.vercel.app/',
  },
  {
    name: 'E-commerce Website',
    summary: 'A shop with a React storefront and its own REST backend, kept in separate repos like a real team would.',
    points: [
      'Express API for products, carts and orders',
      'MongoDB data models behind the API',
      'Frontend and backend in separate repos',
    ],
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    live: 'https://ecommerce-website-ouxu.onrender.com',
    liveNote: 'May take up to a minute to wake up',
  },
];

export interface Experience {
  when: string;
  current?: boolean;
  title: string;
  where: string;
  summary?: string;
  points?: string[];
  tags?: string[];
  grade?: string;
}

export const experience: Experience[] = [
  {
    when: 'Aug 2026 – Present',
    current: true,
    title: 'Backend Developer Intern',
    where: 'Multi-tenant SaaS commerce platform',
    summary:
      'A platform where local businesses sign up, get their own storefront and take orders for pickup or delivery. The backend is 14 TypeScript microservices on Bun and Express 5.',
    points: [
      'Own authentication and authorization: tenant-owner sign-up, staff invites, refresh-token edge cases and phone OTP login for customers',
      'Added gateway protections: sign-up rate limiting, store subdomains and per-store allowed origins',
      'Tenant data kept apart with PostgreSQL row-level security, plus Redis and MinIO, all run locally with Docker Compose',
      'Tested payment flows against the Cashfree sandbox',
    ],
    tags: ['Bun', 'Express 5', 'TypeScript', 'PostgreSQL RLS', 'Redis', 'Turborepo'],
  },
  {
    when: 'Nov 2022 – Sept 2026',
    title: 'B.Tech, Computer Science and Engineering',
    where: 'VIT Bhopal University',
    grade: '8.23',
  },
];

export const about = {
  statementStart: "I like the parts of an app nobody sees: ",
  statementEm: 'sign-in, permissions, and the database rules',
  statementEnd: " that keep one shop's orders out of another's.",
  bio: [
    "I'm a 2026 Computer Science graduate from VIT Bhopal (CGPA 8.23) and I work mostly in Node.js and TypeScript, building APIs, authentication and the data models behind them.",
    "Right now I'm a backend intern on a multi-tenant commerce platform, and on the side I'm going deeper into Redis, SQL and system design.",
  ],
  facts: [
    { label: 'Status', value: 'Open to entry-level roles', highlight: true },
    { label: 'Role', value: 'Backend developer' },
    { label: 'Location', value: 'Bengaluru, Hyderabad, Pune, Delhi NCR, or remote' },
    { label: 'Joining', value: 'Immediately' },
    { label: 'Education', value: 'B.Tech CSE, VIT Bhopal · CGPA 8.23' },
  ],
  learning: 'system design, Redis patterns, advanced SQL and AWS.',
};

export const skills: { group: string; items: string[] }[] = [
  { group: 'Backend', items: ['Node.js', 'Express', 'Bun', 'FastAPI', 'REST APIs', 'JWT auth'] },
  { group: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQL'] },
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python'] },
  { group: 'Frontend', items: ['React', 'Vite', 'Material UI'] },
  { group: 'Tools', items: ['Docker Compose', 'Turborepo', 'Git', 'Postman'] },
  { group: 'Cloud & deploy', items: ['Render', 'Vercel', 'AWS'] },
];
