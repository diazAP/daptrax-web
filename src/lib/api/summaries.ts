import { apiFetch } from './client';

export function getMonthlySummary(year: number, month: number) {
	return apiFetch<any>(`/summaries/monthly?year=${year}&month=${month}`);
}

export function getAccountBalanceSummary(asOfDate: string) {
	return apiFetch<any>(`/summaries/account-balances?as_of_date=${asOfDate}`);
}