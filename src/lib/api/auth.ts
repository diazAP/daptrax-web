import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { apiFetch } from './client';
import type { CurrentUser } from '$lib/types/auth';

export async function loginAdmin(payload: {
	login: string;
	password: string;
}) {
	return apiFetch<CurrentUser>('/auth/admin/login', {
		method: 'POST',
		body: JSON.stringify(payload)
	});
}

export async function getMe() {
	return apiFetch<CurrentUser>('/auth/me');
}

export async function logout() {
	return apiFetch<{ message: string }>('/auth/logout', {
		method: 'POST'
	});
}

export function startGoogleLogin() {
	window.location.href = `${PUBLIC_BACKEND_BASE_URL}/api/v1/auth/google/login`;
}