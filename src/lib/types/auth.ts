export type CurrentUser = {
	id: string;
	email: string | null;
	username: string | null;
	full_name: string;
	role: 'admin' | 'user';
	auth_provider: 'local' | 'google';
	is_active: boolean;
	last_login_at: string | null;
};