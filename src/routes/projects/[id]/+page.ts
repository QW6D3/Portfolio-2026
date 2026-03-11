// src/routes/project/[id]/+page.ts
import { projects, upcomingProjects } from '$lib/data/projects';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const all = [...projects, ...upcomingProjects];
	const foundProject = all.find((p) => p.id === params.id);

	if (!foundProject) throw error(404, 'Projet introuvable');

	return {
		project: foundProject
	};
}
