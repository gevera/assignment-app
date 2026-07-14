import type { ActionResult } from '@sveltejs/kit';
import { match, P } from 'ts-pattern';
import { isSupportedLocale, LOCALE_PATTERN } from '$lib/i18n';
import type { Item, ItemStatus } from '$lib/schemas';
import type { ItemsDir, ItemsSort } from './items-query';

export type UpdateFieldData =
	| { field: 'name'; value: string }
	| { field: 'budget'; value: number }
	| { field: 'spent'; value: number }
	| { field: 'status'; value: ItemStatus };

export type FieldPatch =
	{ name: string } | { budget: number } | { spent: number } | { status: ItemStatus };

export type MenuTriggerCommand = { kind: 'noop' } | { kind: 'open'; index: number };

export type MenuKeyCommand =
	| { kind: 'noop' }
	| { kind: 'close'; restoreFocus: boolean; preventDefault: boolean }
	| { kind: 'focus'; index: number };

export type LocaleSegmentKind =
	{ kind: 'supported'; segment: string } | { kind: 'unsupported-locale' } | { kind: 'missing' };

export type LocaleRouting = {
	lang: string;
	shouldRedirect: boolean;
};

export type NextSortDirectionInput = {
	sort: ItemsSort;
	dir: ItemsDir;
	key: ItemsSort;
};

export type ItemSortValuesInput = {
	a: Item;
	b: Item;
	sort: ItemsSort;
};

export type CompareSortValuesInput = {
	av: string | number;
	bv: string | number;
	direction: 1 | -1;
};

export type ActionResultInput = {
	result: ActionResult;
};

export type ActionFailureMessageInput = ActionResultInput & {
	fallback?: string;
};

export type MenuTriggerCommandInput = {
	key: string;
	lastIndex: number;
};

export type MenuKeyCommandInput = {
	key: string;
	activeIndex: number;
	length: number;
};

export type SearchKeyCommand =
	| { kind: 'noop' }
	| { kind: 'toggle' }
	| { kind: 'focus'; index: number }
	| { kind: 'select'; index: number };

export type SearchEnterTarget = 'input' | 'option' | 'other';

export type SearchTargetInfo = {
	tagName?: string;
	role?: string | null;
};

export type SearchKeyCommandInput = {
	key: string;
	ctrlOrMeta: boolean;
	open: boolean;
	activeIndex: number;
	length: number;
	target: SearchTargetInfo;
};

export type DialogKeyCommand =
	{ kind: 'noop' } | { kind: 'close' } | { kind: 'trap'; focus: 'first' | 'last' };

export type DialogKeyCommandInput = {
	key: string;
	shiftKey: boolean;
	atFirst: boolean;
	atLast: boolean;
};

export type ClassifyLocaleSegmentInput = {
	segment?: string;
	supported: string[];
};

export type ResolveLocaleRoutingInput = {
	kind: LocaleSegmentKind;
	preferred: string;
};

const DEFAULT_ACTION_FAILURE_MESSAGE = 'dashboard.items.editFailed';

/** Classify the first path segment as a supported, unsupported, or missing locale. */
export function classifyLocaleSegment({
	segment,
	supported
}: ClassifyLocaleSegmentInput): LocaleSegmentKind {
	if (!segment) return { kind: 'missing' };

	return match({
		supported: isSupportedLocale({ segment, supported }),
		looksLikeLocale: LOCALE_PATTERN.test(segment)
	})
		.with({ supported: true }, () => ({ kind: 'supported' as const, segment }))
		.with({ looksLikeLocale: true }, () => ({ kind: 'unsupported-locale' as const }))
		.otherwise(() => ({ kind: 'missing' as const }));
}

/** Decide the active locale and whether the request should redirect into it. */
export function resolveLocaleRouting({
	kind,
	preferred
}: ResolveLocaleRoutingInput): LocaleRouting {
	return match(kind)
		.with({ kind: 'supported', segment: P.select() }, (segment) => ({
			lang: segment,
			shouldRedirect: false
		}))
		.with({ kind: 'unsupported-locale' }, () => ({
			lang: preferred,
			shouldRedirect: false
		}))
		.with({ kind: 'missing' }, () => ({
			lang: preferred,
			shouldRedirect: true
		}))
		.exhaustive();
}

/** Convert an update-field form payload into an item patch object. */
export function fieldToPatch(data: UpdateFieldData): FieldPatch {
	return match(data)
		.with({ field: 'name', value: P.select() }, (name) => ({ name }))
		.with({ field: 'budget', value: P.select() }, (budget) => ({ budget }))
		.with({ field: 'spent', value: P.select() }, (spent) => ({ spent }))
		.with({ field: 'status', value: P.select() }, (status) => ({ status }))
		.exhaustive();
}

/** Toggle or pick the next sort direction for a table column header click. */
export function nextSortDirection({ sort, dir, key }: NextSortDirectionInput): ItemsDir {
	return match({ sameColumn: sort === key, key, dir })
		.with({ sameColumn: true, dir: 'asc' }, () => 'desc' as const)
		.with({ sameColumn: true, dir: 'desc' }, () => 'asc' as const)
		.with({ key: P.union('updatedAt', 'budget', 'spent', 'ctr') }, () => 'desc' as const)
		.otherwise(() => 'asc' as const);
}

