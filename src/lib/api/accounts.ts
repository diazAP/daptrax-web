import { apiFetch } from './client';
import type { Account } from '$lib/types/account';

export function getAccounts() {
	return apiFetch<Account[]>('/accounts');
}