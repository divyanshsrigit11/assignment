<script lang="ts">
    import "../../app.css";
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { api } from '$lib/api/client';

    let { children } = $props();
    let loading = $state(true);
    let isCollapsed = $state(false);

    onMount(async () => {
        try {
            await api.get('/auth/me'); 
            loading = false;
        } catch (err) {
            goto('/login');
        }
    });

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'SMTP Settings', path: '/smtp', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
        { name: 'Reports', path: '/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z' }
    ];

    async function handleLogout() {
        await api.post('/auth/logout');
        goto('/login');
    }
</script>

{#if !loading}
<div class="flex h-screen bg-gray-50 overflow-hidden">
    <aside 
        class="bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out flex flex-col shadow-2xl relative"
        style="width: {isCollapsed ? '80px' : '260px'}"
    >
        <button 
            onclick={() => isCollapsed = !isCollapsed}
            class="absolute -right-3 top-10 bg-indigo-600 text-white rounded-full p-1 shadow-lg hover:bg-indigo-500 transition-colors z-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 {isCollapsed ? 'rotate-180' : ''} transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <div class="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
            <div class="bg-indigo-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            {#if !isCollapsed}
                <span class="ml-3 font-bold text-xl text-white tracking-tight">BulkSender</span>
            {/if}
        </div>

        <nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {#each navItems as item}
                <a 
                    href={item.path} 
                    class="flex items-center p-3 rounded-xl transition-all duration-200 {page.url.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800 text-slate-400'}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                    </svg>
                    {#if !isCollapsed}
                        <span class="ml-4 font-medium whitespace-nowrap">{item.name}</span>
                    {/if}
                </a>
            {/each}
        </nav>

        <div class="p-4 border-t border-slate-800">
            <button onclick={handleLogout} class="w-full flex items-center p-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {#if !isCollapsed}
                    <span class="ml-4 font-medium">Logout</span>
                {/if}
            </button>
        </div>
    </aside>

    <main class="flex-1 overflow-y-auto p-8 bg-gray-50">
        {@render children()}
    </main>
</div>
{:else}
    <div class="h-screen w-screen flex flex-col items-center justify-center bg-[#0f172a]">
        <div class="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-slate-400 font-medium">Securing session...</p>
    </div>
{/if}