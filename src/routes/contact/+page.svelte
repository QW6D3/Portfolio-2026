<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import { onMount } from 'svelte';

	// --- Types ---
	type FormStatus = 'idle' | 'loading' | 'success' | 'error';
	type SubjectKey = 'opportunity' | 'freelance' | 'collaboration' | 'school' | 'other';

	interface FormData {
		firstName: string;
		lastName: string;
		email: string;
		subject: SubjectKey | '';
		message: string;
		consent: boolean;
	}

	interface FormErrors {
		firstName?: string;
		lastName?: string;
		email?: string;
		subject?: string;
		message?: string;
		consent?: string;
	}

	// --- State ---
	let formData: FormData = {
		firstName: '',
		lastName: '',
		email: '',
		subject: '',
		message: '',
		consent: false
	};

	let errors: FormErrors = {};
	let status: FormStatus = 'idle';
	let charCount = 0;
	const MAX_CHARS = 1000;
	let honeypot = '';
	let formStartTime: number;
	let isVisible = false;

	const subjects: Record<SubjectKey, string> = {
		opportunity: 'Opportunité de poste',
		freelance: 'Mission freelance',
		collaboration: 'Collaboration de projet',
		school: 'Candidature école',
		other: 'Autre'
	};

	onMount(() => {
		formStartTime = Date.now();
		setTimeout(() => (isVisible = true), 100);
	});

	function validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	function sanitize(str: string): string {
		return str.replace(/[<>]/g, '').trim();
	}

	function validate(): boolean {
		const newErrors: FormErrors = {};
		if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
		if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';
		if (!formData.email.trim()) {
			newErrors.email = 'Email requis';
		} else if (!validateEmail(formData.email)) {
			newErrors.email = 'Email invalide';
		}
		if (!formData.subject) newErrors.subject = 'Veuillez sélectionner un sujet';
		if (!formData.message.trim()) {
			newErrors.message = 'Message requis';
		} else if (formData.message.trim().length < 20) {
			newErrors.message = 'Message trop court (minimum 20 caractères)';
		}
		if (!formData.consent) newErrors.consent = 'Vous devez accepter pour continuer';
		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	function clearError(field: keyof FormErrors) {
		errors = { ...errors, [field]: undefined };
	}

	async function handleSubmit() {
		if (honeypot !== '') return;
		const elapsed = Date.now() - formStartTime;
		if (elapsed < 2000) return;
		if (!validate()) return;

		status = 'loading';

		const payload = {
			firstName: sanitize(formData.firstName),
			lastName: sanitize(formData.lastName),
			email: sanitize(formData.email),
			subject: formData.subject,
			message: sanitize(formData.message)
		};

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) throw new Error('Server error');
			status = 'success';
			resetForm();
		} catch {
			status = 'error';
		}
	}

	function resetForm() {
		formData = { firstName: '', lastName: '', email: '', subject: '', message: '', consent: false };
		errors = {};
		charCount = 0;
	}

	function handleMessageInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		charCount = target.value.length;
		if (charCount > MAX_CHARS) {
			formData.message = target.value.slice(0, MAX_CHARS);
			charCount = MAX_CHARS;
		}
		clearError('message');
	}

	function retryForm() {
		status = 'idle';
	}
</script>

<svelte:head>
	<title>Contact — Charlie Charron | Développeur Web</title>
	<meta
		name="description"
		content="Discutons de votre prochain projet. Recruteurs, écoles, collaborateurs : prenez contact directement avec Charlie Charron."
	/>
	<meta property="og:title" content="Contact — Charlie Charron" />
	<meta
		property="og:description"
		content="Ouvrons la conversation — missions freelance, opportunités de poste, collaborations."
	/>
</svelte:head>

