<script lang="ts">
  import { api } from '$lib/api/client';
  import { z } from 'zod';

  let recipients = $state('');
  let subject = $state('');
  let body = $state('');

  let loading = $state(false);
  let statusMessage = $state('');
  let isError = $state(false);

  // Validation Schema
  const campaignSchema = z.object({
    subject: z.string().min(3, "Subject is too short"),
    body: z.string().min(10, "Email body is too short"),
    recipients: z.string().min(5, "Please add at least one recipient")
  });

  async function handleLaunch() {
    loading = true;
    statusMessage = '';
    isError = false;

    try {
      // client-side validation
      campaignSchema.parse({ subject, body, recipients });

      // Format recipients
      const emailList = recipients
        .split(/[\n,]+/)
        .map(email => email.trim())
        .filter(email => email.length > 0);

      // API Call
      await api.post('/send/bulk', {
        recipients: emailList,
        subject,
        body
      });

      statusMessage = `🚀 Success! ${emailList.length} emails queued for sending.`;

      recipients = '';
      subject = '';
      body = '';

    } catch (err: any) {
      isError = true;

      if (err instanceof z.ZodError) {
        statusMessage = "❌ " + err.errors[0].message;
      } else {
        statusMessage =
          "❌ " + (err.response?.data?.error || "Failed to launch campaign");
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-10 px-4">
  <div class="max-w-6xl mx-auto">

    <!-- Header -->
    <div class="mb-8">
      <div class="bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-8">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-4xl font-black text-gray-900 tracking-tight">
              Email Campaign Studio
            </h1>

            <p class="text-gray-500 mt-2 text-sm">
              Create, customize and launch beautiful campaigns instantly.
            </p>
          </div>

          <div class="hidden md:flex items-center gap-3">
            <div class="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl shadow-inner">
              ✉️
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status -->
    {#if statusMessage}
      <div
        class="mb-6 p-4 rounded-2xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 shadow-sm
        {isError
          ? 'bg-red-50 border-red-100 text-red-700'
          : 'bg-green-50 border-green-100 text-green-700'}"
      >
        {statusMessage}
      </div>
    {/if}

    <!-- Main Layout -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- Recipient Card -->
      <div class="xl:col-span-1">
        <div class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-6 h-full">

          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                Recipients
              </h2>

              <p class="text-xs text-gray-400 mt-1">
                Add emails separated by commas or new lines.
              </p>
            </div>

            <div class="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              👥
            </div>
          </div>

          <textarea
            id="recipients"
            bind:value={recipients}
            placeholder="john@example.com&#10;jane@example.com"
            class="w-full h-[420px] p-5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm font-mono"
          ></textarea>
        </div>
      </div>

      <!-- Content Section -->
      <div class="xl:col-span-2 space-y-6">

        <!-- Subject -->
        <div class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                Subject Line
              </h2>

              <p class="text-xs text-gray-400 mt-1">
                Make your email catchy and engaging.
              </p>
            </div>

            <div class="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              📝
            </div>
          </div>

          <input
            id="subject"
            type="text"
            bind:value={subject}
            placeholder="Enter your campaign subject..."
            class="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        <!-- Message Body -->
        <div class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                Message Body
              </h2>

              <p class="text-xs text-gray-400 mt-1">
                HTML formatting is supported.
              </p>
            </div>

            <div class="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              💌
            </div>
          </div>

          <textarea
            id="body"
            bind:value={body}
            placeholder="Write your campaign content here..."
            class="w-full h-72 p-5 rounded-2xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
          ></textarea>
        </div>

        <!-- Action -->
        <div class="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl p-6">
          <button
            onclick={handleLaunch}
            disabled={loading}
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {#if loading}
              <div class="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Launching Campaign...
            {:else}
              <span class="text-xl">🚀</span>
              Launch Campaign
            {/if}
          </button>
        </div>

      </div>
    </div>
  </div>
</div>