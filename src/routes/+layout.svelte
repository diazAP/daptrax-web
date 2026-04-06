<script lang="ts">
  import "../app.css";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth";
  import { getMe, logout } from "$lib/api/auth";

  let { children } = $props();

  const queryClient = new QueryClient();

  onMount(async () => {
    try {
      const me = await getMe();
      authStore.setUser(me);
    } catch {
      authStore.clear();
    }
  });

  async function handleLogout() {
    try {
      await logout();
    } finally {
      authStore.clear();
      await goto("/login");
    }
  }
</script>

<QueryClientProvider client={queryClient}>
  <div class="min-h-screen bg-slate-50">
    <nav class="border-b bg-white">
      <div
        class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
      >
        <div class="text-xl font-bold text-slate-900">
          DAP<span class="text-blue-600">trax</span>
        </div>

        {#if $authStore.user}
          <div class="flex items-center gap-4 text-sm">
            <a href="/dashboard" class="text-slate-700">Dashboard</a>
            <a href="/accounts" class="text-slate-700">Accounts</a>
            <button
              class="rounded-lg bg-slate-900 px-3 py-2 text-white"
              onclick={handleLogout}
            >
              Logout
            </button>
          </div>
        {/if}
      </div>
    </nav>

    {@render children()}
  </div>
</QueryClientProvider>
