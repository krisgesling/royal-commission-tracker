<script>
  import { onMount } from 'svelte';
  let commissionFiles = [
    { name: 'Example Commission', file: 'commission-example.json' },
    { name: 'Royal Commission into Aboriginal Deaths in Custody', file: 'commission-aboriginal-deaths-custody.json' }
  ];
  let commissions = [];
  let loading = true;
  let error = '';

  // Load all commissions on mount
  onMount(async () => {
    loading = true;
    error = '';
    commissions = [];
    for (const c of commissionFiles) {
      try {
        const base = import.meta.env.BASE_URL || '/';
        const res = await fetch(base + c.file);
        let data = await res.json();
        // Support both array (old) and object (new) formats
        if (Array.isArray(data)) {
          // Defensive: if array, use first element or fallback to legacy structure
          if (data.length && typeof data[0] === 'object' && data[0].name) {
            data = data[0];
          } else {
            data = {
              name: c.name,
              summary: '',
              findings: '',
              recommendations: data
            };
          }
        }
        // Add stats
        const recs = data.recommendations || [];
        data.stats = {
          total: recs.length,
          accepted: recs.filter(r => r.accepted).length,
          implemented: recs.filter(r => r.implemented).length
        };
        data.file = c.file;
        commissions.push(data);
      } catch (e) {
        error = 'Failed to load commission data.';
      }
    }
    loading = false;
  });

  let selectedCommission = null;
  let randomRecommendation = null;
  let showRandomModal = false;

  function openCommission(c) {
    selectedCommission = c;
  }
  function closeCommission() {
    selectedCommission = null;
  }

  function getRandomUnimplementedRecommendation() {
    // Collect all unimplemented recommendations from all commissions
    const unimplementedRecs = [];
    
    commissions.forEach(commission => {
      commission.recommendations.forEach(rec => {
        if (!rec.implemented) {
          unimplementedRecs.push({
            ...rec,
            commissionName: commission.name
          });
        }
      });
    });

    if (unimplementedRecs.length > 0) {
      const randomIndex = Math.floor(Math.random() * unimplementedRecs.length);
      randomRecommendation = unimplementedRecs[randomIndex];
      showRandomModal = true;
    }
  }

  function closeRandomModal() {
    showRandomModal = false;
    randomRecommendation = null;
  }
</script>

