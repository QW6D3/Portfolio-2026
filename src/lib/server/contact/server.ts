import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';

// ── Rate limiting ─────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3; // max submissions
const RATE_WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
		return false;
	}

	if (entry.count >= RATE_LIMIT) return true;

	entry.count++;
	return false;
}

// ── Validation ────────────────────────────────────────────────
const VALID_SUBJECTS = ['opportunity', 'freelance', 'collaboration', 'school', 'other'];

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str.replace(/[<>]/g, '').trim().slice(0, 1000);
}

// ── POST handler ──────────────────────────────────────────────
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Rate limit by IP
	const ip = getClientAddress();
	if (isRateLimited(ip)) {
		throw error(429, 'Trop de requêtes. Réessayez dans une heure.');
	}

	// Parse body
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Corps de requête invalide.');
	}

	if (typeof body !== 'object' || body === null) {
		throw error(400, 'Données manquantes.');
	}

	const data = body as Record<string, unknown>;

	const firstName = sanitize(data.firstName);
	const lastName = sanitize(data.lastName);
	const email = sanitize(data.email);
	const company = sanitize(data.company);
	const subject = sanitize(data.subject);
	const message = sanitize(data.message);

	// Server-side validation
	const validationErrors: Record<string, string> = {};

	if (!firstName) validationErrors.firstName = 'Prénom requis';
	if (!lastName) validationErrors.lastName = 'Nom requis';
	if (!email || !isValidEmail(email)) validationErrors.email = 'Email invalide';
	if (!VALID_SUBJECTS.includes(subject)) validationErrors.subject = 'Sujet invalide';
	if (!message || message.length < 20) validationErrors.message = 'Message trop court';

	if (Object.keys(validationErrors).length > 0) {
		throw error(422, JSON.stringify(validationErrors));
	}

	// ── Send email ─────────────────────────────────────────────
	// Replace this with your preferred email service:
	// - Resend: https://resend.com
	// - SendGrid, Postmark, Nodemailer, etc.
	//
	// Example with Resend:
	//
	// import { RESEND_API_KEY } from '$env/static/private';
	// const res = await fetch('https://api.resend.com/emails', {
	//   method: 'POST',
	//   headers: {
	//     Authorization: `Bearer ${RESEND_API_KEY}`,
	//     'Content-Type': 'application/json',
	//   },
	//   body: JSON.stringify({
	//     from: 'contact@votreportfolio.com',
	//     to: 'votre@email.com',
	//     reply_to: email,
	//     subject: `[Portfolio] ${subject} — ${firstName} ${lastName}`,
	//     text: `
	//       De : ${firstName} ${lastName} <${email}>
	//       Entreprise : ${company || 'N/A'}
	//       Sujet : ${subject}
	//       Message :
	//       ${message}
	//     `,
	//   }),
	// });
	// if (!res.ok) throw error(500, 'Erreur envoi email');

	// Simulate success in dev
	console.log('[Contact Form]', { firstName, lastName, email, company, subject, message });

	return json({ success: true }, { status: 200 });
};
