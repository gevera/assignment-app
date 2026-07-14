import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Assert the page has no serious or critical axe-core violations. */
export async function expectNoSeriousAxeViolations(page: Page) {
	const results = await new AxeBuilder({ page }).analyze();
	const blocking = results.violations.filter(
		(v) => v.impact === 'serious' || v.impact === 'critical'
	);
	expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}
