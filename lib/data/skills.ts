export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'cloud' | 'databases';
  level: number; // 1-5
  icon?: string;
}

export const skillsData: Skill[] = [
  // Frontend - Web Development & UI
  { id: 'react', name: 'React.js', category: 'frontend', level: 5 },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', level: 5 },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 5 },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', level: 5 },
  { id: 'html5', name: 'HTML5', category: 'frontend', level: 5 },
  { id: 'css3', name: 'CSS3', category: 'frontend', level: 5 },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', level: 5 },
  { id: 'redux', name: 'Redux', category: 'frontend', level: 5 },
  { id: 'zustand', name: 'Zustand', category: 'frontend', level: 5 },
  { id: 'reactquery', name: 'React Query', category: 'frontend', level: 5 },
  { id: 'framermotion', name: 'Framer Motion', category: 'frontend', level: 5 },
  { id: 'shadcn', name: 'ShadCN UI', category: 'frontend', level: 5 },
  { id: 'radix', name: 'Radix UI', category: 'frontend', level: 4 },
  { id: 'chakra', name: 'Chakra UI', category: 'frontend', level: 4 },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend', level: 4 },
  { id: 'webpack', name: 'Webpack', category: 'frontend', level: 4 },
  
  // Backend - Languages, Frameworks & APIs
  { id: 'python', name: 'Python', category: 'backend', level: 5 },
  { id: 'nodejs', name: 'Node.js', category: 'backend', level: 5 },
  { id: 'express', name: 'Express.js', category: 'backend', level: 5 },
  { id: 'go', name: 'Go', category: 'backend', level: 3 },
  { id: 'flask', name: 'Flask', category: 'backend', level: 5 },
  { id: 'django', name: 'Django', category: 'backend', level: 4 },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', level: 5 },
  { id: 'graphql', name: 'GraphQL', category: 'backend', level: 4 },
  { id: 'restapi', name: 'REST API', category: 'backend', level: 5 },
  { id: 'websockets', name: 'WebSockets', category: 'backend', level: 4 },
  { id: 'webhooks', name: 'WebHooks', category: 'backend', level: 4 },
  { id: 'oauth', name: 'OAuth', category: 'backend', level: 5 },
  { id: 'jwt', name: 'JWT', category: 'backend', level: 5 },
  { id: 'kafka', name: 'Kafka', category: 'backend', level: 4 },
  { id: 'langchain', name: 'LangChain', category: 'backend', level: 4 },
  { id: 'openai', name: 'OpenAI', category: 'backend', level: 4 },
  
  // Cloud & DevOps
  { id: 'aws', name: 'AWS', category: 'cloud', level: 5 },
  { id: 'docker', name: 'Docker', category: 'cloud', level: 5 },
  { id: 'kubernetes', name: 'Kubernetes', category: 'cloud', level: 4 },
  { id: 'vercel', name: 'Vercel', category: 'cloud', level: 5 },
  { id: 'cloudflare', name: 'Cloudflare', category: 'cloud', level: 4 },
  { id: 'terraform', name: 'Terraform', category: 'cloud', level: 4 },
  { id: 'cicd', name: 'CI/CD', category: 'cloud', level: 5 },
  { id: 'git', name: 'Git', category: 'cloud', level: 5 },
  { id: 'github', name: 'GitHub', category: 'cloud', level: 5 },
  { id: 'jest', name: 'Jest', category: 'cloud', level: 5 },
  { id: 'cypress', name: 'Cypress', category: 'cloud', level: 4 },
  { id: 'vitest', name: 'Vitest', category: 'cloud', level: 4 },
  { id: 'postman', name: 'Postman', category: 'cloud', level: 5 },
  
  // Databases & ORMs
  { id: 'mongodb', name: 'MongoDB', category: 'databases', level: 5 },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', level: 5 },
  { id: 'mysql', name: 'MySQL', category: 'databases', level: 5 },
  { id: 'mssql', name: 'MS SQL', category: 'databases', level: 4 },
  { id: 'redis', name: 'Redis', category: 'databases', level: 5 },
  { id: 'elasticsearch', name: 'Elasticsearch', category: 'databases', level: 4 },
  { id: 'supabase', name: 'Supabase', category: 'databases', level: 4 },
  { id: 'firebase', name: 'Firebase', category: 'databases', level: 5 },
  { id: 'prisma', name: 'Prisma', category: 'databases', level: 5 },
  { id: 'mongoose', name: 'Mongoose', category: 'databases', level: 5 },
  { id: 'sequelize', name: 'Sequelize', category: 'databases', level: 4 },
];

export const skillCategories = {
  frontend: 'Frontend',
  backend: 'Backend',
  cloud: 'Cloud & DevOps',
  databases: 'Databases',
};
