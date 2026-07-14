#!/usr/bin/env node
/**
 * Measure initial-route JS (gzip) from the Vite client manifest.
 *
 * “Initial route JS” = SvelteKit client entry (start + app) plus the layout/page
 * node chain for a route, following static `imports` only (not dynamicImports).
 * That matches what the browser downloads before interaction (SearchDialog stays
 * out of the public budget via dynamic import).
 */

import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const clientRoot = join(root, '.svelte-kit/output/client');
const manifestPath = join(clientRoot, '.vite/manifest.json');
const appPath = join(root, '.svelte-kit/generated/client-optimized/app.js');

const BUDGETS = {
	public: 80 * 1024,
	dashboard: 150 * 1024
};

/** @typedef {{ file: string, imports?: string[], dynamicImports?: string[], css?: string[] }} ManifestChunk */

function fail(message) {
	console.error(`budget: ${message}`);
	process.exit(1);
}

function loadJson(path) {
	if (!existsSync(path)) fail(`missing ${path} — run \`pnpm build\` first`);
	return JSON.parse(readFileSync(path, 'utf8'));
}

/** @returns {Record<string, number[]>} */
function parseRouteNodes(appSrc) {
	const dictMatch = appSrc.match(/export const dictionary = \{([\s\S]*?)\n\t\};/);
	if (!dictMatch) fail('could not parse route dictionary from client-optimized/app.js');

	/** @type {Record<string, number[]>} */
	const routes = {};
	const entryRe = /"([^"]+)":\s*\[~?(\d+),\s*\[([^\]]*)\](?:,\s*\[[^\]]*\])?\]/g;
	let m;
	while ((m = entryRe.exec(dictMatch[1])) !== null) {
		const route = m[1];
		const page = Number(m[2]);
		const layouts = m[3]
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
			.map(Number);
		routes[route] = [0, ...layouts, page];
	}
	return routes;
}

/**
 * @param {Record<string, ManifestChunk>} manifest
 * @param {string} key
 * @param {Set<string>} files
 */
function collectJs(manifest, key, files) {
	const chunk = manifest[key];
	if (!chunk) fail(`manifest missing key: ${key}`);
	if (chunk.file.endsWith('.js')) files.add(chunk.file);
	for (const dep of chunk.imports ?? []) {
		collectJs(manifest, dep, files);
	}
}

/**
 * @param {Record<string, ManifestChunk>} manifest
 * @param {number[]} nodeIds
 */
function filesForNodes(manifest, nodeIds) {
	/** @type {Set<string>} */
	const files = new Set();

	const entryKeys = Object.keys(manifest).filter(
		(k) =>
			k.includes('/runtime/client/entry.js') ||
			k.endsWith('/client-optimized/app.js') ||
			k.endsWith('/generated/client/app.js')
	);
	if (entryKeys.length < 2) fail('could not find SvelteKit entry chunks in manifest');
	for (const key of entryKeys) collectJs(manifest, key, files);

	for (const id of nodeIds) {
		const key = `.svelte-kit/generated/client-optimized/nodes/${id}.js`;
		if (!manifest[key]) fail(`missing node ${id} in manifest (${key})`);
		collectJs(manifest, key, files);
	}

	return files;
}

/**
 * @param {Set<string>} files
 */
function gzipTotal(files) {
	let total = 0;
	/** @type {{ file: string, gzip: number }[]} */
	const rows = [];
	for (const file of [...files].sort()) {
		const abs = join(clientRoot, file);
		if (!existsSync(abs)) fail(`missing built file ${file}`);
		const gz = gzipSync(readFileSync(abs)).byteLength;
		total += gz;
		rows.push({ file, gzip: gz });
	}
	return { total, rows };
}

function fmtKb(bytes) {
	return `${(bytes / 1024).toFixed(1)} KB`;
}

const manifest = /** @type {Record<string, ManifestChunk>} */ (loadJson(manifestPath));
const routes = parseRouteNodes(readFileSync(appPath, 'utf8'));

const publicRoute = '/[lang=lang]/(public)';
const dashboardRoute = '/[lang=lang]/(authenticated)/dashboard/items';

if (!routes[publicRoute]) fail(`route not found: ${publicRoute}`);
if (!routes[dashboardRoute]) fail(`route not found: ${dashboardRoute}`);

const groups = [
	{ name: 'public', nodes: routes[publicRoute], budget: BUDGETS.public },
	{ name: 'dashboard', nodes: routes[dashboardRoute], budget: BUDGETS.dashboard }
];

let failed = false;

console.log('Initial route JS (gzip), static imports only\n');
console.log(
	`${'group'.padEnd(12)} ${'nodes'.padEnd(18)} ${'size'.padStart(10)} ${'budget'.padStart(10)}  status`
);
console.log('-'.repeat(60));

for (const group of groups) {
	const files = filesForNodes(manifest, group.nodes);
	const { total } = gzipTotal(files);
	const ok = total <= group.budget;
	if (!ok) failed = true;
	console.log(
		`${group.name.padEnd(12)} ${group.nodes.join(',').padEnd(18)} ${fmtKb(total).padStart(10)} ${fmtKb(group.budget).padStart(10)}  ${ok ? 'OK' : 'FAIL'}`
	);
}

console.log('');
if (failed) {
	console.error('budget: one or more groups exceeded their limit');
	process.exit(1);
}
console.log('budget: all groups within limits');
