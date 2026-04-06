<script lang="ts">
  import { goto } from "$app/navigation";
  import { loginAdmin, startGoogleLogin } from "$lib/api/auth";
  import { authStore } from "$lib/stores/auth";

  let login = "";
  let password = "";
  let loading = false;
  let error = "";

  async function handleAdminLogin() {
    loading = true;
    error = "";

    try {
      const user = await loginAdmin({ login, password });
      authStore.setUser(user);
      await goto("/dashboard");
    } catch (e) {
      error = e instanceof Error ? e.message : "Login gagal";
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
  <div class="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
    <h1 class="text-3xl font-bold text-slate-900">
      DAP<span class="text-blue-600">trax</span>
    </h1>
    <p class="mt-2 text-sm text-slate-500">
      Masuk ke aplikasi pencatatan keuangan
    </p>

    <form
      class="mt-6 space-y-4"
      onsubmit={async (e) => {
        e.preventDefault();
        await handleAdminLogin();
      }}
    >
      <div>
        <label class="block text-sm font-medium text-slate-700"
          >Login admin</label
        >
        <input
          bind:value={login}
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700">Password</label>
        <input
          bind:value={password}
          type="password"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>

      {#if error}
        <div class="rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      {/if}

      <button
        type="submit"
        class="w-full rounded-lg bg-slate-900 text-white py-2.5 font-medium disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Memproses..." : "Login Admin"}
      </button>
    </form>

    <div class="my-6 flex items-center gap-3">
      <div class="h-px flex-1 bg-slate-200"></div>
      <span class="text-xs text-slate-400">atau</span>
      <div class="h-px flex-1 bg-slate-200"></div>
    </div>

    <button
      type="button"
      class="w-full rounded-lg border border-slate-300 bg-white py-2.5 font-medium text-slate-700"
      onclick={startGoogleLogin}
    >
      Login dengan Google
    </button>
  </div>
</div>
