<script lang="ts">
  import { api } from '$lib/api/client';
  import { z } from 'zod';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
  });

  async function handleLogin(event: SubmitEvent) {
    event.preventDefault();

    error = '';
    loading = true;

    try {
      loginSchema.parse({ email, password });

      const response = await api.post('/auth/login', {
        email,
        password
      });

      if (response.status === 200) {
        goto('/dashboard');
      }

    } catch (err: any) {
      if (err instanceof z.ZodError) {
        error = err.errors[0].message;
      } else {
        error =
          err.response?.data?.message ||
          'Login failed. Check backend connection.';
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen relative overflow-hidden bg-[#f5f7ff] flex items-center justify-center px-4 py-10">

  <!-- Background Effects -->
  <div class="absolute top-0 left-0 h-[500px] w-[500px] bg-indigo-300/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>

  <div class="absolute bottom-0 right-0 h-[500px] w-[500px] bg-purple-300/20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3"></div>

  <!-- Login Card -->
  <div class="relative w-full max-w-md">

    <!-- Glassmorphism Card -->
    <div class="backdrop-blur-2xl bg-white/70 border border-white/60 shadow-[0_20px_80px_rgba(99,102,241,0.18)] rounded-[32px] p-8 md:p-10">

      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <div class="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-300">
          <span class="text-3xl">✉️</span>
        </div>
      </div>

      <!-- Heading -->
      <div class="text-center space-y-2 mb-8">
        <h1 class="text-4xl font-black tracking-tight text-gray-900">
          Welcome Back
        </h1>

        <p class="text-gray-500 text-sm leading-relaxed">
          Sign in to continue managing and launching your email campaigns.
        </p>
      </div>

      <!-- Error -->
      {#if error}
        <div class="mb-6 p-4 rounded-2xl border border-red-100 bg-red-50 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      {/if}

      <!-- Form -->
      <form onsubmit={handleLogin} class="space-y-5">

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">
            Email Address
          </label>

          <div class="relative">
            <input
              type="email"
              bind:value={email}
              placeholder="you@example.com"
              required
              class="w-full rounded-2xl border border-gray-200 bg-white/70 px-5 py-4 pl-12 text-gray-900 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />

            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              ✉
            </div>
          </div>
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-700">
            Password
          </label>

          <div class="relative">
            <input
              type="password"
              bind:value={password}
              placeholder="••••••••"
              required
              class="w-full rounded-2xl border border-gray-200 bg-white/70 px-5 py-4 pl-12 text-gray-900 shadow-sm outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />

            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔒
            </div>
          </div>
        </div>

        <!-- Forgot Password -->
        <div class="flex justify-end">
          <button
            type="button"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full overflow-hidden rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

          <div class="relative flex items-center justify-center gap-3">
            {#if loading}
              <div class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing In...
            {:else}
              <span>Sign In</span>
              <span class="text-lg">→</span>
            {/if}
          </div>
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-8 text-center text-sm text-gray-500">
        Secure access to your BulkSender dashboard.
      </div>
    </div>
  </div>
</div>