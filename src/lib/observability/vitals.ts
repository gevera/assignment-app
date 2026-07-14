import { onCLS, onINP, onLCP, onTTFB, type MetricType } from 'web-vitals';
import type { WebVitalMetric } from '$lib/schemas';
import { sendToBeacon } from './beacon-client';
import { getSessionId } from './session';

const queue: WebVitalMetric[] = [];

type CoreMetric = Extract<MetricType, { name: WebVitalMetric['name'] }>;

function enqueue({ name, id, value, delta, rating, navigationType }: CoreMetric): void {
	queue.push({ name, id, value, delta, rating, navigationType });
}

function flush(): void {
	if (queue.length === 0) return;

	sendToBeacon({
		type: 'web-vitals',
		sessionId: getSessionId(),
		page: location.pathname,
		ts: Date.now(),
		metrics: queue.splice(0)
	});
}

/**
 * Collect core web vitals into a batch and flush once per page hide —
 * LCP/CLS/INP only settle when the page is backgrounded, so that is the
 * earliest honest moment to report them.
 */
export function initWebVitals(): void {
	onLCP(enqueue);
	onINP(enqueue);
	onCLS(enqueue);
	onTTFB(enqueue);

	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') flush();
	});
	// Safari can skip visibilitychange on unload; pagehide covers it.
	addEventListener('pagehide', flush);
}
