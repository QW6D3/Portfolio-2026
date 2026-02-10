export interface Project {
	id: string; // Garde string si tes IDs sont "mon-projet"
	title: string;
	description: string;
	image: string;
	tags: string[];
	url?: string;
	github?: string;
	videos?: string[];
}

// IL MANQUAIT CECI :
export const projects: Project[] = [
	{
		id: '1',
		title: 'Mon premier projet',
		description: 'Une description',
		image: '/path/to/img.jpg',
		tags: ['Svelte', 'TypeScript']
	}
];
