// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			lang: string;
		}
		interface Error {
			message: string;
			lang?: string;
			translations?: Record<string, Record<string, unknown>>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
