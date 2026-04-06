<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    getMonthlySummary,
    getAccountBalanceSummary,
  } from "$lib/api/summaries";
  import { authStore } from "$lib/stores/auth";
  import { formatIDR } from "$lib/utils/currency";

  let summary: any = null;
  let balances: any = null;
  let error = "";

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const isoDate = today.toISOString().slice(0, 10);

  onMount(async () => {
    let currentUser: any = null;

    const unsubscribe = authStore.subscribe((state) => {
      currentUser = state.user;
    });

    if (!currentUser) {
      try {
        currentUser = await Promise.resolve(currentUser);
      } catch {
        // noop
      }
    }

    if (!currentUser) {
      await goto("/login");
      unsubscribe();
      return;
    }

    try {
      summary = await getMonthlySummary(year, month);
      balances = await getAccountBalanceSummary(isoDate);
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal memuat dashboard";
    }

    unsubscribe();
  });
</script>

<div class="min-h-screen bg-slate-50 p-6">
  <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>

  {#if error}
    <div class="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-3">{error}</div>
  {/if}

  {#if summary}
    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl bg-white p-5 shadow">
        <div class="text-sm text-slate-500">Income Bulan Ini</div>
        <div class="mt-2 text-2xl font-bold text-slate-900">
          {formatIDR(summary.income_total)}
        </div>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow">
        <div class="text-sm text-slate-500">Expense Bulan Ini</div>
        <div class="mt-2 text-2xl font-bold text-slate-900">
          {formatIDR(summary.expense_total)}
        </div>
      </div>
      <div class="rounded-2xl bg-white p-5 shadow">
        <div class="text-sm text-slate-500">Net Bulan Ini</div>
        <div class="mt-2 text-2xl font-bold text-slate-900">
          {formatIDR(summary.net_total)}
        </div>
      </div>
    </div>
  {/if}

  {#if balances}
    <div class="mt-6 rounded-2xl bg-white p-5 shadow">
      <div class="text-sm text-slate-500">Total Current Balance</div>
      <div class="mt-2 text-3xl font-bold text-blue-600">
        {formatIDR(balances.total_current_balance)}
      </div>
    </div>
  {/if}
</div>
