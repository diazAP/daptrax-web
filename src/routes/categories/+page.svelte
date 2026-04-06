<script lang="ts">
  import { onMount } from "svelte";
  import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } from "$lib/api/categories";
  import type { Category } from "$lib/types/category";

  let categories: Category[] = [];
  let loading = true;
  let submitting = false;
  let error = "";
  let editingId: string | null = null;

  let form = {
    name: "",
    color_key: "",
    icon_key: "",
    sort_order: 0,
  };

  async function loadCategories() {
    loading = true;
    error = "";

    try {
      categories = await getCategories();
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal memuat categories";
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    editingId = null;
    form = {
      name: "",
      color_key: "",
      icon_key: "",
      sort_order: 0,
    };
  }

  function startEdit(category: Category) {
    editingId = category.id;
    form = {
      name: category.name,
      color_key: category.color_key ?? "",
      icon_key: category.icon_key ?? "",
      sort_order: category.sort_order,
    };
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    submitting = true;
    error = "";

    try {
      const payload = {
        name: form.name.trim(),
        color_key: form.color_key.trim() || null,
        icon_key: form.icon_key.trim() || null,
        sort_order: Number(form.sort_order) || 0,
      };

      if (!payload.name) {
        throw new Error("Nama category wajib diisi");
      }

      if (editingId) {
        await updateCategory(editingId, payload);
      } else {
        await createCategory(payload);
      }

      resetForm();
      await loadCategories();
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal menyimpan category";
    } finally {
      submitting = false;
    }
  }

  async function handleDelete(category: Category) {
    const ok = window.confirm(`Hapus category "${category.name}"?`);

    if (!ok) return;

    try {
      await deleteCategory(category.id);
      await loadCategories();
    } catch (e) {
      error = e instanceof Error ? e.message : "Gagal menghapus category";
    }
  }

  onMount(loadCategories);
</script>

<div class="min-h-screen bg-slate-50 p-6">
  <div class="mx-auto max-w-6xl">
    <h1 class="text-2xl font-bold text-slate-900">Categories</h1>
    <p class="mt-1 text-sm text-slate-500">Kelola kategori transaksi Anda.</p>

    <div class="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 class="text-lg font-semibold text-slate-900">
        {editingId ? "Edit Category" : "Tambah Category"}
      </h2>

      <form
        class="mt-4 grid gap-4 md:grid-cols-2"
        on:submit|preventDefault={handleSubmit}
      >
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-slate-700">Nama</label>
          <input
            bind:value={form.name}
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Contoh: Makanan"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700"
            >Color Key</label
          >
          <input
            bind:value={form.color_key}
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Contoh: orange"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700"
            >Icon Key</label
          >
          <input
            bind:value={form.icon_key}
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Contoh: utensils"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700"
            >Sort Order</label
          >
          <input
            bind:value={form.sort_order}
            type="number"
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div class="md:col-span-2 flex gap-3">
          <button
            type="submit"
            class="rounded-lg bg-slate-900 px-4 py-2.5 text-white"
            disabled={submitting}
          >
            {#if submitting}
              Menyimpan...
            {:else}
              {editingId ? "Update Category" : "Tambah Category"}
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

      {#if error}
        <div class="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      {/if}
    </div>

    <div class="mt-6 rounded-2xl bg-white p-6 shadow">
      <h2 class="text-lg font-semibold text-slate-900">Daftar Category</h2>

      {#if loading}
        <div class="mt-4 text-slate-500">Loading...</div>
      {:else if categories.length === 0}
        <div class="mt-4 text-slate-500">Belum ada category.</div>
      {:else}
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-4 py-3 text-left">Nama</th>
                <th class="px-4 py-3 text-left">Color</th>
                <th class="px-4 py-3 text-left">Icon</th>
                <th class="px-4 py-3 text-left">Sort</th>
                <th class="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {#each categories as category}
                <tr class="border-t">
                  <td class="px-4 py-3 font-medium text-slate-900"
                    >{category.name}</td
                  >
                  <td class="px-4 py-3">{category.color_key ?? "-"}</td>
                  <td class="px-4 py-3">{category.icon_key ?? "-"}</td>
                  <td class="px-4 py-3">{category.sort_order}</td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2">
                      <button
                        class="rounded bg-blue-600 px-3 py-1.5 text-white"
                        on:click={() => startEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        class="rounded bg-red-600 px-3 py-1.5 text-white"
                        on:click={() => handleDelete(category)}
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