/** Extract the comparable sort values for two items on the given column. */
export function itemSortValues({
	a,
	b,
	sort
}: ItemSortValuesInput): [string | number, string | number] {
	return match(sort)
		.with('owner', () => [a.owner.name, b.owner.name] as [string, string])
		.otherwise((key) => [a[key], b[key]] as [string | number, string | number]);
}

/** Compare two sort values with the given ascending or descending multiplier. */
export function compareSortValues({ av, bv, direction }: CompareSortValuesInput): number {
	return match([av, bv] as const)
		.with([P.string, P.string], ([left, right]) => left.localeCompare(right) * direction)
		.otherwise(([left, right]) => {
			if (left > right) return direction;
			if (left < right) return -direction;
			return 0;
		});
}

/** Return whether a SvelteKit action result represents success. */
export function isActionSuccess({ result }: ActionResultInput): boolean {
	return match(result)
		.with({ type: 'success' }, () => true)
		.otherwise(() => false);
}

/** Pull a failure message from an action result, or return the fallback key. */
export function actionFailureMessage({
	result,
	fallback = DEFAULT_ACTION_FAILURE_MESSAGE
}: ActionFailureMessageInput): string {
	return match(result)
		.with({ type: 'failure', data: { message: P.select(P.string) } }, (message) => message)
		.otherwise(() => fallback);
}

/** Map a keyboard key on the menu trigger to an open or noop command. */
export function menuTriggerCommand({
	key,
	lastIndex
}: MenuTriggerCommandInput): MenuTriggerCommand {
	return match(key)
		.with(P.union('ArrowDown', 'Enter', ' '), () => ({ kind: 'open' as const, index: 0 }))
		.with('ArrowUp', () => ({ kind: 'open' as const, index: lastIndex }))
		.otherwise(() => ({ kind: 'noop' as const }));
}

/** Map a keyboard key inside an open menu to focus, close, or noop. */
export function menuKeyCommand({ key, activeIndex, length }: MenuKeyCommandInput): MenuKeyCommand {
	return match(key)
		.with('Escape', () => ({
			kind: 'close' as const,
			restoreFocus: true,
			preventDefault: true
		}))
		.with('ArrowDown', () => ({
			kind: 'focus' as const,
			index: (activeIndex + 1) % length
		}))
		.with('ArrowUp', () => ({
			kind: 'focus' as const,
			index: (activeIndex - 1 + length) % length
		}))
		.with('Home', () => ({ kind: 'focus' as const, index: 0 }))
		.with('End', () => ({ kind: 'focus' as const, index: length - 1 }))
		.with('Tab', () => ({
			kind: 'close' as const,
			restoreFocus: false,
			preventDefault: false
		}))
		.otherwise(() => ({ kind: 'noop' as const }));
}

/** Classify the Enter key target as the search input, an option, or other. */
export function classifySearchEnterTarget({ tagName, role }: SearchTargetInfo): SearchEnterTarget {
	return match({ tagName: tagName?.toUpperCase(), role })
		.with({ tagName: 'INPUT' }, () => 'input' as const)
		.with({ tagName: 'BUTTON', role: 'option' }, () => 'option' as const)
		.otherwise(() => 'other' as const);
}

/** Map search dialog keyboard shortcuts to toggle, focus, select, or noop. */
export function searchKeyCommand({
	key,
	ctrlOrMeta,
	open,
	activeIndex,
	length,
	target
}: SearchKeyCommandInput): SearchKeyCommand {
	return match({
		modK: ctrlOrMeta && key.toLowerCase() === 'k',
		open,
		hasPosts: length > 0,
		key,
		enterTarget: classifySearchEnterTarget(target)
	})
		.with({ modK: true }, () => ({ kind: 'toggle' as const }))
		.with({ open: false }, () => ({ kind: 'noop' as const }))
		.with({ hasPosts: false }, () => ({ kind: 'noop' as const }))
		.with({ key: 'ArrowDown' }, () => ({
			kind: 'focus' as const,
			index: (activeIndex + 1) % length
		}))
		.with({ key: 'ArrowUp' }, () => ({
			kind: 'focus' as const,
			index: (activeIndex - 1 + length) % length
		}))
		.with({ key: 'Enter', enterTarget: 'input' }, () => ({
			kind: 'select' as const,
			index: activeIndex
		}))
		.otherwise(() => ({ kind: 'noop' as const }));
}

/** Map dialog keyboard input to close, focus-trap, or noop commands. */
export function dialogKeyCommand({
	key,
	shiftKey,
	atFirst,
	atLast
}: DialogKeyCommandInput): DialogKeyCommand {
	return match({ key, shiftKey, atFirst, atLast })
		.with({ key: 'Escape' }, () => ({ kind: 'close' as const }))
		.with({ key: 'Tab', shiftKey: true, atFirst: true }, () => ({
			kind: 'trap' as const,
			focus: 'last' as const
		}))
		.with({ key: 'Tab', shiftKey: false, atLast: true }, () => ({
			kind: 'trap' as const,
			focus: 'first' as const
		}))
		.otherwise(() => ({ kind: 'noop' as const }));
}
