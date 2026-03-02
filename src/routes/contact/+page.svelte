<script lang="ts">
	import Header from '$lib/components/layout/Header.svelte';
	import Grainient from '$lib/components/ui/Grainient.svelte';
	import { MessageCircleMore, Send, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	type Status = 'idle' | 'loading' | 'success' | 'error';
	type SubjectKey = 'opportunity' | 'freelance' | 'collaboration' | 'school' | 'other';

	interface Fields {
		firstName: string;
		lastName: string;
		email: string;
		subject: SubjectKey | '';
		message: string;
		consent: boolean;
	}

	type Errors = Partial<Record<keyof Fields, boolean>>;
	type Shaking = Partial<Record<keyof Fields, boolean>>;

	const subjects: { key: SubjectKey; label: string }[] = [
		{ key: 'opportunity', label: 'Opportunité de poste' },
		{ key: 'freelance', label: 'Mission freelance' },
		{ key: 'collaboration', label: 'Collaboration de projet' },
		{ key: 'school', label: 'Candidature école' },
		{ key: 'other', label: 'Autre' }
	];

	const errorMessages: Partial<Record<keyof Fields, string>> = {
		firstName: 'Prénom requis',
		lastName: 'Nom requis',
		email: 'Adresse email invalide',
		subject: 'Veuillez sélectionner un sujet',
		message: 'Message trop court (20 caractères minimum)',
		consent: 'Vous devez accepter pour continuer'
	};

	let fields: Fields = {
		firstName: '',
		lastName: '',
		email: '',
		subject: '',
		message: '',
		consent: false
	};
	let errors: Errors = {};
	let shaking: Shaking = {};
	let status: Status = 'idle';
	let honeypot = '';
	let startTime: number;
	let charCount = 0;
	const MAX = 1000;

	let errorText: Partial<Record<keyof Fields, string>> = {};
	let errorTimers: Partial<Record<keyof Fields, ReturnType<typeof setTimeout>>> = {};

	let mounted = false;

	onMount(() => {
		startTime = Date.now();
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				mounted = true;
			});
		});
	});

	function shake(key: keyof Fields) {
		shaking = { ...shaking, [key]: true };
		setTimeout(() => {
			shaking = { ...shaking, [key]: false };
		}, 400);
	}

	function validateEmail(v: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
	}

	function sanitize(v: string) {
		return v.replace(/[<>]/g, '').trim();
	}

	function setError(key: keyof Fields, hasError: boolean) {
		if (hasError) {
			clearTimeout(errorTimers[key]);
			errorText = { ...errorText, [key]: errorMessages[key] };
			errors = { ...errors, [key]: true };
		} else {
			errors = { ...errors, [key]: false };
			errorTimers[key] = setTimeout(() => {
				errorText = { ...errorText, [key]: '' };
			}, 450);
		}
	}

	function checkField(key: keyof Fields): boolean {
		const v = fields[key];
		let invalid = false;
		if (key === 'firstName' || key === 'lastName') invalid = !(v as string).trim();
		if (key === 'email') invalid = !(v as string).trim() || !validateEmail(v as string);
		if (key === 'subject') invalid = !v;
		if (key === 'message') invalid = (v as string).trim().length < 20;
		if (key === 'consent') invalid = !(v as boolean);
		if (invalid) {
			setError(key, true);
			shake(key);
		} else {
			setError(key, false);
		}
		return !invalid;
	}

	function validateAll(): boolean {
		const keys: (keyof Fields)[] = [
			'firstName',
			'lastName',
			'email',
			'subject',
			'message',
			'consent'
		];
		return keys.map((k) => checkField(k)).every(Boolean);
	}

	function onBlurField(key: keyof Fields) {
		const v = fields[key];
		const hasValue = typeof v === 'string' ? v.trim().length > 0 : v;
		if (hasValue) checkField(key);
	}

	function onMessageInput(e: Event) {
		const t = e.target as HTMLTextAreaElement;
		charCount = Math.min(t.value.length, MAX);
		fields.message = t.value.slice(0, MAX);
	}

	async function submit() {
		if (honeypot || Date.now() - startTime < 2000) return;
		if (!validateAll()) return;

		status = 'loading';
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: sanitize(fields.firstName),
					lastName: sanitize(fields.lastName),
					email: sanitize(fields.email),
					subject: fields.subject,
					message: sanitize(fields.message)
				})
			});
			if (!res.ok) throw new Error();
			status = 'success';
			fields = { firstName: '', lastName: '', email: '', subject: '', message: '', consent: false };
			errors = {};
			errorText = {};
			charCount = 0;
		} catch {
			status = 'error';
		}
	}

	function retry() {
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

<Header />

<main class="layout">
	<section class="panel-left" aria-hidden="true">
		{#if browser}
			<div class="grainient-wrap" class:anim-ready={mounted}>
				<Grainient
					color1="#c8b8ff"
					color2="#1a1060"
					color3="#0d0d0d"
					timeSpeed={0.18}
					warpStrength={1.2}
					warpFrequency={4.5}
					warpSpeed={1.8}
					warpAmplitude={55.0}
					grainAmount={0.08}
					grainScale={2.5}
					contrast={1.4}
					saturation={0.95}
					zoom={0.85}
					blendAngle={-15.0}
					rotationAmount={420.0}
				/>
				<div class="panel-title" class:anim-ready={mounted}>
					<h1>Une idée ? Parlons-en.</h1>
				</div>
			</div>
		{/if}

		<div class="bookmark" class:anim-ready={mounted}>
			<div class="bookmark-content" class:anim-ready={mounted}>
				<span class="eyebrow">Mes infos</span>
				<p class="tagline">Chaque message reçoit une réponse personnelle sous 24 à 48 h.</p>

				<dl class="info">
					<div>
						<dt>Localisation</dt>
						<dd>Rennes — Remote</dd>
					</div>
					<div>
						<dt>Disponibilité</dt>
						<dd>Ouvert aux opportunités</dd>
					</div>
					<div>
						<dt>Langues</dt>
						<dd>Français · Anglais TOEIC</dd>
					</div>
				</dl>

				<ul class="links" role="list">
					<li><a href="mailto:charlie.charron.pro@gmail.com">charlie.charron.pro@gmail.com</a></li>
					<li>
						<a href="https://github.com/QW6D3" target="_blank" rel="noopener noreferrer">GitHub ↗</a
						>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/charlie-charron"
							target="_blank"
							rel="noopener noreferrer">LinkedIn ↗</a
						>
					</li>
				</ul>
			</div>
		</div>
	</section>

	<section class="panel-right" aria-label="Formulaire de contact">
		<div class="form-wrap">
			{#if status === 'success'}
				<div class="feedback success" role="status">
					<span class="icon" aria-hidden="true">✓</span>
					<h2>Message envoyé !</h2>
					<p>Je vous répondrai dans les 24 à 48 heures.</p>
					<button class="btn-reset" on:click={retry}>Envoyer un autre message</button>
				</div>
			{:else}
				<div class="form-header" class:anim-ready={mounted}>
					<span class="anim-item" style="--i:0">
						<MessageCircleMore color="#8783d1" size={36} aria-hidden="true" strokeWidth={2.5} />
					</span>
					<h2 class="anim-item" style="--i:1">Envoyez-moi un message</h2>
					<p class="anim-item" style="--i:2">
						Une idée, une opportunité ou juste une question ?<br />Remplissez le formulaire, je vous
						réponds sous 48 h.
					</p>
				</div>

				<ul class="mobile-links anim-item" class:anim-ready={mounted} style="--i:3" role="list">
					<li><a href="mailto:charlie.charron.pro@gmail.com">charlie.charron.pro@gmail.com</a></li>
					<li>
						<a href="https://github.com/QW6D3" target="_blank" rel="noopener noreferrer">GitHub ↗</a
						>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/charlie-charron"
							target="_blank"
							rel="noopener noreferrer">LinkedIn ↗</a
						>
					</li>
				</ul>

				<form
					class="anim-item"
					class:anim-ready={mounted}
					style="--i:4"
					on:submit|preventDefault={submit}
					novalidate
				>
					<div class="hp" aria-hidden="true">
						<input
							type="text"
							name="website"
							tabindex="-1"
							autocomplete="off"
							bind:value={honeypot}
						/>
					</div>

					<div class="row">
						<div class="field" class:err={errors.firstName} class:shake={shaking.firstName}>
							<label for="firstName">Prénom <abbr title="obligatoire">*</abbr></label>
							<input
								id="firstName"
								type="text"
								bind:value={fields.firstName}
								on:blur={() => onBlurField('firstName')}
								on:input={() => {
									if (errors.firstName) setError('firstName', false);
								}}
								placeholder="Charlie"
								autocomplete="given-name"
								aria-required="true"
								aria-invalid={!!errors.firstName}
								maxlength={50}
							/>
							<span class="err-msg" class:visible={errors.firstName} role="alert">
								{errorText.firstName ?? ''}
							</span>
						</div>

						<div class="field" class:err={errors.lastName} class:shake={shaking.lastName}>
							<label for="lastName">Nom <abbr title="obligatoire">*</abbr></label>
							<input
								id="lastName"
								type="text"
								bind:value={fields.lastName}
								on:blur={() => onBlurField('lastName')}
								on:input={() => {
									if (errors.lastName) setError('lastName', false);
								}}
								placeholder="Charron"
								autocomplete="family-name"
								aria-required="true"
								aria-invalid={!!errors.lastName}
								maxlength={50}
							/>
							<span class="err-msg" class:visible={errors.lastName} role="alert">
								{errorText.lastName ?? ''}
							</span>
						</div>
					</div>

					<div class="field" class:err={errors.email} class:shake={shaking.email}>
						<label for="email">Email <abbr title="obligatoire">*</abbr></label>
						<input
							id="email"
							type="email"
							bind:value={fields.email}
							on:blur={() => onBlurField('email')}
							on:input={() => {
								if (errors.email) setError('email', false);
							}}
							placeholder="votre@email.com"
							autocomplete="email"
							aria-required="true"
							aria-invalid={!!errors.email}
							maxlength={100}
						/>
						<span class="err-msg" class:visible={errors.email} role="alert">
							{errorText.email ?? ''}
						</span>
					</div>

					<div class="field" class:err={errors.subject} class:shake={shaking.subject}>
						<label for="subject">Sujet <abbr title="obligatoire">*</abbr></label>
						<div class="select-wrap">
							<select
								id="subject"
								bind:value={fields.subject}
								on:blur={() => onBlurField('subject')}
								on:change={() => {
									if (errors.subject) setError('subject', false);
								}}
								aria-required="true"
								aria-invalid={!!errors.subject}
							>
								<option value="" disabled>Sélectionnez un sujet</option>
								{#each subjects as s (s.key)}
									<option value={s.key}>{s.label}</option>
								{/each}
							</select>
							<span aria-hidden="true">↓</span>
						</div>
						<span class="err-msg" class:visible={errors.subject} role="alert">
							{errorText.subject ?? ''}
						</span>
					</div>

					<div class="field" class:err={errors.message} class:shake={shaking.message}>
						<label for="message">Message <abbr title="obligatoire">*</abbr></label>
						<textarea
							id="message"
							bind:value={fields.message}
							on:input={onMessageInput}
							on:blur={() => onBlurField('message')}
							placeholder="Décrivez votre besoin, votre projet ou votre opportunité..."
							rows={5}
							aria-required="true"
							aria-invalid={!!errors.message}
						></textarea>
						<div class="textarea-footer">
							<span class="err-msg" class:visible={errors.message} role="alert">
								{errorText.message ?? ''}
							</span>
							<span class="count" class:warn={charCount > MAX * 0.8} aria-live="polite"
								>{charCount}/{MAX}</span
							>
						</div>
					</div>

					<div class="field consent" class:err={errors.consent} class:shake={shaking.consent}>
						<label class="check-label">
							<input
								type="checkbox"
								bind:checked={fields.consent}
								on:blur={() => onBlurField('consent')}
								on:change={() => {
									if (errors.consent) setError('consent', false);
								}}
								aria-required="true"
								aria-invalid={!!errors.consent}
							/>
							<span class="box" aria-hidden="true"></span>
							<span>J'accepte que mes données soient utilisées pour répondre à ma demande.</span>
						</label>
						<span class="err-msg" class:visible={errors.consent} role="alert">
							{errorText.consent ?? ''}
						</span>
					</div>

					<button
						type="submit"
						class="btn-submit"
						class:is-error={status === 'error'}
						disabled={status === 'loading'}
						aria-busy={status === 'loading'}
					>
						{#if status === 'loading'}
							<span class="spinner" aria-hidden="true"></span>
							<span>Envoi en cours…</span>
						{:else if status === 'error'}
							<X size={16} aria-hidden="true" />
							<span>Échec — réessayer</span>
						{:else}
							<Send size={16} aria-hidden="true" />
							<span>Envoyer</span>
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</section>
</main>

<style lang="scss">
	$ease: 200ms cubic-bezier(0.4, 0, 0.2, 1);
	$radius: 22px;
	$error: #c0392b;
	$success: #27ae60;

	@keyframes bookmarkDrop {
		from {
			max-height: 0;
			opacity: 0;
		}
		to {
			max-height: 455px;
			opacity: 1;
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.bookmark {
		max-height: 0;
		opacity: 0;

		&.anim-ready {
			animation: bookmarkDrop 900ms cubic-bezier(0.22, 1, 0.36, 1) 100ms forwards;
		}
	}
	.bookmark-content {
		opacity: 0;

		&.anim-ready {
			animation: fadeIn 400ms ease forwards;
			animation-delay: 700ms;
		}
	}

	.grainient-wrap {
		opacity: 0;
		transform: scale(0.98);
		transition:
			opacity 900ms ease,
			transform 900ms ease;

		&.anim-ready {
			opacity: 1;
			transform: scale(1);
		}
	}

	// Titre dans le panel gauche
	.panel-title {
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 600ms ease 500ms,
			transform 600ms ease 500ms;

		&.anim-ready {
			opacity: 1;
			transform: translateY(0);
		}
	}

	// Éléments du formulaire en cascade (--i = index du stagger)
	.anim-item {
		opacity: 0;
		transform: translateY(16px);
		transition: none;
	}

	.form-header.anim-ready .anim-item,
	.anim-item.anim-ready {
		animation: fadeInUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: calc(500ms + var(--i, 0) * 110ms);
	}

	.layout {
		display: flex;
		height: calc(100dvh - 88px * 2);
	}

	.panel-left {
		position: relative;
		flex: 0 0 60%;

		@media (max-width: 860px) {
			display: none;
		}
	}

	.grainient-wrap {
		position: absolute;
		inset: 0;
		border-radius: $radius;
		overflow: hidden;

		.panel-title {
			position: absolute;
			bottom: 30px;
			left: 30px;
			color: var(--color-bg);

			h1 {
				font-weight: 900;
				font-size: clamp(40px, 3.5vw, 125px);
				opacity: 0.95;
			}
		}
	}

	.bookmark {
		position: absolute;
		top: -15px;
		left: 10%;
		width: 300px;
		background: #fff;
		color: var(--color-text);
		border-radius: 0 0 12px 12px;
		padding: 24px;
		z-index: 1;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: inherit;
			box-shadow: -14px 24px 38px rgba(0, 0, 0, 0.35);
			z-index: -1;
		}
	}

	.eyebrow {
		display: block;
		font-size: 0.6rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		opacity: 0.4;
	}

	.tagline {
		font-size: 0.72rem;
		opacity: 0.5;
		line-height: 1.5;
		margin: 0 0 16px;
	}

	.info {
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		padding-top: 14px;
		margin: 0 0 14px;
		display: flex;
		flex-direction: column;
		gap: 7px;

		> div {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			gap: 8px;
		}

		dt {
			font-size: 0.6rem;
			text-transform: uppercase;
			letter-spacing: 0.1em;
			opacity: 0.35;
			white-space: nowrap;
			flex-shrink: 0;
		}

		dd {
			font-size: 0.72rem;
			opacity: 0.75;
			text-align: right;
			margin: 0;
		}
	}

	.links {
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		padding-top: 12px;
		list-style: none;
		margin: 0;
		padding-left: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;

		a {
			font-size: 0.7rem;
			color: var(--color-text);
			opacity: 0.5;
			text-decoration: none;
			transition: opacity $ease;

			&:hover {
				opacity: 1;
			}
			&:focus-visible {
				outline: 2px solid var(--color-text);
				outline-offset: 2px;
				border-radius: 2px;
			}
		}
	}

	.panel-right {
		flex: 1;
		overflow-y: auto;
		display: flex;
		align-items: flex-start;
		padding: 0 44px 0 88px;

		@media (max-width: 1024px) {
			padding: 36px 28px;
		}
		@media (max-width: 860px) {
			padding: 28px 20px;
		}
	}

	.form-wrap {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 38px;
		justify-content: center;
		padding: 32px 0;

		@media (max-width: 860px) {
			gap: 0;
			justify-content: flex-start;
			padding: 0;
		}
	}

	.form-header {
		display: flex;
		flex-direction: column;
		gap: 26px;
		margin-bottom: 28px;

		@media (max-width: 860px) {
			gap: 12px;
			margin-bottom: 20px;
		}

		h2 {
			margin: 0;
			font-weight: 700;
		}

		p {
			margin: 0;
			opacity: 0.5;
			line-height: 1.55;
		}
	}

	.mobile-links {
		display: none;
		list-style: none;
		margin: 0 0 28px;
		padding: 0 0 20px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		flex-wrap: wrap;
		gap: 12px;

		@media (max-width: 860px) {
			display: flex;
		}

		a {
			font-size: 0.78rem;
			color: var(--color-text);
			opacity: 0.5;
			text-decoration: none;
			border-bottom: 1px solid currentColor;
			padding-bottom: 1px;
			transition: opacity $ease;

			&:hover {
				opacity: 1;
			}
		}
	}

	.hp {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;

		@media (max-width: 480px) {
			grid-template-columns: 1fr;
		}
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 20px;

		label {
			font-size: 0.78rem;
			opacity: 0.75;

			abbr {
				text-decoration: none;
				color: $error;
			}
		}

		input,
		select,
		textarea {
			width: 100%;
			box-sizing: border-box;
			padding: 12px 14px;
			border: 1.5px solid rgba(0, 0, 0, 0.15);
			border-radius: 8px;
			background: #fff;
			color: var(--color-text);
			outline: none;
			appearance: none;
			transition:
				border-color $ease,
				box-shadow $ease;

			&::placeholder {
				opacity: 0.35;
			}

			&:focus {
				border-color: var(--color-text);
				box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
			}
		}

		textarea {
			resize: none;
			line-height: 1.6;
		}

		&.err {
			input,
			select,
			textarea {
				border-color: $error;
				box-shadow: 0 0 0 3px rgba($error, 0.08);
			}
		}

		&.shake {
			animation: shake 350ms ease;
		}
	}

	.err-msg {
		font-size: 0.7rem;
		color: $error;
		display: block;
		overflow: hidden;
		max-height: 0;
		opacity: 0;
		transform: translateY(-4px);
		transition:
			max-height 450ms ease-out,
			opacity 350ms ease-out,
			transform 450ms ease-out;

		&.visible {
			max-height: 2rem;
			opacity: 1;
			transform: translateY(0);
		}
	}

	.select-wrap {
		position: relative;

		select {
			padding-right: 36px;
			cursor: pointer;
		}

		> span {
			position: absolute;
			right: 12px;
			top: 50%;
			transform: translateY(-50%);
			pointer-events: none;
			opacity: 0.4;
			font-size: 0.75rem;
		}
	}

	.textarea-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.count {
		font-size: 0.65rem;
		opacity: 0.4;
		flex-shrink: 0;

		&.warn {
			color: #e67e22;
			opacity: 1;
		}
	}

	.consent {
		margin-bottom: 28px;
	}

	.check-label {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		cursor: pointer;
		font-size: 0.75rem;
		opacity: 0.7;
		line-height: 1.5;

		input[type='checkbox'] {
			position: absolute;
			opacity: 0;
			width: 0;
			height: 0;

			&:checked + .box {
				background: var(--color-text);
				border-color: var(--color-text);

				&::after {
					display: block;
				}
			}

			&:focus-visible + .box {
				box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.15);
			}
		}

		.box {
			flex-shrink: 0;
			width: 16px;
			height: 16px;
			border: 1.5px solid rgba(0, 0, 0, 0.25);
			border-radius: 4px;
			background: #fff;
			position: relative;
			margin-top: 1px;
			transition:
				background $ease,
				border-color $ease;

			&::after {
				content: '';
				display: none;
				position: absolute;
				left: 4px;
				top: 1px;
				width: 5px;
				height: 8px;
				border: 1.5px solid #fff;
				border-top: none;
				border-left: none;
				transform: rotate(45deg);
			}
		}
	}

	.btn-submit {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 100%;
		background: var(--color-text);
		color: #fff;
		border: none;
		border-radius: 12px;
		padding: 18px 28px;
		cursor: pointer;
		transition:
			background $ease,
			transform $ease,
			box-shadow $ease;

		&:hover:not(:disabled) {
			box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
			transform: translateY(-1px);
		}

		&:active:not(:disabled) {
			transform: translateY(0);
		}
		&:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}

		&:focus-visible {
			outline: 2px solid var(--color-text);
			outline-offset: 4px;
		}

		&.is-error {
			background: $error;
		}
	}

	.spinner {
		width: 13px;
		height: 13px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 700ms linear infinite;
		flex-shrink: 0;
	}

	.feedback {
		display: flex;
		flex-direction: column;
		gap: 12px;

		.icon {
			width: 44px;
			height: 44px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.1rem;
			font-weight: 700;
		}

		h2 {
			margin: 0;
		}
		p {
			opacity: 0.6;
			margin: 0;
		}

		&.success .icon {
			background: rgba($success, 0.12);
			color: $success;
			border: 1.5px solid rgba($success, 0.3);
		}
	}

	.btn-reset {
		background: none;
		border: 1.5px solid rgba(0, 0, 0, 0.15);
		border-radius: $radius;
		padding: 10px 22px;
		cursor: pointer;
		color: var(--color-text);
		align-self: flex-start;
		transition: border-color $ease;

		&:hover {
			border-color: var(--color-text);
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-5px);
		}
		40% {
			transform: translateX(5px);
		}
		60% {
			transform: translateX(-3px);
		}
		80% {
			transform: translateX(3px);
		}
	}
</style>
