export interface Project {
  id: string;
  title: string;
  description: string;
  details: string;
  technologies: string[];
  link?: string;
  achievements?: string[];
}

export const projectsData: Project[] = [
  {
    id: 'ufo-1',
    title: 'Orbital Portfolio',
    description: 'Interactive 3D portfolio using Three.js and React',
    details: 'A fully interactive portfolio website featuring a 3D solar system where each planet represents a different work experience. Built with React Three Fiber for smooth 60 FPS animations and optimized performance.',
    technologies: ['Three.js', 'React', 'TypeScript', 'Framer Motion', 'Next.js'],
    link: 'https://github.com/yourusername/orbital-portfolio',
    achievements: [
      'Built scalable 3D architecture',
      'Optimized performance by 40%',
      'Implemented responsive design'
    ]
  },
  {
    id: 'ufo-2',
    title: 'GraphQL Optimizer',
    description: 'Performance optimization tools for GraphQL APIs',
    details: 'Advanced GraphQL query optimization toolkit that reduces over-fetching by 30% and improves response times. Features include query analysis, caching strategies, and real-time performance monitoring.',
    technologies: ['GraphQL', 'Node.js', 'Redis', 'TypeScript', 'Apollo'],
    link: 'https://github.com/yourusername/graphql-optimizer',
    achievements: [
      'Reduced API calls by 30%',
      'Implemented intelligent caching',
      'Real-time monitoring dashboard'
    ]
  },
  {
    id: 'ufo-3',
    title: 'Cloud Infrastructure',
    description: 'Scalable AWS architecture with Docker containers',
    details: 'Enterprise-grade cloud infrastructure setup with automated CI/CD pipelines, container orchestration, and monitoring. Handles 10K+ daily users with 99.9% uptime and auto-scaling capabilities.',
    technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CloudWatch'],
    link: 'https://github.com/yourusername/cloud-infra',
    achievements: [
      '99.9% uptime achieved',
      'Auto-scaling for 10K+ users',
      'Automated CI/CD pipeline'
    ]
  },
];
