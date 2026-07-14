import { error, fail } from '@sveltejs/kit';
import { z } from 'zod';
import { itemStatusSchema } from '$lib/schemas';
import { getAllItems, queryItems, updateItem } from '$lib/server';
import { parseItemsQuery } from '$lib/utils/items-query';
import { fieldToPatch } from '$lib/utils/matchers';
import type { Actions, PageServerLoad } from './$types';

const updateFieldSchema = z.discriminatedUnion('field', [
	z.object({
		id: z.string().min(1),
		field: z.literal('name'),
		value: z.string().trim().min(1).max(200)
	}),
	z.object({
		id: z.string().min(1),
		field: z.literal('budget'),
		value: z.coerce.number().finite().nonnegative()
	}),
	z.object({
		id: z.string().min(1),
		field: z.literal('spent'),
		value: z.coerce.number().finite().nonnegative()
	}),
	z.object({
		id: z.string().min(1),
		field: z.literal('status'),
		value: itemStatusSchema
	})
]);

/** Load filtered, sorted, paginated items for the dashboard table. */
export const load: PageServerLoad = ({ depends, locals, url }) => {
	depends('app:items');

	const query = parseItemsQuery(url);
	const canEdit = locals.user?.role === 'editor' || locals.user?.role === 'admin';

	return {
		query,
		canEdit,
		catalogTotal: getAllItems().length,
		result: queryItems(query)
	};
};

/** Form actions for the dashboard items page. */
export const actions: Actions = {
	/** Validate and apply an inline field edit to an item. */
	updateField: async ({ request, locals, url }) => {
		if (!locals.user) {
			error(401, 'Unauthorized');
		}

		if (locals.user.role === 'viewer') {
			return fail(403, { message: 'dashboard.items.editForbidden' });
		}

		const formData = await request.formData();
		const parsed = updateFieldSchema.safeParse({
			id: formData.get('id'),
			field: formData.get('field'),
			value: formData.get('value')
		});

		if (!parsed.success) {
			return fail(400, {
				message: 'dashboard.items.editInvalid',
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const forceFail = url.searchParams.get('fail') === '1' || formData.get('_fail') === '1';

		if (forceFail) {
			return fail(500, { message: 'dashboard.items.editFailed' });
		}

		const { id, ...fieldValue } = parsed.data;
		const patch = fieldToPatch(fieldValue);

		const updated = updateItem(id, patch);
		if (!updated) {
			return fail(404, { message: 'dashboard.items.editNotFound' });
		}

		return { ok: true as const, item: updated };
	}
};
