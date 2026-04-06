import { PUBLIC_API_BASE_URL } from '$env/static/public';

type ApiErrorPayload = {
	detail?: string;
	message?: string;
};

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {}
): Promise<T> {
	const response = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {})
		}
	});

	if (!response.ok) {
		let payload: ApiErrorPayload | null = null;

		try {
			payload = await response.json();
		} catch {
			payload = null;
		}

		throw new Error(
			payload?.detail || payload?.message || `Request failed: ${response.status}`
		);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}