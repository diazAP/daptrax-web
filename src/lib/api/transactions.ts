import { apiFetch } from './client';
import type { Transaction } from '$lib/types/transaction';

export function getTransactions(params?: URLSearchParams) {
	const query = params ? `?${params.toString()}` : '';
	return apiFetch<Transaction[]>(`/transactions${query}`);
}

export function getTransaction(id: string) {
	return apiFetch<Transaction>(`/transactions/${id}`);
}

export function createTransaction(payload: {
	transaction_type: 'income' | 'expense';
	transaction_date: string;
	amount: number | string;
	category_id: string;
	account_id: string;
	note?: string | null;
}) {
	return apiFetch<Transaction>('/transactions', {
		method: 'POST',
		body: JSON.stringify(payload)
	});
}

export function updateTransaction(
	id: string,
	payload: {
		transaction_type: 'income' | 'expense';
		transaction_date: string;
		amount: number | string;
		category_id: string;
		account_id: string;
		note?: string | null;
	}
) {
	return apiFetch<Transaction>(`/transactions/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload)
	});
}

export function deleteTransaction(id: string) {
	return apiFetch<{ message: string }>(`/transactions/${id}`, {
		method: 'DELETE'
	});
}