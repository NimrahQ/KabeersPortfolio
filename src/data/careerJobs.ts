/** A single role entry shown in the arc-reactor career timeline overlay. */
export type CareerJob = {
  role: string
  co: string
  loc: string
  dur: string
  bullets: string[]
}

/** Orbit placement for one career node around the reactor core. */
export type OrbitNode = {
  rotation: number
  counterRot: number
  label: string
}

/** Career history — newest first, matching orbit node order 01→05. */
export const CAREER_JOBS: CareerJob[] = [
  {
    role: 'Team Lead Full Stack Developer',
    co: 'Shispare',
    loc: 'Karachi, Sindh, Pakistan',
    dur: 'NOV 2025 — PRESENT',
    bullets: [
      "Led end-to-end architectural revamp of HRSG's flagship SaaS HRMS, directing a cross-functional team of <b>6 developers</b> to replace a fragmented legacy system.",
      'Implemented high-performance system optimizations, delivering an <b>80% increase</b> in application performance and reliability.',
      'Embedded Claude AI into team workflows — <b>+40% prototyping speed</b>, <b>+30% coding efficiency</b>, saving 10+ hrs/week.',
      'Directed a 5-person team building <b>One Smart Compliance</b>, an AI-enabled, multilevel tenancy platform for policy writing.',
      'Mentored and code-reviewed a combined <b>11 engineers</b> across two major projects.',
    ],
  },
  {
    role: 'Mean Stack Developer',
    co: 'Appxone',
    loc: 'Karachi, Sindh, Pakistan',
    dur: 'NOV 2023 — AUG 2025',
    bullets: [
      'Engineered and scaled core features for enterprise web applications using the <b>MEAN Stack</b> (MongoDB, Express, Angular, Node.js).',
      'Developed real-time notification microservices and modular state management with RxJS.',
      'Optimized MongoDB database indexing and query pipelines, accelerating response times by <b>45%</b>.',
      'Collaborated on multi-tenant RBAC architecture and third-party RESTful integrations.',
    ],
  },
  {
    role: 'Frontend Developer',
    co: 'Skyscrapers',
    loc: 'Karachi, Sindh, Pakistan',
    dur: 'MAR 2023 — OCT 2023',
    bullets: [
      'Built interactive frontend architectures using <b>React, Next.js, and TypeScript</b>.',
      'Constructed pixel-perfect, responsive UI components with modern CSS grid, flexbox, and motion libraries.',
      'Improved Core Web Vitals and Lighthouse scores across customer-facing products by <b>30%+</b>.',
    ],
  },
  {
    role: 'Frontend Developer',
    co: 'Empower Associates',
    loc: 'United States (Remote)',
    dur: 'JUN 2022 — FEB 2023',
    bullets: [
      'Built recruitment automation features in Empower CRM, saving HR teams <b>8+ hrs/week</b> of manual data entry.',
      'Led frontend migration to <b>Elastic UI, Redux, and React</b> across 5+ engineers, cutting component dev time by ~30%.',
      'Implemented advanced HTTP security headers, neutralizing <b>7+ vulnerability classes</b> (XSS, clickjacking, MIME sniffing).',
      'Integrated ESLint and TDD practices, reducing production bugs by ~35% and bug resolution time by ~40%.',
      'Shipped <b>10+ CRM enhancements</b>, lifting usability scores ~35% and daily active usage ~25%.',
    ],
  },
  {
    role: 'Frontend Developer',
    co: 'Stratesfy, Inc.',
    loc: 'Karachi, Sindh, Pakistan',
    dur: 'MAY 2020 — APR 2023',
    bullets: [
      'Independently redesigned the UI of ERP platform <b>OCTOPUS</b>, lifting user satisfaction ~35%.',
      'Delivered third-party integrations (incl. Slack), cutting client manual workload by <b>50%</b>.',
      'Migrated project <b>STEP</b> from Angular 8 → 10 with Ng Zorro, for a 25% performance increase.',
      'Established web security best practices, reducing vulnerabilities by <b>70%</b> and ensuring GDPR compliance.',
      'Authored custom CMS themes and GSAP animations, elevating interactivity across web apps.',
    ],
  },
]

/** Fixed positions for the five orbit nodes (degrees on the reactor ring). */
export const ORBIT_NODES: OrbitNode[] = [
  { rotation: -90, counterRot: 90, label: 'Shispare' },
  { rotation: -18, counterRot: 18, label: 'Appxone' },
  { rotation: 54, counterRot: -54, label: 'Skyscrapers' },
  { rotation: 126, counterRot: -126, label: 'Empower' },
  { rotation: 198, counterRot: -198, label: 'Stratesfy' },
]
