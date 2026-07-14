/** Format a number as USD currency for the given locale. */
export function formatCurrency(value: number, locale = 'en-US'): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(value);
}

/** Format a fraction as a localized percentage string. */
export function formatPercent(value: number, locale = 'en-US'): string {
	return new Intl.NumberFormat(locale, {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value);
}

/** Format a date or ISO string as a short localized calendar date. */
export function formatDate(value: string | Date, locale = 'en-GB'): string {
	const date = typeof value === 'string' ? new Date(value) : value;
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	}).format(date);
}
