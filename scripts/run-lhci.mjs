#!/usr/bin/env node
/**
 * Stable LHCI runner: owns the preview lifecycle so Chrome doesn't race a
 * mid-collect server crash from `startServerCommand`.
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const viteBin = join(root, 'node_modules', '.bin', 'vite');

const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-only-change-me-to-a-long-random-string';
const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL || BASE;
const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/google-chrome';

async function waitForServer(url, attempts = 60) {
	for (let i = 0; i < attempts; i++) {
		try {
			const res = await fetch(url);
			if (res.ok || res.status === 307 || res.status === 303) return;
		} catch {
			// retry
		}
		await sleep(500);
	}
	throw new Error(`Server not ready at ${url}`);
}

function run(cmd, args, env = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, args, {
			stdio: 'inherit',
			env: { ...process.env, ...env },
			shell: false,
			cwd: root
		});
		child.on('exit', (code) => {
			if (code === 0) resolve();
			else reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`));
		});
	});
}

const preview = spawn(viteBin, ['preview', '--host', '127.0.0.1', '--port', String(PORT)], {
	stdio: ['ignore', 'pipe', 'pipe'],
	env: {
		...process.env,
		AUTH_SECRET,
		PUBLIC_SITE_URL,
		CHROME_PATH
	},
	cwd: root,
	detached: true
});

preview.stdout.on('data', (d) => process.stdout.write(d));
preview.stderr.on('data', (d) => process.stderr.write(d));

let failed = false;
try {
	await waitForServer(`${BASE}/en`);
	await run('pnpm', ['exec', 'lhci', 'autorun', '--config=./lighthouserc.cjs'], {
		CHROME_PATH,
		AUTH_SECRET,
		PUBLIC_SITE_URL
	});
} catch (err) {
	console.error(err);
	failed = true;
} finally {
	if (preview.pid) {
		try {
			process.kill(-preview.pid, 'SIGTERM');
		} catch {
			try {
				preview.kill('SIGTERM');
			} catch {
				// already gone
			}
		}
	}
	await sleep(400);
}

process.exit(failed ? 1 : 0);
