export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	year: number;
	type: string;
	colors: string;
	url?: string;
	github?: string;
	videos?: string[];
	logo?: string;
	font?: string;
	backgroundImage?: string;
}

// ── Projets finalisés ─────────────────────────────────────
export const projects: Project[] = [
	{
		id: '1',
		title: 'Mon premier projet',
		description: 'Une description',
		image: '/path/to/img.jpg',
		tags: ['Svelte', 'TypeScript'],
		year: 2024,
		type: 'Web App',
		colors: '#ff3e00',
		logo: 'logo.svg',
		font: "'Inter', sans-serif"
	},
	{
		id: '2',
		title: 'Design Minimal',
		description: 'Projet sans logo image',
		image: '',
		tags: ['UI', 'UX'],
		year: 2023,
		type: 'Design System',
		colors: '#3498db',
		font: "'Playfair Display', serif"
	},
	{
		id: '3',
		title: 'API REST',
		description: 'Une API construite avec Node.js et PostgreSQL',
		image: '',
		tags: ['Node.js', 'PostgreSQL', 'TypeScript'],
		year: 2023,
		type: 'API',
		colors: '#2ecc71',
		github: 'https://github.com/user/api-rest'
	}
];

// ── Projets à venir ───────────────────────────────────────
export const upcomingProjects: Project[] = [
	{
		id: 'upcoming-1',
		title: 'Projet à venir 1',
		description: 'Description du projet à venir',
		image: '',
		tags: ['SvelteKit', 'TypeScript'],
		year: 2025,
		type: 'Web App',
		colors: '#8b5cf6'
	},
	{
		id: 'upcoming-2',
		title: 'Projet à venir 2',
		description: 'Description du projet à venir',
		image: '',
		tags: ['React', 'Node.js'],
		year: 2025,
		type: 'API',
		colors: '#f59e0b'
	}
];
