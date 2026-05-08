<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/client';

  let logs = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await api.get('/report');
      logs = res.data.logs || [];
    } catch (e) {
      console.error("Failed to fetch logs");
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-8 space-y-6">
  <h1 class="text-2xl font-bold">Campaign Reports</h1>
  
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead class="bg-gray-50 border-b border-gray-100">
        <tr>
          <th class="p-4 font-semibold text-gray-600">Timestamp</th>
          <th class="p-4 font-semibold text-gray-600">Recipient</th>
          <th class="p-4 font-semibold text-gray-600">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each logs as log}
          <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td class="p-4 text-sm">{new Date(log.timestamp).toLocaleString()}</td>
            <td class="p-4 text-sm font-mono">{log.recipient}</td>
            <td class="p-4">
              <span class="px-2 py-1 rounded-full text-xs font-bold {log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                {log.status.toUpperCase()}
              </span>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="3" class="p-12 text-center text-gray-400 italic">No campaign logs found.</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>