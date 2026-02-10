export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	tags: string[];
	url?: string;
	github?: string;
	videos?: string[];
}