<div class="page-shell" class:visible={isVisible}>
	<Header />

	<div class="layout">
		<!-- LEFT — image + bookmark overlay -->
		<aside class="left-panel" aria-hidden="true">
			<img
				src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop"
				alt=""
				class="bg-image"
			/>
			<div class="overlay"></div>

			<div class="bookmark">
				<span class="bm-eyebrow">Travaillons ensemble</span>
				<h1>
					Une idée ?<br />
					<em>Parlons-en.</em>
				</h1>
				<p class="bm-sub">Chaque message reçoit une réponse personnelle sous 24 à 48 h.</p>

				<ul class="info-list">
					<li>
						<span class="info-label">Localisation</span>
						<span class="info-value">Rennes — Remote</span>
					</li>
					<li>
						<span class="info-label">Disponibilité</span>
						<span class="info-value">Ouvert aux opportunités</span>
					</li>
					<li>
						<span class="info-label">Langues</span>
						<span class="info-value">Français · Anglais TOEIC</span>
					</li>
				</ul>

				<div class="bm-links">
					<a href="mailto:charlie.charron.pro@gmail.com" class="bm-link">
						charlie.charron.pro@gmail.com
					</a>
					<a
						href="https://github.com/QW6D3"
						target="_blank"
						rel="noopener noreferrer"
						class="bm-link"
					>
						GitHub ↗
					</a>
					<a
						href="https://www.linkedin.com/in/charlie-charron"
						target="_blank"
						rel="noopener noreferrer"
						class="bm-link"
					>
						LinkedIn ↗
					</a>
				</div>
			</div>
		</aside>

		<!-- RIGHT — form -->
		<main class="right-panel" aria-label="Formulaire de contact">
			{#if status === 'success'}
				<div class="feedback success" role="status" aria-live="polite">
					<div class="feedback-icon">✓</div>
					<h2>Message envoyé !</h2>
					<p>Merci pour votre message. Je vous répondrai dans les 24 à 48 heures.</p>
					<button class="btn-reset" on:click={retryForm}>Envoyer un autre message</button>
				</div>
			{:else if status === 'error'}
				<div class="feedback error" role="alert" aria-live="assertive">
					<div class="feedback-icon">✗</div>
					<h2>Une erreur est survenue</h2>
					<p>
						Réessayez ou écrivez directement à
						<a href="mailto:charlie.charron.pro@gmail.com">charlie.charron.pro@gmail.com</a>
					</p>
					<button class="btn-reset" on:click={retryForm}>Réessayer</button>
				</div>
			{:else}
				<div class="form-container">
					<div class="form-header">
						<h2>Envoyez-moi un message</h2>
						<p>Les champs <abbr title="obligatoires">*</abbr> sont requis.</p>
					</div>

					<!-- Mobile only — infos -->
					<div class="mobile-info">
						<a href="mailto:charlie.charron.pro@gmail.com" class="mobile-link"
							>charlie.charron.pro@gmail.com</a
						>
						<a
							href="https://github.com/QW6D3"
							target="_blank"
							rel="noopener noreferrer"
							class="mobile-link">GitHub ↗</a
						>
						<a
							href="https://www.linkedin.com/in/charlie-charron"
							target="_blank"
							rel="noopener noreferrer"
							class="mobile-link">LinkedIn ↗</a
						>
					</div>

					<form on:submit|preventDefault={handleSubmit} novalidate>
						<!-- Honeypot anti-spam -->
						<div class="hp-field" aria-hidden="true">
							<input
								type="text"
								name="website"
								tabindex="-1"
								autocomplete="off"
								bind:value={honeypot}
							/>
						</div>

						<div class="field-row">
							<div class="field" class:has-error={errors.firstName}>
								<label for="firstName">Prénom *</label>
								<input
									id="firstName"
									type="text"
									bind:value={formData.firstName}
									on:input={() => clearError('firstName')}
									placeholder="Charlie"
									autocomplete="given-name"
									aria-required="true"
									aria-invalid={!!errors.firstName}
									aria-describedby={errors.firstName ? 'err-firstName' : undefined}
									maxlength={50}
								/>
								{#if errors.firstName}
									<span id="err-firstName" class="error-msg" role="alert">{errors.firstName}</span>
								{/if}
							</div>

							<div class="field" class:has-error={errors.lastName}>
								<label for="lastName">Nom *</label>
								<input
									id="lastName"
									type="text"
									bind:value={formData.lastName}
									on:input={() => clearError('lastName')}
									placeholder="Charron"
									autocomplete="family-name"
									aria-required="true"
									aria-invalid={!!errors.lastName}
									aria-describedby={errors.lastName ? 'err-lastName' : undefined}
									maxlength={50}
								/>
								{#if errors.lastName}
									<span id="err-lastName" class="error-msg" role="alert">{errors.lastName}</span>
								{/if}
							</div>
						</div>

						<div class="field" class:has-error={errors.email}>
							<label for="email">Email *</label>
							<input
								id="email"
								type="email"
								bind:value={formData.email}
								on:input={() => clearError('email')}
								placeholder="votre@email.com"
								autocomplete="email"
								aria-required="true"
								aria-invalid={!!errors.email}
								aria-describedby={errors.email ? 'err-email' : undefined}
								maxlength={100}
							/>
							{#if errors.email}
								<span id="err-email" class="error-msg" role="alert">{errors.email}</span>
							{/if}
						</div>

						<div class="field" class:has-error={errors.subject}>
							<label for="subject">Sujet *</label>
							<div class="select-wrapper">
								<select
									id="subject"
									bind:value={formData.subject}
									on:change={() => clearError('subject')}
									aria-required="true"
									aria-invalid={!!errors.subject}
									aria-describedby={errors.subject ? 'err-subject' : undefined}
								>
									<option value="" disabled selected>Sélectionnez un sujet</option>
									{#each Object.entries(subjects) as [key, label] (key)}
										<option value={key}>{label}</option>
									{/each}
								</select>
								<span class="select-arrow" aria-hidden="true">↓</span>
							</div>
							{#if errors.subject}
								<span id="err-subject" class="error-msg" role="alert">{errors.subject}</span>
							{/if}
						</div>

						<div class="field" class:has-error={errors.message}>
							<label for="message">Message *</label>
							<textarea
								id="message"
								bind:value={formData.message}
								on:input={handleMessageInput}
								placeholder="Décrivez votre besoin, votre projet ou votre opportunité..."
								rows={4}
								aria-required="true"
								aria-invalid={!!errors.message}
								aria-describedby="char-count {errors.message ? 'err-message' : ''}"
							></textarea>
							<div class="textarea-footer">
								{#if errors.message}
									<span id="err-message" class="error-msg" role="alert">{errors.message}</span>
								{:else}
									<span></span>
								{/if}
								<span
									id="char-count"
									class="char-count"
									class:near-limit={charCount > MAX_CHARS * 0.8}
									aria-live="polite">{charCount}/{MAX_CHARS}</span
								>
							</div>
						</div>

						<div class="field consent-field" class:has-error={errors.consent}>
							<label class="checkbox-label">
								<input
									type="checkbox"
									bind:checked={formData.consent}
									on:change={() => clearError('consent')}
									aria-required="true"
									aria-invalid={!!errors.consent}
									aria-describedby={errors.consent ? 'err-consent' : undefined}
								/>
								<span class="checkmark" aria-hidden="true"></span>
								<span>J'accepte que mes données soient utilisées pour répondre à ma demande.</span>
							</label>
							{#if errors.consent}
								<span id="err-consent" class="error-msg" role="alert">{errors.consent}</span>
							{/if}
						</div>

						<div class="form-actions">
							<button
								type="submit"
								class="btn-submit"
								disabled={status === 'loading'}
								aria-busy={status === 'loading'}
							>
								{#if status === 'loading'}
									<span class="spinner" aria-hidden="true"></span>
									<span>Envoi en cours…</span>
								{:else}
									<span>Envoyer</span>
									<span class="btn-arrow" aria-hidden="true">→</span>
								{/if}
							</button>
						</div>
					</form>
				</div>
			{/if}
		</main>
	</div>
</div>

<style lang="scss">
	@use 'sass:color';

	// ── Tokens ────────────────────────────────────────────────
	$bg: #f4f3ef;
	$surface: #ffffff;
	$ink: #1c1c1a;
	$muted: #72716d;
	$border: #e0ddd6;
	$error: #c0392b;
	$success: #27ae60;
	$radius-sm: 7px;
	$ease: 200ms cubic-bezier(0.4, 0, 0.2, 1);

	// ── Shell ─────────────────────────────────────────────────
	.page-shell {
		height: calc(100dvh - 88px);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background: $bg;
		color: $ink;
		opacity: 0;
		transition: opacity 400ms ease;

		&.visible {
			opacity: 1;
		}
	}

	// ── Two-column layout ─────────────────────────────────────
	.layout {
		flex: 1;
		display: flex;
		min-height: 0;
	}

	// ── Left panel ────────────────────────────────────────────
	.left-panel {
		position: relative;
		flex: 0 0 44%;
		overflow: hidden;
		border-radius: 22px;
		@media (max-width: 860px) {
			display: none;
		}
	}

	.bg-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	.overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			155deg,
			rgba(8, 8, 6, 0.6) 0%,
			rgba(8, 8, 6, 0.28) 55%,
			rgba(8, 8, 6, 0.52) 100%
		);
	}

	// ── Bookmark ──────────────────────────────────────────────
	.bookmark {
		position: absolute;
		top: 32px;
		left: 28px;
		width: min(300px, calc(100% - 56px));
		background: rgba(255, 255, 255, 0.09);
		backdrop-filter: blur(20px) saturate(1.5);
		-webkit-backdrop-filter: blur(20px) saturate(1.5);
		border: 1px solid rgba(255, 255, 255, 0.16);
		border-radius: 12px;
		padding: 26px 24px 22px;
		color: #fff;
	}

	.bm-eyebrow {
		display: block;
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
		margin-bottom: 13px;
	}

	.bookmark h1 {
		font-size: clamp(1.6rem, 2.2vw, 2rem);
		font-weight: 700;
		line-height: 1.15;
		margin: 0 0 10px;
		color: #fff;

		em {
			font-style: italic;
			font-weight: 400;
			color: rgba(255, 255, 255, 0.68);
		}
	}

	.bm-sub {
		font-size: 0.78rem;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.55;
		margin: 0 0 20px;
	}

	.info-list {
		list-style: none;
		padding: 18px 0 0;
		margin: 0 0 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.11);
		display: flex;
		flex-direction: column;
		gap: 9px;

		li {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			gap: 10px;
		}

		.info-label {
			font-size: 0.64rem;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			color: rgba(255, 255, 255, 0.42);
			white-space: nowrap;
			flex-shrink: 0;
		}

		.info-value {
			font-size: 0.78rem;
			color: rgba(255, 255, 255, 0.85);
			text-align: right;
		}
	}

	.bm-links {
		border-top: 1px solid rgba(255, 255, 255, 0.11);
		padding-top: 16px;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.bm-link {
		font-size: 0.76rem;
		color: rgba(255, 255, 255, 0.62);
		text-decoration: none;
		transition: color $ease;

		&:hover {
			color: #fff;
		}

		&:focus-visible {
			outline: 2px solid rgba(255, 255, 255, 0.55);
			outline-offset: 3px;
			border-radius: 3px;
		}
	}

	// ── Right panel ───────────────────────────────────────────
	.right-panel {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px 48px;
		overflow-y: auto;

		@media (max-width: 1024px) {
			padding: 32px 32px;
		}
		@media (max-width: 860px) {
			padding: 28px 20px;
			align-items: flex-start;
		}
	}

	// ── Form container ────────────────────────────────────────
	.form-container {
		width: 100%;
		max-width: 420px;
	}

	.form-header {
		margin-bottom: 24px;

		h2 {
			font-size: clamp(1.25rem, 2vw, 1.6rem);
			font-weight: 700;
			margin: 0 0 5px;
			color: $ink;
			line-height: 1.2;
		}

		p {
			font-size: 0.75rem;
			color: $muted;
			margin: 0;

			abbr {
				text-decoration: none;
				color: $error;
				font-style: normal;
			}
		}
	}

	// ── Mobile info strip ─────────────────────────────────────
	.mobile-info {
		display: none;
		gap: 16px;
		margin-bottom: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid $border;

		@media (max-width: 860px) {
			display: flex;
			flex-wrap: wrap;
		}
	}

	.mobile-link {
		font-size: 0.8rem;
		color: $muted;
		text-decoration: none;
		border-bottom: 1px solid $border;
		padding-bottom: 1px;
		transition:
			color $ease,
			border-color $ease;

		&:hover {
			color: $ink;
			border-color: $ink;
		}
	}

	// ── Honeypot ──────────────────────────────────────────────
	.hp-field {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	// ── Fields ────────────────────────────────────────────────
	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;

		@media (max-width: 400px) {
			grid-template-columns: 1fr;
		}
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-bottom: 14px;

		label {
			font-size: 0.75rem;
			font-weight: 500;
			color: $ink;
		}

		input,
		select,
		textarea {
			font-size: 0.88rem;
			color: $ink;
			background: $surface;
			border: 1.5px solid $border;
			border-radius: $radius-sm;
			padding: 9px 12px;
			width: 100%;
			box-sizing: border-box;
			outline: none;
			appearance: none;
			transition:
				border-color $ease,
				box-shadow $ease;

			&::placeholder {
				color: color.adjust($muted, $lightness: 20%);
			}

			&:hover {
				border-color: color.adjust($border, $lightness: -10%);
			}

			&:focus {
				border-color: $ink;
				box-shadow: 0 0 0 3px rgba(28, 28, 26, 0.07);
			}
		}

		textarea {
			resize: none;
			min-height: 88px;
			line-height: 1.6;
		}

		&.has-error {
			input,
			select,
			textarea {
				border-color: $error;
				background: color.adjust($error, $lightness: 50%);

				&:focus {
					box-shadow: 0 0 0 3px rgba($error, 0.1);
				}
			}
		}
	}

	.error-msg {
		font-size: 0.71rem;
		color: $error;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 4px;

		&::before {
			content: '!';
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 13px;
			height: 13px;
			background: $error;
			color: white;
			border-radius: 50%;
			font-size: 0.6rem;
			font-weight: 700;
			flex-shrink: 0;
		}
	}

	// ── Select ────────────────────────────────────────────────
	.select-wrapper {
		position: relative;

		select {
			cursor: pointer;
			padding-right: 34px;
		}

		.select-arrow {
			position: absolute;
			right: 12px;
			top: 50%;
			transform: translateY(-50%);
			pointer-events: none;
			color: $muted;
			font-size: 0.75rem;
		}
	}

	// ── Textarea footer ───────────────────────────────────────
	.textarea-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.char-count {
		font-size: 0.68rem;
		color: $muted;
		margin-left: auto;
		flex-shrink: 0;

		&.near-limit {
			color: color.adjust(#e67e22, $lightness: -10%);
			font-weight: 500;
		}
	}

	// ── Consent ───────────────────────────────────────────────
	.consent-field {
		margin-top: 2px;
	}

	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		cursor: pointer;
		font-size: 0.75rem;
		color: $muted;
		line-height: 1.5;

		input[type='checkbox'] {
			position: absolute;
			opacity: 0;
			width: 0;
			height: 0;

			&:checked + .checkmark {
				background: $ink;
				border-color: $ink;

				&::after {
					display: block;
				}
			}

			&:focus-visible + .checkmark {
				box-shadow: 0 0 0 3px rgba(28, 28, 26, 0.18);
			}
		}

		.checkmark {
			flex-shrink: 0;
			width: 15px;
			height: 15px;
			border: 1.5px solid $border;
			border-radius: 3px;
			background: $surface;
			position: relative;
			margin-top: 2px;
			transition:
				background $ease,
				border-color $ease;

			&::after {
				content: '';
				display: none;
				position: absolute;
				left: 4px;
				top: 1px;
				width: 4px;
				height: 7px;
				border: 1.5px solid white;
				border-top: none;
				border-left: none;
				transform: rotate(45deg);
			}
		}
	}

	// ── Submit ────────────────────────────────────────────────
	.form-actions {
		margin-top: 20px;
	}

	.btn-submit {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		background: $ink;
		color: white;
		border: none;
		border-radius: 100px;
		padding: 11px 26px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		letter-spacing: 0.02em;
		transition:
			background $ease,
			transform $ease,
			box-shadow $ease;

		.btn-arrow {
			transition: transform $ease;
		}

		&:hover:not(:disabled) {
			background: color.adjust($ink, $lightness: 12%);
			box-shadow: 0 5px 18px rgba(0, 0, 0, 0.15);
			transform: translateY(-1px);

			.btn-arrow {
				transform: translateX(4px);
			}
		}

		&:active:not(:disabled) {
			transform: translateY(0);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		&:focus-visible {
			outline: 2px solid $ink;
			outline-offset: 4px;
		}
	}

	.spinner {
		width: 13px;
		height: 13px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 700ms linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	// ── Feedback ──────────────────────────────────────────────
	.feedback {
		width: 100%;
		max-width: 420px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		animation: fadeIn 350ms ease;

		.feedback-icon {
			width: 44px;
			height: 44px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.1rem;
			font-weight: 700;
			margin-bottom: 4px;
		}

		h2 {
			font-size: 1.35rem;
			font-weight: 700;
			margin: 0;
		}

		p {
			font-size: 0.85rem;
			color: $muted;
			line-height: 1.6;
			margin: 0;

			a {
				color: $ink;
				font-weight: 500;
			}
		}

		&.success .feedback-icon {
			background: color.adjust($success, $lightness: 50%);
			color: $success;
			border: 1.5px solid color.adjust($success, $lightness: 30%);
		}
		&.success h2 {
			color: $success;
		}

		&.error .feedback-icon {
			background: color.adjust($error, $lightness: 40%);
			color: $error;
			border: 1.5px solid color.adjust($error, $lightness: 25%);
		}
		&.error h2 {
			color: $error;
		}
	}

	.btn-reset {
		background: none;
		border: 1.5px solid $border;
		border-radius: 100px;
		padding: 9px 22px;
		font-size: 0.83rem;
		cursor: pointer;
		color: $ink;
		transition:
			border-color $ease,
			background $ease;
		margin-top: 4px;

		&:hover {
			border-color: $ink;
			background: $bg;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
