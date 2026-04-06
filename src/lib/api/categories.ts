import { apiFetch } from './client';
import type { Category } from '$lib/types/category';

export function getCategories() {
	return apiFetch<Category[]>('/categories');
}

export function createCategory(payload: {
	name: string;
	color_key?: string | null;
	icon_key?: string | null;
	sort_order?: number;
}) {
	return apiFetch<Category>('/categories', {
		method: 'POST',
		body: JSON.stringify(payload)
	});
}

export function updateCategory(
	id: string,
	payload: {
		name: string;
		color_key?: string | null;
		icon_key?: string | null;
		sort_order?: number;
	}
) {
	return apiFetch<Category>(`/categories/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload)
	});
}

export function deleteCategory(id: string) {
	return apiFetch<{ message: string }>(`/categories/${id}`, {
		method: 'DELETE'
	});
}