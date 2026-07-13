<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Meta from '$lib/components/Meta.svelte';
	import { Button, Field, Heading, Input, PasswordInput } from '$ui';
	import { loginSchema } from '$lib/schemas';
	import { t } from '$lib/i18n';
	import { slide } from 'svelte/transition';
	import { z } from 'zod';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let clientErrors = $state<{ email?: string; password?: string }>({});
	let submitting = $state(false);
	let hideServerFeedback = $state(false);

	const redirectTo = $derived(page.url.searchParams.get('redirect') ?? '');
	const emailValue = $derived(form?.values?.email ?? '');
	const errors = $derived.by(() => {
		const fromServer = hideServerFeedback ? undefined : form?.errors;
		return {
			email: clientErrors.email ?? fromServer?.email,
			password: clientErrors.password ?? fromServer?.password,
			message: hideServerFeedback ? undefined : form?.message
		};
	});

	function clearErrors() {
		hideServerFeedback = true;
		clientErrors = {};
	}
</script>

<Meta title={$t('i18n.login.title')} description={$t('i18n.login.meta.description')} noindex />

<div class="flex min-h-0 w-full flex-1 flex-col">
	<div class="min-h-0 flex-1" aria-hidden="true"></div>
	<div class="mx-auto w-full max-w-sm shrink-0">
		<Heading class="text-center">{$t('i18n.login.title')}</Heading>

		<form
			method="POST"
			action="?/login"
			class="relative mt-8 flex flex-col gap-5"
			oninput={clearErrors}
			use:enhance={({ formData, cancel }) => {
				const result = loginSchema.safeParse({
					email: String(formData.get('email') ?? ''),
					password: String(formData.get('password') ?? '')
				});

				if (!result.success) {
					const { email, password } = z.flattenError(result.error).fieldErrors;
					clientErrors = { email: email?.[0], password: password?.[0] };
					hideServerFeedback = true;
					submitting = false;
					cancel();
					return;
				}

				clientErrors = {};
				submitting = true;

				return async ({ update }) => {
					try {
						await update();
					} finally {
						hideServerFeedback = false;
						submitting = false;
					}
				};
			}}
		>
			{#if redirectTo}
				<input type="hidden" name="redirect" value={redirectTo} />
			{/if}

			<Field label={$t('i18n.login.email')} error={errors.email}>
				{#snippet children({ id, describedby, invalid })}
					<Input
						{id}
						type="email"
						name="email"
						autocomplete="email"
						required
						value={emailValue}
						aria-invalid={invalid}
						aria-describedby={describedby}
					/>
				{/snippet}
			</Field>

			<Field label={$t('i18n.login.password')} error={errors.password}>
				{#snippet children({ id, describedby, invalid })}
					<PasswordInput
						{id}
						name="password"
						autocomplete="current-password"
						required
						aria-invalid={invalid}
						aria-describedby={describedby}
					/>
				{/snippet}
			</Field>

			<Button type="submit" class="w-full" disabled={submitting}>
				{$t('i18n.login.submit')}
			</Button>

			<div class="absolute inset-x-0 top-full pt-8">
				{#if errors.message}
					<p class="text-center text-sm text-danger" role="alert" transition:slide>
						{$t(`i18n.${errors.message}`)}
					</p>
				{/if}
			</div>
		</form>
	</div>
	<div class="min-h-0 flex-4" aria-hidden="true"></div>
</div>
