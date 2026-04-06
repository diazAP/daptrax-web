export function formatIDR(value: string | number) {
	const num = typeof value === 'string' ? Number(value) : value;

	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0
	}).format(num || 0);
}