<main class="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 text-gray-900 p-4 flex flex-col items-center">
  <div class="w-full max-w-5xl">
    <h1 class="text-4xl md:text-5xl font-extrabold mb-2 text-center text-red-700 drop-shadow-sm tracking-tight">Commission Impossible</h1>
    <p class="text-center text-lg text-gray-600 mb-6">Your mission, should you choose to accept it: Implement existing recommendations instead of starting new inquiries</p>
    
    <!-- Random Recommendation Button -->
    <div class="text-center mb-8">
      <button 
        on:click={getRandomUnimplementedRecommendation}
        class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        🎯 Accept Your Mission
      </button>
      <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
        Your mission, should you choose to accept it: Implement an existing recommendation instead of commissioning a new inquiry
      </p>
    </div>
    {#if loading}
      <div class="flex justify-center items-center h-32">
        <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-2"></span>
        <span class="text-indigo-700 font-semibold">Loading commissions...</span>
      </div>
    {:else if error}
      <div class="text-red-600 text-center">{error}</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {#each commissions as c}
          <div class="bg-white rounded-2xl shadow-xl border-2 border-red-100 hover:border-red-400 transition-colors p-6 flex flex-col items-start relative group cursor-pointer hover:scale-[1.02] duration-200" on:click={() => openCommission(c)}>
            <div class="absolute top-0 right-0 m-4">
              <span class="inline-block px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold shadow">🎯 {c.stats.total} Missions</span>
            </div>
            <h2 class="text-2xl font-bold text-red-800 mb-2 group-hover:text-red-600 transition-colors pr-20">{c.name}</h2>
            <p class="mb-4 text-gray-700 line-clamp-3">{c.summary}</p>
            <div class="flex gap-3 mt-auto">
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/>
                </svg>
                Accepted: {c.stats.accepted}
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Complete: {c.stats.implemented}
              </span>
            </div>
            <div class="absolute bottom-0 right-0 m-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-red-500 font-bold text-xs">🎯 View Mission Brief →</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    {#if selectedCommission}
      <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fade-in">
          <button class="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold" on:click={closeCommission}>&times;</button>
          
          <h2 class="text-3xl font-bold text-red-800 mb-2">{selectedCommission.name}</h2>
          <p class="mb-3 text-gray-700"><span class="font-semibold text-red-700">Intelligence Summary:</span> {selectedCommission.summary}</p>
          <p class="mb-4 text-gray-700"><span class="font-semibold text-red-700">Field Findings:</span> {selectedCommission.findings}</p>
          
          <div class="overflow-x-auto rounded-lg shadow bg-red-50">
            <table class="min-w-full divide-y divide-red-200">
              <thead>
                <tr class="bg-red-200">
                  <th class="px-4 py-3 text-left font-semibold text-red-700">Mission Objective</th>
                  <th class="px-4 py-3 text-center font-semibold text-red-700">Approved</th>
                  <th class="px-4 py-3 text-center font-semibold text-red-700">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-red-100">
                {#each selectedCommission.recommendations as rec}
                  <tr class="hover:bg-red-100 transition-colors">
                    <td class="px-4 py-3 align-top text-left">
                      <span class="block font-medium text-gray-900">{rec.recommendation}</span>
                      {#if rec.details}
                        <span class="block text-xs text-gray-500 mt-1">{rec.details}</span>
                      {/if}
                    </td>
                    <td class="px-4 py-3 text-center align-top">
                      {#if rec.accepted}
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                          ✓ Approved
                        </span>
                      {:else}
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                          ✗ Denied
                        </span>
                      {/if}
                    </td>
                    <td class="px-4 py-3 text-center align-top">
                      {#if rec.implemented}
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                          Mission Complete
                        </span>
                      {:else}
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
                          <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Awaiting Action
                        </span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            {#if selectedCommission.recommendations.length === 0}
              <div class="p-8 text-center text-gray-400">No mission objectives found for this operation.</div>
            {/if}
          </div>
          
          <div class="mt-6 text-center">
            <button 
              on:click={closeCommission}
              class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              🎯 Close Brief
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Random Recommendation Modal -->
    {#if showRandomModal && randomRecommendation}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 p-8 relative animate-fade-in">
          <button class="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold" on:click={closeRandomModal}>&times;</button>
          
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-red-800 mb-2">🎯 Mission Brief</h2>
            <div class="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              Source: {randomRecommendation.commissionName}
            </div>
            <p class="text-xs text-gray-500 mt-2 italic">This message will not self-destruct, unlike most recommendations</p>
          </div>
          
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div class="flex items-start gap-4">
              <div class="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm flex-shrink-0">
                #{randomRecommendation.id}
              </div>
              <div class="flex-1">
                <div class="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-3">
                  <p class="text-sm font-medium text-yellow-800">🎯 MISSION OBJECTIVE</p>
                </div>
                <p class="text-lg text-gray-800 font-medium leading-relaxed">
                  {randomRecommendation.recommendation}
                </p>
                {#if randomRecommendation.details}
                  <p class="text-sm text-gray-600 mt-3 italic">
                    {randomRecommendation.details}
                  </p>
                {/if}
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-center gap-4">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Accepted
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-red-100 text-red-700 font-semibold text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Not Implemented
              </span>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <button 
              on:click={getRandomUnimplementedRecommendation}
              class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 mr-4"
            >
              🎯 New Mission
            </button>
            <button 
              on:click={closeRandomModal}
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition-all duration-300"
            >
              Mission Complete
            </button>
          </div>
        </div>
      </div>
    {/if}
    <div class="mt-12 text-center text-gray-500 text-sm">
      &copy; {new Date().getFullYear()} Commission Impossible
    </div>
  </div>
</main>

<style>
  .animate-fade-in {
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: none; }
  }
  /* Remove old styles, Tailwind will handle styling */
</style>
