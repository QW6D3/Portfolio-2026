export interface Project {
	id: number;
	imgCover: string;
	videoCover?: string;
	title: string;
	description: string;
	tags: string[];
	link?: string;
	github?: string;
}

export const projects: Project[] = [
	{
		id: 1,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Portfolio Web',
		description: 'Un site personnel moderne pour présenter mes compétences et mes projets.',
		tags: ['React', 'SCSS', 'Design'],
		link: 'https://monportfolio.com',
		github: 'https://github.com/charlie/portfolio'
	},
	{
		id: 2,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Application Mobile',
		description: 'Une application mobile Flutter pour gérer les commandes de boissons.',
		tags: ['Flutter', 'Firebase', 'UX'],
		github: 'https://github.com/charlie/app-mobile'
	},
	{
		id: 3,
		imgCover: 'https://picsum.photos/200/300',
		videoCover: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
		title: 'Jeu Unity 3D',
		description: 'Un mini-jeu développé sur Unity autour du thème de la fête foraine.',
		tags: ['Unity', 'C#', '3D'],
		link: 'https://itch.io/mygame'
	},
	{
		id: 4,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Tableau de bord industriel',
		description:
			'Un outil web pour visualiser et analyser des données industrielles en temps réel.',
		tags: ['SvelteKit', 'PHP', 'MySQL'],
		github: 'https://github.com/charlie/dashboard'
	},
	{
		id: 5,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Blog personnel',
		description: 'Un blog minimaliste avec gestion des articles et back-office.',
		tags: ['Vue.js', 'Node.js', 'MongoDB'],
		github: 'https://github.com/charlie/blog'
	},
	{
		id: 6,
		imgCover: 'https://picsum.photos/200/300',
		title: 'E-commerce',
		description: 'Une boutique en ligne avec gestion des paniers et des paiements.',
		tags: ['Symfony', 'MySQL', 'Stripe'],
		github: 'https://github.com/charlie/ecommerce'
	},
	{
		id: 7,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Jeu Loup-Garou',
		description: 'Un plugin Minecraft Spigot pour jouer au Loup-Garou en multijoueur.',
		tags: ['Java', 'Spigot', 'Gameplay'],
		github: 'https://github.com/charlie/loupgarou'
	},
	{
		id: 8,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Rezav',
		description:
			'Application de réservation de matériel audiovisuel développée en React et Node.js.',
		tags: ['React', 'Node.js', 'Express'],
		github: 'https://github.com/charlie/rezav'
	},
	{
		id: 9,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Replik',
		description: 'Application de podcast avec back-office en Vue.js et API Node.js.',
		tags: ['Vue.js', 'Node.js', 'MongoDB'],
		github: 'https://github.com/charlie/replik'
	},
	{
		id: 10,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Application météo',
		description: 'Une application web affichant la météo en temps réel via une API externe.',
		tags: ['SvelteKit', 'API', 'UX'],
		github: 'https://github.com/charlie/meteo'
	},
	{
		id: 11,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Drone Controller',
		description: 'Un prototype d’interface de contrôle pour drone connecté.',
		tags: ['Arduino', 'TypeScript', 'IoT'],
		github: 'https://github.com/charlie/drone-controller'
	},
	{
		id: 12,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Site vitrine',
		description: 'Un site vitrine moderne pour une entreprise locale.',
		tags: ['HTML', 'CSS', 'JavaScript'],
		github: 'https://github.com/charlie/vitrine'
	},
	{
		id: 13,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Mini-jeu React',
		description: 'Un petit jeu style Gartic Phone en React avec Redux.',
		tags: ['React', 'Redux', 'Canvas']
	},
	{
		id: 14,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Plugin Wordpress',
		description: 'Un plugin Wordpress personnalisé avec Elementor.',
		tags: ['Wordpress', 'PHP', 'Elementor']
	},
	{
		id: 15,
		imgCover: 'https://picsum.photos/200/300',
		title: 'App To-Do',
		description: 'Application de gestion de tâches simple et rapide.',
		tags: ['Vue.js', 'Pinia', 'CSS']
	},
	{
		id: 16,
		imgCover: 'https://picsum.photos/200/300',
		title: 'App Finance',
		description: 'Application de suivi budgétaire avec visualisations.',
		tags: ['SvelteKit', 'D3.js', 'UX']
	},
	{
		id: 17,
		imgCover: 'https://picsum.photos/200/300',
		title: 'API REST',
		description: 'API REST pour gérer des utilisateurs et authentification.',
		tags: ['Node.js', 'Express', 'JWT']
	},
	{
		id: 18,
		imgCover: 'https://picsum.photos/200/300',
		title: 'Chat en temps réel',
		description: 'Application de chat en temps réel avec WebSockets.',
		tags: ['React', 'Node.js', 'Socket.io']
	},
	{
		id: 19,
		imgCover: 'https://picsum.photos/200/300',
		title: 'App Fitness',
		description: 'Suivi des entraînements et des performances sportives.',
		tags: ['Flutter', 'Firebase', 'UX']
	}
];
