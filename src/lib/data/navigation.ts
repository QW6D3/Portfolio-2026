// navigation.ts
import { Home, User, Briefcase, Mail } from 'lucide-svelte';

export const navItems = [
	{ name: 'Home', icon: Home, path: '/' },
	{ name: 'About Me', icon: User, path: '/about-me' },
	{ name: 'Projects', icon: Briefcase, path: '/projects' },
	{ name: 'Contact', icon: Mail, path: '/contact' }
] as const;
