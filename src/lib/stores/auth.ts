import { writable } from 'svelte/store';
import type { CurrentUser } from '$lib/types/auth';

type AuthState = {
	user: CurrentUser | null;
	isLoading: boolean;
};

function createAuthStore() {
	const { subscribe, set } = writable<AuthState>({
		user: null,
		isLoading: true
	});

	return {
		subscribe,
		setUser: (user: CurrentUser | null) => set({ user, isLoading: false }),
		clear: () => set({ user: null, isLoading: false }),
		setLoading: () => set({ user: null, isLoading: true })
	};
}

export const authStore = createAuthStore();