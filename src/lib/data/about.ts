export interface Skill {
	icon?: string;
	name: string;
	group: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Design' | 'Tools';
	subGroup?: 'Languages' | 'Frameworks' | 'Libraries' | 'CI/CD';
	level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
	yearOfExp?: number;
}
export const categoriesInfo = {
	Frontend: { icon: '/icons/layout.svg', color: '#3b82f6' },
	Backend: { icon: '/icons/database-server.svg', color: '#10b981' },
	Database: { icon: '/icons/storage.svg', color: '#f59e0b' },
	DevOps: { icon: '/icons/infinity.svg', color: '#ef4444' },
	Tools: { icon: '/icons/tools.svg', color: '#6b7280' },
	Design: { icon: '/icons/palette.svg', color: '#8b5cf6' }
};

export const skills: Skill[] = [
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
		icon: '/icons/docker.svg',
		name: 'Docker',
		group: 'DevOps',
		level: 'Intermédiaire',
		yearOfExp: 1
	},
	{
		icon: '/icons/git.svg',
		name: 'Git',
		group: 'Tools',
		subGroup: 'CI/CD',
		level: 'Avancé',
		yearOfExp: 4
	},
	{
		icon: '/icons/figma.svg',
		name: 'Figma',
		group: 'Design',
		level: 'Intermédiaire',
		yearOfExp: 2
	}
];
