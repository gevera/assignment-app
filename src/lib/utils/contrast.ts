/** Relative luminance of a `#rrggbb` color (sRGB, WCAG). */
export function relativeLuminance(hex: string): number {
	const raw = hex.replace('#', '');
	const channels = [0, 2, 4].map((i) => {
		const c = parseInt(raw.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});
	return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/** Contrast ratio between two `#rrggbb` colors. */
export function contrastRatio(a: string, b: string): number {
	const L1 = relativeLuminance(a);
	const L2 = relativeLuminance(b);
	const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
	return (hi + 0.05) / (lo + 0.05);
}

const LIGHT_INK = '#ffffff';
const DARK_INK = '#000000';

/**
 * Pick white or near-black ink for readable text on `bgHex`.
 * Prefers white when both meet WCAG AA (≥ 4.5:1).
 */
export function contrastingInk(bgHex: string): string {
	const onWhite = contrastRatio(LIGHT_INK, bgHex);
	const onDark = contrastRatio(DARK_INK, bgHex);
	if (onWhite >= 4.5) return LIGHT_INK;
	if (onDark >= 4.5) return DARK_INK;
	return onWhite >= onDark ? LIGHT_INK : DARK_INK;
}
