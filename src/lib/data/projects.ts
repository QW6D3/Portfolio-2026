export interface Project {
	id: string;
	title: string;
	description: string;
	fullDescription?: string;
	role?: string;
	context?: string;
	challenges?: string[];
	features?: string[];
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
	isFeatured?: boolean;
}

// ── Projets finalisés ─────────────────────────────────────
export const projects: Project[] = [
	{
		id: 'bdl-andros',
		title: 'BDL - Andros UF',
		role: 'Développeur SQL & Svelte',
		context: 'Projet Industriel (Usine Auneau)',
		description:
			'Solution de traçabilité temps réel centralisant les données de production automatisées.',
		fullDescription:
			'Développement d’une interface de monitoring pour croiser les données provenant de multiples bases SQL d’automates industriels (étuve, tunnel froid, emballage). L’enjeu majeur était l’optimisation de requêtes complexes pour garantir un affichage fluide malgré un volume de données massif et fragmenté.',
		challenges: [
			'Optimisation de requêtes SQL croisées (Multi-DB) pour réduire les temps de réponse',
			'Nettoyage et filtrage de données brutes issues d’automates industriels',
			'Architecture adaptée aux postes fixes en environnement de production'
		],
		features: [
			'Dashboard de suivi des palettes par point de contrôle',
			'Détection d’anomalies de parcours produit',
			'Interface Desktop haute densité d’informations'
		],
		image: '/projects/andros-preview.jpg',
		tags: ['Svelte', 'MS SQL Server', 'Performance SQL', 'Industrie 4.0'],
		year: 2024,
		type: 'Industrial Monitoring',
		colors: '#7ab4ff',
		logo: '/images/andros-uf.png',
		font: "'Roboto', sans-serif",
		isFeatured: true
	},
	{
		id: 'rezav',
		title: 'REZAV',
		role: 'Lead Developer Fullstack',
		context: 'Projet Universitaire (MMI)',
		description: 'Système de gestion et de réservation de matériel audiovisuel pour étudiants.',
		fullDescription:
			'Conception d’une plateforme permettant de numériser le prêt de matériel. L’outil permet aux étudiants de planifier leurs tournages via un calendrier interactif et offre aux enseignants une interface de validation complète (approbation, refus, commentaires).',
		challenges: [
			'Modélisation d’un workflow de validation à trois états (Attente, Accepté, Refusé)',
			'Déploiement de l’infrastructure via Docker pour assurer la portabilité',
			'Interface de suivi du matériel en temps réel'
		],
		features: [
			'Calendrier global des disponibilités de ressources',
			'Système de feedback professeur/élève sur les demandes',
			'Formulaire de réservation dynamique'
		],
		image: '/projects/rezav-preview.jpg',
		tags: ['React', 'Node.js', 'MongoDB', 'Docker', 'SCSS'],
		year: 2025,
		type: 'Web App',
		colors: '#7C3AED',
		github: 'https://github.com/perigmes/REZAV',
		logo: '/images/mobile_app_logo.svg',
		font: "'Inter', sans-serif",
		isFeatured: true
	},
	{
		id: 'replik',
		title: 'Replik',
		role: 'Lead Développeur',
		context: 'Projet Pluridisciplinaire (MMI)',
		description: 'Plateforme de podcasts gérant l’hébergement de fichiers audio via GridFS.',
		fullDescription:
			'Direction technique d’une équipe de développement pour la création d’un site de diffusion de podcasts. Responsable de la mise en place d’un flux RSS pour la syndication et de la gestion du stockage binaire sur MongoDB.',
		challenges: [
			'Coordination technique entre les pôles création, communication et dev',
			'Implémentation de MongoDB GridFS pour le stockage de fichiers audio volumineux',
			'Génération de flux RSS conformes pour l’abonnement aux contenus'
		],
		features: [
			'Lecture de podcasts via interface web',
			'Syndication de contenu (Flux RSS)',
			'Gestion de base de données NoSQL'
		],
		image: '/projects/replik-preview.jpg',
		tags: ['Vue.js', 'Node.js', 'MongoDB', 'GridFS'],
		year: 2024,
		type: 'Media Platform',
		colors: '#ef4444',
		github: 'https://github.com/perigmes/Replik',
		logo: '/images/replik-logo.svg',
		font: "'Montserrat', sans-serif",
		isFeatured: true
	}
];

// ── Projets à venir ───────────────────────────────────────
export const upcomingProjects: Project[] = [
	{
		id: 'loup-garou-mc',
		title: 'Loup-Garou de Thiercelieux',
		role: 'Game Developer',
		context: 'Projet Communautaire',
		description: 'Adaptation complète du jeu de société en plugin Minecraft.',
		challenges: [
			'Architecture d’événements asynchrones Java',
			'Synchronisation des cycles de jeu',
			'Optimisation des performances serveur'
		],
		features: [
			'Attribution automatique des rôles',
			'Menus UI personnalisés in-game',
			'Système de chat privé dynamique'
		],
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
