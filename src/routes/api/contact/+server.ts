import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

// ── Rate limiting ─────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
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

const SUBJECT_LABELS: Record<string, string> = {
	opportunity: 'Opportunité de poste',
	freelance: 'Mission freelance',
	collaboration: 'Collaboration de projet',
	school: 'Candidature école',
	other: 'Autre'
};

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(str: unknown): string {
	if (typeof str !== 'string') return '';
	return str.replace(/[<>]/g, '').trim().slice(0, 1000);
}

// ── POST handler ──────────────────────────────────────────────
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const ip = getClientAddress();
	if (isRateLimited(ip)) {
		throw error(429, 'Trop de requêtes. Réessayez dans une heure.');
	}

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

	// ── Send email via Resend ──────────────────────────────────
	const resend = new Resend(env.RESEND_API_KEY);
	const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

	const { error: resendError } = await resend.emails.send({
		from: 'Portfolio <onboarding@resend.dev>',
		to: ['charlie.charron29@gmail.com'],
		subject: `[Portfolio] ${subjectLabel} — ${firstName} ${lastName}`,
		html: `
			<p><strong>De :</strong> ${firstName} ${lastName} &lt;${email}&gt;</p>
			<p><strong>Sujet :</strong> ${subjectLabel}</p>
			<hr />
			<p>${message.replace(/\n/g, '<br />')}</p>
		`
	});

	if (resendError) {
		console.error('[Resend error]', resendError);
		throw error(500, "Erreur lors de l'envoi de l'email.");
	}

	return json({ success: true }, { status: 200 });
};
