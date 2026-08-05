import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    id: 1,
    title: "TAHA College — Multi-Role Education Management Platform",
    description:
      "Building and maintaining a multi-role education platform for students, instructors, and administrators — secure authentication, attendance tracking, and academic workflows on Next.js and Supabase.",
    tech: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "AWS SES"],
    featured: true,
    role: "Full-Stack Developer",
    period: "Toronto, ON · May 2026 – Present",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase Authentication",
      "PostgreSQL",
      "Row Level Security (RLS)",
      "RESTful APIs",
      "AWS SES",
    ],
    highlights: [
      "Developed and maintained a multi-role education management platform for students, instructors, and administrators using Next.js, React, TypeScript, Supabase, and PostgreSQL, supporting secure authentication, attendance management, and academic workflows.",
      "Designed and implemented secure backend services by integrating Supabase Authentication, Row Level Security (RLS), RESTful APIs, and AWS SES to support role-based access control, automated email notifications, and document management.",
      "Optimized database schemas and migration workflows for 7,000+ student records, improving data integrity across legacy and production systems.",
    ],
    challenges: [
      "Modeling row-level security policies that correctly separate student, instructor, and administrator access without duplicating logic across tables.",
      "Migrating 7,000+ existing student records into new schemas while keeping legacy workflows running during the transition.",
      "Coordinating authentication, email notifications, and document storage as independent Supabase/AWS services that still had to feel like one product.",
    ],
    next: [
      "Add automated tests around the RLS policies to catch access-control regressions before they ship.",
      "Extend the attendance and academic workflow modules with reporting views for administrators.",
      "Tighten the migration tooling so future schema changes need less manual verification.",
    ],
  },
  {
    id: 2,
    title: "Vosyn — AI-Powered SaaS Platform UI",
    description:
      "Built responsive, reusable interfaces for an AI-powered SaaS platform, working closely with designers and backend engineers in an Agile team.",
    tech: ["Next.js", "React", "TypeScript", "Material UI", "RESTful APIs"],
    featured: false,
    role: "Front-end Developer",
    period: "Toronto, ON · Sep 2025 – May 2026",
    stack: ["Next.js", "React", "TypeScript", "Material UI", "RESTful APIs", "Agile/Scrum"],
    highlights: [
      "Developed responsive and reusable user interfaces for an AI-powered SaaS platform using Next.js, React, TypeScript, and Material UI.",
      "Integrated RESTful APIs to support authentication, dynamic data management, and multi-step workflows while collaborating with designers and backend developers in an Agile environment.",
    ],
    challenges: [
      "Keeping a growing component library consistent as the product added new multi-step workflows at a fast pace.",
      "Translating designer handoffs into Material UI-based components without losing design fidelity.",
      "Wiring multi-step forms and dynamic data views to RESTful APIs that were still evolving alongside the frontend.",
    ],
    next: [
      "Push more shared UI primitives into the reusable component library to cut down on duplicate patterns.",
      "Add stronger client-side validation across the multi-step workflows.",
    ],
  },
  {
    id: 3,
    title: "Chinasoft International — Smart Home IoT Platform",
    description:
      "Led development of a full-stack smart home management platform enabling real-time monitoring and control of connected IoT devices.",
    tech: ["Vue", "Spring Boot", "MySQL", "REST APIs", "IoT"],
    featured: false,
    role: "Full-Stack Developer & Team Lead",
    period: "Chongqing, China · May 2023 – Jul 2023",
    stack: ["Vue 2", "Java Spring Boot", "MySQL", "RESTful APIs", "IoT Device Integration"],
    highlights: [
      "Developed a full-stack smart home management platform using Vue 2, Java Spring Boot, and MySQL, enabling real-time monitoring and control of connected IoT devices.",
      "Designed RESTful APIs connecting frontend applications, backend services, databases, and smart hardware, ensuring reliable data synchronization across the system.",
      "Led the team by coordinating frontend, backend, and hardware-integration work across the project.",
    ],
    challenges: [
      "Keeping real-time device state synchronized across frontend, backend, and hardware without stale or conflicting reads.",
      "Designing APIs that stayed stable while hardware integration details were still being finalized.",
    ],
    next: [
      "Add device-state caching to reduce redundant polling of connected hardware.",
      "Expand automated testing around the real-time synchronization logic.",
    ],
  },
  {
    id: 4,
    title: "Fenghe Jinqi Technology — Campus Marketplace Platform",
    description:
      "Co-founded and built a campus marketplace platform on WeChat Mini Program, serving 1,000+ students and staff.",
    tech: ["WeChat Mini Program", "Java", "Spring Boot", "MySQL"],
    featured: false,
    role: "Full-Stack Developer & Co-Founder",
    period: "Chongqing, China · Dec 2022 – Jun 2023",
    stack: ["WeChat Mini Program", "WXML / WXSS", "Java Spring Boot", "MySQL", "RESTful APIs"],
    highlights: [
      "Designed and developed a campus marketplace platform serving 1,000+ users using WeChat Mini Program, Java Spring Boot, and MySQL.",
      "Built RESTful APIs and database-backed services supporting core marketplace and user-management workflows.",
      "Co-founded the venture and helped take it from idea to a published, actively used platform.",
    ],
    challenges: [
      "Designing marketplace and user-management workflows simple enough for a first release, without boxing in future features.",
      "Scaling a small co-founding team's workload across frontend, backend, and release management.",
    ],
    next: [
      "Add moderation and content-quality tooling as usage grows past the initial 1,000+ users.",
      "Extend the marketplace workflows with search and category filtering.",
    ],
  },
  {
    id: 5,
    title: "Period Is Coming — Nonprofit Donation Platform",
    link: "https://periodiscoming.org",
    description:
      "Developing and maintaining a nonprofit website supporting donation campaigns, with custom form handling and backend data processing.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "Security"],
    featured: false,
    role: "Full-Stack Developer (Remote)",
    period: "Kyoto, Japan · Feb 2025 – Present",
    stack: ["HTML5", "CSS3", "JavaScript", "PHP", "Form Handling", "Anti-Spam Controls"],
    highlights: [
      "Developed and maintained a nonprofit website using HTML, CSS, JavaScript, and PHP, implementing form handling and backend data processing.",
      "Redesigned donation-related UI sections and launched a new content column to expand the site's informational resources.",
      "Hardened the contact form against spam with a honeypot field, human verification, and basic rate-limiting.",
      "Supported donation campaigns that distributed packs to approximately 500 individuals.",
    ],
    challenges: [
      "Balancing stronger anti-spam protections with a smooth experience for legitimate visitors.",
      "Updating an active nonprofit site carefully to avoid regressions in existing content and layout.",
    ],
    next: [
      "Add lightweight server-side logging to catch new spam patterns early.",
      "Improve accessibility across form and content pages.",
    ],
  },
];
