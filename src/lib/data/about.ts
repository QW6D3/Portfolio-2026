export interface Skill {
	icon?: string;
	name: string;
	group: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Design' | 'Tools';
	subGroup?: 'Languages' | 'Frameworks' | 'Libraries' | 'CI/CD' | 'Concepts' | 'ORM';
	level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
	yearOfExp?: number;
}

export const categoriesInfo = {
	Frontend: { icon: 'Wallpaper', color: '#60a5fa' },
	Backend: { icon: 'ServerCog', color: '#34d399' },
	Database: { icon: 'Database', color: '#fbbf24' },
	DevOps: { icon: 'Container', color: '#f87171' },
	Tools: { icon: 'Wrench', color: '#9ca3af' },
	Design: { icon: 'Palette', color: '#a78bfa' }
};

export const skills: Skill[] = [
	/* --- FRONTEND --- */
	{
		icon: '/icons/html5.svg',
		name: 'HTML5',
		group: 'Frontend',
		subGroup: 'Languages',
		level: 'Expert',
		yearOfExp: 5
	},
	{
		icon: '/icons/css3.svg',
		name: 'CSS3',
		group: 'Frontend',
		subGroup: 'Languages',
		level: 'Expert',
		yearOfExp: 5
	},
	{
		icon: '/icons/scss.svg',
		name: 'SCSS',
		group: 'Frontend',
		subGroup: 'Languages',
		level: 'Expert',
		yearOfExp: 4
	},
	{
		icon: '/icons/javascript.svg',
		name: 'JavaScript',
		group: 'Frontend',
		subGroup: 'Languages',
		level: 'Expert',
		yearOfExp: 5
	},
	{
		icon: '/icons/typescript.svg',
		name: 'TypeScript',
		group: 'Frontend',
		subGroup: 'Languages',
		level: 'Expert',
		yearOfExp: 4
	},
	{
		icon: '/icons/svelte.svg',
		name: 'Svelte',
		group: 'Frontend',
		subGroup: 'Frameworks',
		level: 'Expert',
		yearOfExp: 3
	},
	{
		icon: '/icons/react.svg',
		name: 'React',
		group: 'Frontend',
		subGroup: 'Frameworks',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{
		icon: '/icons/nextjs.svg',
		name: 'Next.js',
		group: 'Frontend',
		subGroup: 'Frameworks',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/vuejs.svg',
		name: 'Vue.js',
		group: 'Frontend',
		subGroup: 'Frameworks',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/tailwind.svg',
		name: 'Tailwind CSS',
		group: 'Frontend',
		subGroup: 'Libraries',
		level: 'Avancé',
		yearOfExp: 2
	},
	{
		icon: '/icons/vite.svg',
		name: 'Vite',
		group: 'Frontend',
		subGroup: 'Libraries',
		level: 'Avancé',
		yearOfExp: 2
	},
	{ name: 'Responsive Design', group: 'Frontend', subGroup: 'Concepts', level: 'Expert' },
	{ name: 'Accessibilité', group: 'Frontend', subGroup: 'Concepts', level: 'Avancé' },
	{ name: 'Performance / SEO', group: 'Frontend', subGroup: 'Concepts', level: 'Avancé' },

	/* --- BACKEND --- */
	{
		icon: '/icons/nodejs.svg',
		name: 'Express.js',
		group: 'Backend',
		subGroup: 'Frameworks',
		level: 'Avancé',
		yearOfExp: 2
	},
	{
		icon: '/icons/php.svg',
		name: 'PHP',
		group: 'Backend',
		subGroup: 'Languages',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{
		icon: '/icons/symfony.svg',
		name: 'Symfony',
		group: 'Backend',
		subGroup: 'Frameworks',
		level: 'Débutant',
		yearOfExp: 1
	},
	{
		icon: '/icons/java.svg',
		name: 'Java',
		group: 'Backend',
		subGroup: 'Languages',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{
		icon: '/icons/csharp.svg',
		name: 'C#',
		group: 'Backend',
		subGroup: 'Languages',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/nginx.svg',
		name: 'Nginx',
		group: 'Backend',
		subGroup: 'Concepts',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/maven.svg',
		name: 'Maven',
		group: 'Backend',
		subGroup: 'Frameworks',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/prisma.svg',
		name: 'Prisma',
		group: 'Backend',
		subGroup: 'ORM',
		level: 'Avancé',
		yearOfExp: 2
	},
	{ name: 'API RESTful', group: 'Backend', subGroup: 'Concepts', level: 'Expert' },
	{ name: 'Authentication (JWT)', group: 'Backend', subGroup: 'Concepts', level: 'Avancé' },

	/* --- DATABASE --- */
	{
		icon: '/icons/postgresql.svg',
		name: 'PostgreSQL',
		group: 'Database',
		level: 'Avancé',
		yearOfExp: 3
	},
	{
		icon: '/icons/mongodb.svg',
		name: 'MongoDB',
		group: 'Database',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{
		icon: '/icons/mysql.svg',
		name: 'MySQL',
		group: 'Database',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{
		icon: '/icons/firebase.svg',
		name: 'Firebase',
		group: 'Database',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/supabase.svg',
		name: 'Supabase',
		group: 'Database',
		level: 'Avancé',
		yearOfExp: 2
	},
	{ name: 'Data Modeling', group: 'Database', subGroup: 'Concepts', level: 'Avancé' },

	/* --- DEVOPS --- */
	{
		icon: '/icons/docker.svg',
		name: 'Docker',
		group: 'DevOps',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/githubactions.svg',
		name: 'GitHub Actions',
		group: 'DevOps',
		subGroup: 'CI/CD',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{ icon: '/icons/vercel.svg', name: 'Vercel', group: 'DevOps', level: 'Avancé', yearOfExp: 2 },
	{ name: 'CI/CD Pipelines', group: 'DevOps', subGroup: 'Concepts', level: 'Intermédiaire' },

	/* --- TOOLS --- */
	{
		icon: '/icons/git.svg',
		name: 'Git',
		group: 'Tools',
		subGroup: 'CI/CD',
		level: 'Avancé',
		yearOfExp: 4
	},
	{ icon: '/icons/eslint.svg', name: 'ESLint', group: 'Tools', level: 'Avancé', yearOfExp: 3 },
	{ icon: '/icons/notion.svg', name: 'Notion', group: 'Tools', level: 'Avancé', yearOfExp: 3 },
	{ name: 'Agile / Scrum', group: 'Tools', subGroup: 'Concepts', level: 'Avancé' },

	/* --- DESIGN --- */
	{
		icon: '/icons/figma.svg',
		name: 'Figma',
		group: 'Design',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{
		icon: '/icons/affinity.svg',
		name: 'Affinity',
		group: 'Design',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{ name: 'Design Systems', group: 'Design', subGroup: 'Concepts', level: 'Intermédiaire' },
	{ name: 'Prototypage', group: 'Design', subGroup: 'Concepts', level: 'Avancé' },
	{ name: 'Motion Design', group: 'Design', subGroup: 'Concepts', level: 'Intermédiaire' },
	{ name: 'User Experience (UX)', group: 'Design', subGroup: 'Concepts', level: 'Avancé' }
];
