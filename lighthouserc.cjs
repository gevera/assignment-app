/** @type {import('@lhci/cli').Config} */
module.exports = {
	ci: {
		collect: {
			// Server is started by `scripts/run-lhci.mjs` (more stable than LHCI-managed preview).
			url: [
				'http://127.0.0.1:4173/en',
				'http://127.0.0.1:4173/en/blog/sub-second-lcp-on-a-content-site',
				'http://127.0.0.1:4173/en/dashboard/items'
			],
			numberOfRuns: 3,
			puppeteerScript: './lighthouserc-puppeteer.cjs',
			puppeteerLaunchOptions: {
				args: ['--no-sandbox', '--disable-dev-shm-usage']
			},
			settings: {
				disableStorageReset: true,
				formFactor: 'mobile',
				throttlingMethod: 'simulate',
				throttling: {
					rttMs: 150,
					throughputKbps: 1638.4,
					cpuSlowdownMultiplier: 4,
					requestLatencyMs: 150,
					downloadThroughputKbps: 1638.4,
					uploadThroughputKbps: 675
				},
				screenEmulation: {
					mobile: true,
					width: 412,
					height: 823,
					deviceScaleFactor: 1.75,
					disabled: false
				},
				emulatedUserAgent:
					'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
			}
		},
		assert: {
			assertions: {
				'categories:performance': ['error', { minScore: 0.95 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:seo': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.95 }],
				'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
				'total-blocking-time': ['error', { maxNumericValue: 200 }],
				'interaction-to-next-paint': 'off'
			}
		},
		upload: {
			target: 'temporary-public-storage'
		}
	}
};
