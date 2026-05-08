<script lang="ts">
  import { api } from '$lib/api/client';
  import { z } from 'zod';

  // Svelte 5 Runes
  let config = $state({
    name: '',
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '', 
    from_email: '',
    from_name: ''
  });

  let loading = $state(false);
  let message = $state('');

  const smtpSchema = z.object({
    name: z.string().min(2, "Name is required"),
    host: z.string().min(1, "Host is required"),
    port: z.number().positive(),
    user: z.string().min(1, "Username is required"), 
    pass: z.string().min(1, "Password is required"),
    from_email: z.string().email("Valid from-email required")
  });

  async function saveConfig(e: Event) {
    e.preventDefault(); 
    loading = true;
    message = '';
    
    try {
      smtpSchema.parse(config);
      
      //Map 'pass' to 'password' for the Hono backend requirements
      const payload = {
        name: config.name,
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.pass, 
        from_email: config.from_email,
        from_name: config.from_name
      };

      await api.post('/config/smtp', payload); 
      
      message = "✅ SMTP Configuration saved successfully!";
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        message = "❌ " + (err.errors?.[0]?.message || "Validation Error");
      } else {
        const backendMsg = err.response?.data?.message || err.response?.data?.error;
        message = "❌ " + (backendMsg || "Failed to save: Server rejected request");
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
  <h1 class="text-2xl font-bold mb-1 text-gray-900">SMTP Settings</h1>
  <p class="text-sm text-gray-500 mb-6">Configure your outgoing mail server to start sending campaigns.</p>
  
  {#if message}
    <div class="mb-6 p-4 rounded-lg text-sm font-medium border {message.includes('✅') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}">
      {message}
    </div>
  {/if}

  <form onsubmit={saveConfig} class="grid grid-cols-2 gap-5">
    <div class="col-span-2">
      <label class="block text-sm font-semibold text-gray-700">Configuration Name</label>
      <input type="text" bind:value={config.name} class="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Gmail Marketing" />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700">SMTP Host</label>
      <input type="text" bind:value={config.host} class="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="smtp.gmail.com" />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700">Port</label>
      <input type="number" bind:value={config.port} class="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none" />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700">From Email</label>
      <input type="email" bind:value={config.from_email} class="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="noreply@yourdomain.com" />
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700">From Name (Optional)</label>
      <input type="text" bind:value={config.from_name} class="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Your Company" />
    </div>

    <div class="col-span-1">
      <label class="block text-sm font-semibold text-gray-700">Username</label>
      <input type="text" bind:value={config.user} class="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none" />
    </div>

    <div class="col-span-1">
      <label class="block text-sm font-semibold text-gray-700">Password</label>
      <input type="password" bind:value={config.pass} class="w-full border border-gray-200 p-3 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 outline-none" />
    </div>

    <div class="col-span-2 pt-4">
      <button 
        type="submit" 
        disabled={loading} 
        class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-indigo-300 shadow-lg shadow-indigo-100 transition-all transform active:scale-[0.98]"
      >
        {loading ? 'Saving Settings...' : 'Save Configuration'}
      </button>
    </div>
  </form>
</div>
