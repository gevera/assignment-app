/**
 * LHCI puppeteer setup
 *
 * @param {import('puppeteer').Browser} browser
 * @param {{ url: string }} context
 */
module.exports = async function (browser, { url }) {
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(90_000);
	const isDashboard = /\/dashboard(\/|$)/.test(url);

	if (isDashboard) {
		const secret = process.env.AUTH_SECRET || 'dev-only-change-me-to-a-long-random-string';
		const { SignJWT } = await import('jose');
		const token = await new SignJWT({
			email: 'editor@demo.test',
			name: 'Demo Editor',
			role: 'editor'
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setSubject('demo_editor')
			.setIssuedAt()
			.setExpirationTime('7d')
			.sign(new TextEncoder().encode(secret));

		const { hostname } = new URL(url);
		await page.setCookie({
			name: 'session',
			value: token,
			domain: hostname,
			path: '/',
			httpOnly: true,
			sameSite: 'Lax'
		});
	}

	await page.goto(url, { waitUntil: 'networkidle0' });

	if (isDashboard && page.url().includes('/login')) {
		throw new Error(`Dashboard auth failed, redirected to ${page.url()}`);
	}
};
