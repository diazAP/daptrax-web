<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { getAccounts } from "$lib/api/accounts";
  import { formatIDR } from "$lib/utils/currency";

  const accountsQuery = createQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
</script>

<div class="min-h-screen bg-slate-50 p-6">
  <h1 class="text-2xl font-bold text-slate-900">Accounts</h1>

  {#if $accountsQuery.isLoading}
    <div class="mt-6 text-slate-500">Loading...</div>
  {:else if $accountsQuery.isError}
    <div class="mt-6 rounded-lg bg-red-50 text-red-700 px-4 py-3">
      Gagal memuat accounts
    </div>
  {:else}
    <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {#each $accountsQuery.data ?? [] as account}
        <div class="rounded-2xl bg-white p-5 shadow">
          <div class="text-lg font-semibold text-slate-900">{account.name}</div>
          <div class="mt-4 text-sm text-slate-500">Current Balance</div>
          <div class="mt-1 text-2xl font-bold text-blue-600">
            {formatIDR(account.current_balance)}
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div class="text-slate-500">Initial</div>
              <div class="font-medium">
                {formatIDR(account.initial_balance)}
              </div>
            </div>
            <div>
              <div class="text-slate-500">Income</div>
              <div class="font-medium">{formatIDR(account.total_income)}</div>
            </div>
            <div>
              <div class="text-slate-500">Expense</div>
              <div class="font-medium">{formatIDR(account.total_expense)}</div>
            </div>
            <div>
              <div class="text-slate-500">Transfer In</div>
              <div class="font-medium">
                {formatIDR(account.total_transfer_in)}
              </div>
            </div>
            <div>
              <div class="text-slate-500">Transfer Out</div>
              <div class="font-medium">
                {formatIDR(account.total_transfer_out)}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
