export type Account = {
	id: string;
	name: string;
	initial_balance: string;
	total_income: string;
	total_expense: string;
	total_transfer_in: string;
	total_transfer_out: string;
	current_balance: string;
	color_key: string | null;
	icon_key: string | null;
	sort_order: number;
};