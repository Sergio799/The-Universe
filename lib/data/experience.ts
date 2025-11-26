export interface ExperienceItem {
  id: string;
  name: string;
  location?: string;
  role: string;
  period: string;
  type: string;
  description: string;
  highlights?: string[];
  technologies: string[];
  color: string;
  size: number;
  distance: number;
}

export const experienceData: ExperienceItem[] = [
  {
    id: 'sports-excitement',
    name: 'Sports Excitement',
    location: 'New York, NY',
    role: 'Full Stack Developer Intern',
    period: 'Mar 2025 - Jul 2025',
    type: 'velocity',
    description: 'Developed responsive, WCAG/508-compliant UIs and optimized CDN-accelerated delivery pipelines with Cloudflare, serving 10K+ daily users. Integrated GraphQL APIs to improve performance by 30% and architected RBAC authentication modules for PII/PHI data protection.',
    highlights: [
      'Built high-performance UIs with TypeScript and Tailwind CSS for thousands of daily users',
      'Optimized CDN delivery with Cloudflare, improving latency and reliability',
      'Integrated GraphQL APIs reducing over-fetching and improving response performance by 30%',
      'Enhanced frontend via code splitting, Webpack optimization, and Zustand refactoring',
      'Architected RBAC authentication modules for PII/PHI data protection',
      'Integrated Mapbox and Google OAuth into production applications',
      'Containerized backend services with Docker for enhanced system performance',
      'Collaborated on MVP launch with cross-functional teams'
    ],
    technologies: ['TypeScript', 'React', 'Node.js', 'GraphQL', 'Tailwind CSS', 'Cloudflare', 'Docker', 'Zustand', 'Supabase', 'ElasticSearch', 'Mapbox'],
    color: '#FF2F7B',
    size: 1.2,
    distance: 4,
  },
  {
    id: 'accenture',
    name: 'Accenture',
    location: 'Bangalore, India',
    role: 'Full Stack Developer',
    period: 'May 2022 - Dec 2023',
    type: 'foundation',
    description: 'Developed custom web applications using React.js and Node.js, optimizing frontend performance with Webpack and Redux. Built scalable middleware and data pipelines, reducing bug resolution time by 30% and improving query efficiency by 20%.',
    highlights: [
      'Developed custom web apps with React.js, HTML5, CSS3, and Bootstrap',
      'Optimized frontend performance with Webpack and Redux, reducing bundle size by 20%',
      'Built scalable middleware and data pipelines with Node.js and Express',
      'Reduced bug resolution time by 30% through analytical debugging',
      'Designed and optimized MySQL schemas, improving query efficiency by 20%',
      'Integrated Razorpay payment gateway, reducing checkout errors by 15%',
      'Improved code reliability with Jest and Mocha unit testing',
      'Ensured WCAG accessibility compliance and security best practices',
      'Deployed and monitored AWS workloads (EC2, Lambda, S3, CloudWatch)',
      'Reduced MTTD incidents by 25% through improved observability'
    ],
    technologies: ['JavaScript', 'React.js', 'Node.js', 'Express', 'MySQL', 'Redux', 'Webpack', 'AWS', 'Jest', 'Mocha', 'Bootstrap'],
    color: '#00D9FF',
    size: 1.1,
    distance: 7,
  },
  {
    id: 'uncc-ta-swe',
    name: 'UNC Charlotte',
    location: 'Charlotte, NC',
    role: 'Teaching Assistant - Software Development',
    period: 'Aug 2025 - Present',
    type: 'knowledge',
    description: 'Guiding students in full-stack development best practices, conducting code reviews and sandbox testing to ensure quality coding standards and reliable development.',
    highlights: [
      'Collaborated with professor to guide students in full-stack development',
      'Provided mentorship on best practices, debugging, and problem-solving',
      'Conducted code reviews and sandbox testing',
      'Ensured students learn quality coding standards'
    ],
    technologies: ['Full Stack', 'Code Review', 'Testing', 'Mentorship'],
    color: '#7B2FFF',
    size: 0.8,
    distance: 10,
  },
  {
    id: 'uncc-ta-logic',
    name: 'UNC Charlotte',
    location: 'Charlotte, NC',
    role: 'Teaching Assistant - Logic & Algorithms',
    period: 'Jan 2025 - May 2025',
    type: 'knowledge',
    description: 'Mentored 50+ students in Computer Science fundamentals including data structures, algorithm design, and OOP concepts. Conducted review sessions and built supplementary materials.',
    highlights: [
      'Mentored 50+ students in data structures and algorithm design',
      'Evaluated programming assignments with detailed feedback',
      'Conducted review sessions simplifying complex algorithmic concepts',
      'Built supplementary materials for student learning'
    ],
    technologies: ['Algorithms', 'Data Structures', 'OOP', 'Teaching'],
    color: '#FFD700',
    size: 0.8,
    distance: 13,
  },
];
