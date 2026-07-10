<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { loginSchema } from '$lib/schemas';
	import { t } from '$lib/i18n';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let clientErrors = $state<{ email?: string; password?: string }>({});

	const redirectTo = $derived(page.url.searchParams.get('redirect') ?? '');
	const emailValue = $derived(form?.values?.email ?? '');
	const emailError = $derived(clientErrors.email ?? form?.errors?.email);
	const passwordError = $derived(clientErrors.password ?? form?.errors?.password);
	const formMessage = $derived(form?.message);
</script>

<h1>{$t('i18n.login.title')}</h1>

<form
	method="POST"
	action="?/login"
	use:enhance={({ formData, cancel }) => {
		const result = loginSchema.safeParse({
			email: String(formData.get('email') ?? ''),
			password: String(formData.get('password') ?? '')
		});

		if (!result.success) {
			const { email, password } = result.error.flatten().fieldErrors;
			clientErrors = { email: email?.[0], password: password?.[0] };
			cancel();
			return;
		}

		clientErrors = {};
		return async ({ update }) => {
			await update();
		};
	}}
>
	{#if redirectTo}
		<input type="hidden" name="redirect" value={redirectTo} />
	{/if}

	{#if formMessage}
		<p role="alert">{$t(`i18n.${formMessage}`)}</p>
	{/if}

	<label>
		{$t('i18n.login.email')}
		<input
			type="email"
			name="email"
			autocomplete="email"
			required
			value={emailValue}
			aria-invalid={emailError ? true : undefined}
		/>
		{#if emailError}
			<span role="alert">{emailError}</span>
		{/if}
	</label>

	<label>
		{$t('i18n.login.password')}
		<input
			type="password"
			name="password"
			autocomplete="current-password"
			required
			aria-invalid={passwordError ? true : undefined}
		/>
		{#if passwordError}
			<span role="alert">{passwordError}</span>
		{/if}
	</label>

	<button type="submit">{$t('i18n.login.submit')}</button>
</form>
