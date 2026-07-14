/**
 * LHCI puppeteer setup — mint a session cookie for the dashboard URL.
 * Avoid networkidle0 navigations here; Lighthouse owns measurement navigations.
 *
 * @param {import('puppeteer').Browser} browser
 * @param {{ url: string }} context
 */
module.exports = async function (browser, { url }) {
	const isDashboard = /\/dashboard(\/|$)/.test(url);
	if (!isDashboard) return;

	const secret = process.env.AUTH_SECRET || 'dev-only-change-me-to-a-long-random-string';
	const { SignJWT } = await import('jose');
	const token = await new SignJWT({
		email: 'viewer@demo.test',
		name: 'Demo Viewer',
		role: 'viewer'
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject('demo_viewer')
		.setIssuedAt()
		.setExpirationTime('7d')
		.sign(new TextEncoder().encode(secret));

	const page = await browser.newPage();
	await page.setCookie({
		name: 'session',
		value: token,
		url,
		path: '/',
		httpOnly: true,
		sameSite: 'Lax'
	});
	await page.close();
};
