<script lang="ts">
    import { onMount } from 'svelte';
    import { api } from '$lib/api/client';

    let stats = $state({
        totalUsers: 0,
        sentEmails: 0,
        activeJobs: 0,
        userName: 'Developer'
    });

    let isLoading = $state(true);

    onMount(async () => {
        try {
            const res = await api.get('/user/info');
            if (res.data.success) {
                stats.userName = res.data.user.name;
            }
        } catch (e) {
            console.error('Failed to fetch dashboard data');
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="space-y-8 p-6">
    <header class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {stats.userName}</h1>
      <p class="text-gray-500">Here is what's happening with your email campaigns today.</p>
    </div>
    
    <a href="/send" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform active:scale-95 whitespace-nowrap">
      + New Campaign
    </a>
  </header>

    {#if isLoading}
        <div class="flex h-64 items-center justify-center">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
    {:else}
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <p class="text-sm font-medium text-gray-500">Total Emails Sent</p>
                <p class="mt-2 text-3xl font-bold text-indigo-600">{stats.sentEmails}</p>
            </div>

            <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <p class="text-sm font-medium text-gray-500">Active Campaigns</p>
                <p class="mt-2 text-3xl font-bold text-green-600">{stats.activeJobs}</p>
            </div>

      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-sm font-medium text-gray-500 uppercase">Success Rate</p>
        <p class="mt-2 text-3xl font-bold text-blue-600">0%</p>
      </div>

      <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <p class="text-sm font-medium text-gray-500 uppercase">Configured SMTPs</p>
        <p class="mt-2 text-3xl font-bold text-orange-500">0</p>
      </div>
    </div>

        <div class="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div class="border-b border-gray-100 p-6">
                <h3 class="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
            </div>
            <div class="flex h-48 items-center justify-center text-gray-400 italic">
                No recent activity found. Start by sending your first bulk email!
            </div>
        </div>
    {/if}
</div>