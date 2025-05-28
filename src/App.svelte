<script>
  import { onMount } from 'svelte';
  let commissions = [];
  let selectedCommission = '';
  let recommendations = [];
  let commissionFiles = [];

  // Discover available commission JSON files in /public
  onMount(async () => {
    // For demo, hardcode one file. In production, use a build step or API to list files.
    commissionFiles = [
      { name: 'Example Commission', file: 'commission-example.json' }
    ];
    selectedCommission = commissionFiles[0].file;
    await loadRecommendations(selectedCommission);
  });

  async function loadRecommendations(file) {
    const res = await fetch('/' + file);
    recommendations = await res.json();
  }
</script>

<main class="min-h-screen bg-gray-50 text-gray-900 p-4">
  <h1 class="text-3xl font-bold mb-6 text-center">Royal Commission Tracker</h1>
  <div class="mb-6 flex justify-center">
    <select bind:value={selectedCommission} on:change={() => loadRecommendations(selectedCommission)} class="border rounded px-3 py-2">
      {#each commissionFiles as c}
        <option value={c.file}>{c.name}</option>
      {/each}
    </select>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white shadow rounded-lg">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2 text-left">Recommendation</th>
          <th class="px-4 py-2 text-center">Accepted</th>
          <th class="px-4 py-2 text-center">Implemented</th>
        </tr>
      </thead>
      <tbody>
        {#each recommendations as rec}
          <tr class="border-b">
            <td class="px-4 py-2">{rec.recommendation}</td>
            <td class="px-4 py-2 text-center">
              {#if rec.accepted}
                <span class="text-green-600 font-bold">Yes</span>
              {:else}
                <span class="text-red-600 font-bold">No</span>
              {/if}
            </td>
            <td class="px-4 py-2 text-center">
              {#if rec.implemented}
                <span class="text-green-600 font-bold">Yes</span>
              {:else}
                <span class="text-red-600 font-bold">No</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <footer class="mt-10 text-center text-gray-500 text-sm">
    &copy; {new Date().getFullYear()} Royal Commission Tracker
  </footer>
</main>

<style>
  /* Remove old styles, Tailwind will handle styling */
</style>
