import type { SessionUser } from '$lib/schemas';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			lang: string;
			user: SessionUser | null;
		}
		interface Error {
			message: string;
			lang?: string;
			translations?: Record<string, Record<string, unknown>>;
		}
		// interface PageData {}
		interface PageState {
			searchOpen?: boolean;
			/** Locale-less path to restore for language switching while search is open. */
			searchReturnPath?: string;
		}
		// interface Platform {}
	}
}

export {};
