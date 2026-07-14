import type { Config } from '@sveltejs/adapter-vercel';
import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '$lib/schemas';
import {
	authenticateUser,
	clearSessionCookie,
	createSessionToken,
	safeRedirectPath,
	setSessionCookie
} from '$lib/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

export const config: Config = {
	runtime: 'nodejs24.x',
	split: true
};

/** Redirect signed-in users away from the login page. */
export const load: PageServerLoad = async ({ locals, params, url }) => {
	if (locals.user) {
		const { lang } = params;
		const target = safeRedirectPath({
			redirectTo: url.searchParams.get('redirect'),
			lang
		});
		redirect(303, target);
	}

	return {};
};

/** Login and logout form actions. */
export const actions: Actions = {
	/** Authenticate credentials, set the session cookie, and redirect. */
	login: async ({ request, cookies, params, url }) => {
		const formData = await request.formData();
		const values = {
			email: String(formData.get('email') ?? ''),
			password: String(formData.get('password') ?? '')
		};

		const parsed = loginSchema.safeParse(values);
		if (!parsed.success) {
			const { email: emailError, password: passwordError } = z.flattenError(
				parsed.error
			).fieldErrors;
			const { email } = values;
			return fail(400, {
				values: { email },
				errors: {
					email: emailError?.[0],
					password: passwordError?.[0]
				}
			});
		}

		const { email, password } = parsed.data;
		const user = authenticateUser({ email, password });
		if (!user) {
			return fail(400, {
				values: { email },
				message: 'login.error'
			});
		}

		const token = await createSessionToken(user);
		setSessionCookie({ cookies, token });

		const { lang } = params;
		const redirectTo = safeRedirectPath({
			redirectTo: String(formData.get('redirect') || url.searchParams.get('redirect') || ''),
			lang
		});
		redirect(303, redirectTo);
	},

	/** Clear the session cookie and send the user back to login. */
	logout: async ({ cookies, params }) => {
		clearSessionCookie(cookies);
		const { lang } = params;
		redirect(303, `/${lang}/login`);
	}
};
