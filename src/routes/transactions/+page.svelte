<script lang="ts">
  import { onMount } from "svelte";
  import { getCategories } from "$lib/api/categories";
  import { getAccounts } from "$lib/api/accounts";
  import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } from "$lib/api/transactions";
  import type { Category } from "$lib/types/category";
  import type { Account } from "$lib/types/account";
  import type { Transaction } from "$lib/types/transaction";
  import { formatIDR } from "$lib/utils/currency";

  let categories: Category[] = [];
  let accounts: Account[] = [];
  let transactions: Transaction[] = [];

  let loading = true;
  let submitting = false;
  let error = "";
  let editingId: string | null = null;

  const today = new Date().toISOString().slice(0, 10);

  let filterType = "";

  let form = {
    transaction_type: "expense" as "income" | "expense",
    transaction_date: today,
    amount: "",
    category_id: "",
    account_id: "",
    note: "",
  };

  async function loadLookups() {
    const [categoryData, accountData] = await Promise.all([
      getCategories(),
      getAccounts(),
    ]);

    categories = categoryData;
    accounts = accountData;

    if (!form.category_id && categories.length > 0) {
      form.category_id = categories[0].id;
    }

    if (!form.account_id && accounts.length > 0) {
      form.account_id = accounts[0].id;
    }
  }

  async function loadTransactions() {
    loading = true;
    error = "";

    try {
      const params = new URLSearchParams();

      if (filterType) {
        params.set("transaction_type", filterType);
      }

      transactions = await getTransactions(params);
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal memuat transactions";
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    editingId = null;
    form = {
      transaction_type: "expense",
      transaction_date: today,
      amount: "",
      category_id: categories[0]?.id ?? "",
      account_id: accounts[0]?.id ?? "",
      note: "",
    };
  }

  function startEdit(transaction: Transaction) {
    editingId = transaction.id;
    form = {
      transaction_type: transaction.transaction_type,
      transaction_date: transaction.transaction_date,
      amount: transaction.amount,
      category_id: transaction.category_id,
      account_id: transaction.account_id,
      note: transaction.note ?? "",
    };
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getCategoryName(categoryId: string) {
    return categories.find((item) => item.id === categoryId)?.name ?? "-";
  }

  function getAccountName(accountId: string) {
    return accounts.find((item) => item.id === accountId)?.name ?? "-";
  }

  async function handleSubmit() {
    submitting = true;
    error = "";

    try {
      if (!form.category_id) {
        throw new Error("Category wajib dipilih");
      }

      if (!form.account_id) {
        throw new Error("Account wajib dipilih");
      }

      const amountNumber = Number(form.amount);

      if (!amountNumber || amountNumber <= 0) {
        throw new Error("Amount harus lebih besar dari 0");
      }

      const payload = {
        transaction_type: form.transaction_type,
        transaction_date: form.transaction_date,
        amount: amountNumber,
        category_id: form.category_id,
        account_id: form.account_id,
        note: form.note.trim() || null,
      };

      if (editingId) {
        await updateTransaction(editingId, payload);
      } else {
        await createTransaction(payload);
      }

      resetForm();
      await loadTransactions();
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal menyimpan transaction";
    } finally {
      submitting = false;
    }
  }

  async function handleDelete(transaction: Transaction) {
    const ok = window.confirm("Hapus transaksi ini?");

    if (!ok) return;

    try {
      await deleteTransaction(transaction.id);
      await loadTransactions();
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal menghapus transaction";
    }
  }

  async function initPage() {
    loading = true;
    error = "";

    try {
      await loadLookups();
      await loadTransactions();
    } catch (e) {
      error =
        e instanceof Error ? e.message : "Gagal memuat halaman transactions";
      loading = false;
    }
  }

  onMount(initPage);
</script>

<div class="min-h-screen bg-slate-50 p-6">
  <div class="mx-auto max-w-7xl">
    <h1 class="text-2xl font-bold text-slate-900">Transactions</h1>
    <p class="mt-1 text-sm text-slate-500">
      Catat pemasukan dan pengeluaran harian.
    </p>

    <div class="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 class="text-lg font-semibold text-slate-900">
        {editingId ? "Edit Transaction" : "Tambah Transaction"}
      </h2>

      {#if categories.length === 0 || accounts.length === 0}
        <div
          class="mt-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800"
        >
          Sebelum membuat transaksi, pastikan category dan account sudah
          tersedia.
        </div>
      {:else}
        <form
          class="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          on:submit|preventDefault={handleSubmit}
        >
          <div>
            <label class="block text-sm font-medium text-slate-700"
              >Jenis Transaksi</label
            >
            <select
              bind:value={form.transaction_type}
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700"
              >Tanggal</label
            >
            <input
              bind:value={form.transaction_date}
              type="date"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700"
              >Amount</label
            >
            <input
              bind:value={form.amount}
              type="number"
              min="1"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="25000"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700"
              >Category</label
            >
            <select
              bind:value={form.category_id}
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {#each categories as category}
                <option value={category.id}>{category.name}</option>
              {/each}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700"
              >Account</label
            >
            <select
              bind:value={form.account_id}
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            >
              {#each accounts as account}
                <option value={account.id}>{account.name}</option>
              {/each}
            </select>
          </div>

          <div class="lg:col-span-3">
            <label class="block text-sm font-medium text-slate-700">Note</label>
            <textarea
              bind:value={form.note}
              rows="3"
              class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Contoh: makan siang"
            ></textarea>
          </div>

          <div class="lg:col-span-3 flex gap-3">
            <button
              type="submit"
              class="rounded-lg bg-slate-900 px-4 py-2.5 text-white"
              disabled={submitting}
            >
              {#if submitting}
                Menyimpan...
              {:else}
                {editingId ? "Update Transaction" : "Tambah Transaction"}
              {/if}
            </button>

            {#if editingId}
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-700"
                on:click={resetForm}
              >
                Batal
              </button>
            {/if}
          </div>
        </form>
      {/if}

      {#if error}
        <div class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      {/if}
    </div>

    <div class="mt-6 rounded-2xl bg-white p-6 shadow">
      <div
        class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <h2 class="text-lg font-semibold text-slate-900">
            Daftar Transaction
          </h2>
          <p class="text-sm text-slate-500">Menampilkan transaksi terbaru.</p>
        </div>

        <div class="w-full md:w-56">
          <label class="block text-sm font-medium text-slate-700"
            >Filter Type</label
          >
          <select
            bind:value={filterType}
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            on:change={loadTransactions}
          >
            <option value="">Semua</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      {#if loading}
        <div class="mt-4 text-slate-500">Loading...</div>
      {:else if transactions.length === 0}
        <div class="mt-4 text-slate-500">Belum ada transaction.</div>
      {:else}
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-4 py-3 text-left">Tanggal</th>
                <th class="px-4 py-3 text-left">Type</th>
                <th class="px-4 py-3 text-left">Category</th>
                <th class="px-4 py-3 text-left">Account</th>
                <th class="px-4 py-3 text-left">Amount</th>
                <th class="px-4 py-3 text-left">Note</th>
                <th class="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {#each transactions as transaction}
                <tr class="border-t">
                  <td class="px-4 py-3">{transaction.transaction_date}</td>
                  <td class="px-4 py-3">
                    <span
                      class={transaction.transaction_type === "income"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"}
                    >
                      {transaction.transaction_type}
                    </span>
                  </td>
                  <td class="px-4 py-3"
                    >{getCategoryName(transaction.category_id)}</td
                  >
                  <td class="px-4 py-3"
                    >{getAccountName(transaction.account_id)}</td
                  >
                  <td class="px-4 py-3 font-medium"
                    >{formatIDR(transaction.amount)}</td
                  >
                  <td class="px-4 py-3">{transaction.note ?? "-"}</td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      <button
                        class="rounded bg-blue-600 px-3 py-1.5 text-white"
                        on:click={() => startEdit(transaction)}
                      >
                        Edit
                      </button>
                      <button
                        class="rounded bg-red-600 px-3 py-1.5 text-white"
                        on:click={() => handleDelete(transaction)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div>
