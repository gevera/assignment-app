import { defineConfig } from '@playwright/test';

const port = 4173;

export default defineConfig({
	use: {
		viewport: { width: 1280, height: 720 },
		colorScheme: 'light'
	},
	expect: {
		toHaveScreenshot: { maxDiffPixelRatio: 0.01 }
	},
	webServer: {
		command: process.env.CI
			? 'pnpm preview --host 127.0.0.1 --port 4173'
			: 'pnpm build && pnpm preview --host 127.0.0.1 --port 4173',
		port,
		reuseExistingServer: !process.env.CI,
		env: {
			AUTH_SECRET: process.env.AUTH_SECRET || 'dev-only-change-me-to-a-long-random-string',
			PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || `http://127.0.0.1:${port}`
		}
	},
	testMatch: '**/*.e2e.{ts,js}'
});
