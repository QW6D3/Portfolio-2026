export interface Skill {
	icon?: string;
	name: string;
	group: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Other';
	level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
	yearOfExp?: number;
}

export const skills: Skill[] = [
	{
		icon: '/icons/html5.svg',
		name: 'HTML5',
		group: 'Frontend',
		level: 'Expert',
		yearOfExp: 5
	},
	{
		icon: '/icons/css3.svg',
		name: 'CSS3',
		group: 'Frontend',
		level: 'Expert',
		yearOfExp: 5
	},
	{
		icon: '/icons/javascript.svg',
		name: 'JavaScript',
		group: 'Frontend',
		level: 'Expert',
		yearOfExp: 5
	},
	{
		icon: '/icons/typescript.svg',
		name: 'TypeScript',
		group: 'Frontend',
		level: 'Expert',
		yearOfExp: 4
	},
	{
		icon: '/icons/svelte.svg',
		name: 'Svelte',
		group: 'Frontend',
		level: 'Expert',
		yearOfExp: 3
	},
	{
		icon: '/icons/nodejs.svg',
		name: 'Node.js',
		group: 'Backend',
		level: 'Avancé',
		yearOfExp: 2
	},
	{
		icon: '/icons/php.svg',
		name: 'PHP',
		group: 'Backend',
		level: 'Intermédiaire',
		yearOfExp: 2
	},
	{
		icon: '/icons/docker.svg',
		name: 'Docker',
		group: 'DevOps',
		level: 'Intermédiaire',
		yearOfExp: 1
	}
];
