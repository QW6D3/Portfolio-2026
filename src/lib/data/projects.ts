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
		id: 'rezav',
		title: 'REZAV',
		description:
			'Plateforme de numérisation des réservations de matériel audiovisuel. Remplace les processus papier par un système complet de gestion : workflow de validation professeur, tableau de bord étudiant et emploi du temps dynamique des ressources.',
		image: '/projects/rezav-preview.jpg',
		tags: ['React', 'Redux', 'Node.js', 'MongoDB', 'SCSS', 'Docker'],
		year: 2025,
		type: 'Web App',
		colors: '#7C3AED',
		github: 'https://github.com/perigmes/REZAV',
		logo: '/images/mobile_app_logo.svg',
		font: "'Inter', sans-serif"
	},
	{
		id: 'bdl-andros',
		title: 'BDL - Andros UF',
		description:
			"Logiciel industriel \"Bout De Ligne\" développé pour l'usine laitière d'Auneau. Optimise la traçabilité des palettes et la détection d'anomalies en temps réel via des requêtes SQL croisées sur Microsoft SQL Server.",
		image: '/projects/andros-preview.jpg',
		tags: ['Svelte', 'PHP', 'MS SQL Server', 'SQL'],
		year: 2024,
		type: 'Industrial Tool',
		colors: '#7ab4ff',
		logo: '/images/andros-uf.png',
		font: "'Roboto', sans-serif"
	}
];

// ── Projets à venir ───────────────────────────────────────
export const upcomingProjects: Project[] = [
	{
		id: 'loup-garou-mc',
		title: 'Loup-Garou de Thiercelieux',
		description:
			"Adaptation complète du célèbre jeu de société en plugin Minecraft. Inclut la gestion automatisée des rôles, les cycles jour/nuit, des menus d'interface personnalisés et un système de discussion dynamique.",
		image: '',
		tags: ['Java', 'Spigot', 'Game Dev'],
		year: 2026,
		type: 'Game Plugin',
		colors: '#ffa260',
		logo: '/images/loup-garou.png',
		github: 'https://github.com/QW6D3/Lougagrou',
		font: "'Minecraftia', sans-serif"
	}
];
