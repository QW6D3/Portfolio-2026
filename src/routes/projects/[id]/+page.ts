import { projects } from '$lib/data/projects';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const project = projects.find((p) => p.id === parseInt(params.id));

	if (!project) {
		throw error(404, 'Project not found');
	}
	return { project };
}
