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

<main class="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900 p-4 flex flex-col items-center relative">
  <!-- Subtle document pattern background -->
  <div class="absolute inset-0 opacity-5 bg-repeat" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22><rect width=%2220%22 height=%2220%22 fill=%22%23000%22/><rect x=%222%22 y=%222%22 width=%2216%22 height=%2216%22 fill=%22%23fff%22/><rect x=%224%22 y=%224%22 width=%2212%22 height=%221%22 fill=%22%23000%22/><rect x=%224%22 y=%226%22 width=%2212%22 height=%221%22 fill=%22%23000%22/><rect x=%224%22 y=%228%22 width=%2212%22 height=%221%22 fill=%22%23000%22/></svg>'); background-size: 40px 40px;"></div>
  
  <div class="w-full max-w-5xl relative z-10">
    <h1 class="text-4xl md:text-5xl font-extrabold mb-2 text-center text-red-700 drop-shadow-sm tracking-tight">The <span class="bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-1 rounded">█████████</span> Truth</h1>
    <p class="text-center text-lg text-gray-600 mb-6">Uncovering the classified reality: What happens after the cameras stop rolling</p>
    
    <!-- Random Recommendation Button -->
    <div class="text-center mb-8">
      <button 
        on:click={getRandomUnimplementedRecommendation}
        class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 border-2 border-red-700"
      >
        📄 DECLASSIFY RANDOM FINDING
      </button>
      <p class="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
        Access classified recommendations from the archives - discover what's been gathering dust since the inquiry ended
      </p>
    </div>
    {#if loading}
      <div class="flex justify-center items-center h-32">
        <div class="relative">
          <span class="animate-pulse bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded font-mono text-sm">SCANNING ARCHIVES</span>
          <div class="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 rounded">
            <div class="h-1 bg-gradient-to-r from-red-600 to-orange-600 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    {:else if error}
      <div class="text-red-600 text-center">{error}</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {#each commissions as c}
          <div class="bg-white rounded-lg shadow-xl border-2 border-gray-200 hover:border-red-400 transition-colors p-6 flex flex-col items-start relative group cursor-pointer hover:scale-[1.02] duration-200 bg-gradient-to-br from-white to-gray-50" on:click={() => openCommission(c)}>
            <div class="absolute top-0 right-0 m-4">
              <span class="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold font-mono shadow">CLASSIFIED: {c.stats.total} FINDINGS</span>
            </div>
            <div class="bg-red-100 border-l-4 border-red-600 p-2 mb-3 w-full">
              <p class="text-xs font-bold text-red-800 font-mono">📋 OFFICIAL INQUIRY DOCUMENT</p>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors pr-20">{c.name}</h2>
            <p class="mb-4 text-gray-700 line-clamp-3">{c.summary}</p>
            <div class="flex gap-3 mt-auto">
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 border border-green-300 text-green-800 font-bold text-xs font-mono uppercase tracking-wide">
                ✓ ACCEPTED: {c.stats.accepted}
              </span>
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 border border-orange-300 text-orange-800 font-bold text-xs font-mono uppercase tracking-wide">
                ⏳ IMPLEMENTED: {c.stats.implemented}
              </span>
            </div>
            <div class="absolute bottom-0 right-0 m-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-red-600 font-bold text-xs font-mono">📄 ACCESS FULL REPORT →</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    {#if selectedCommission}
      <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 p-8 relative animate-fade-in border-4 border-red-600">
          <button class="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold" on:click={closeCommission}>&times;</button>
          
          <div class="bg-red-600 text-white p-4 mb-6 -m-8 mb-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-mono font-bold">CLASSIFIED DOCUMENT</p>
                <p class="text-xs font-mono opacity-75">SECURITY CLEARANCE REQUIRED</p>
              </div>
              <div class="bg-white text-red-600 px-3 py-1 font-mono text-xs font-bold">
                CONFIDENTIAL
              </div>
            </div>
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{selectedCommission.name}</h2>
          <p class="mb-3 text-gray-700"><span class="font-bold text-red-700 font-mono">EXECUTIVE SUMMARY:</span> {selectedCommission.summary}</p>
          <p class="mb-6 text-gray-700"><span class="font-bold text-red-700 font-mono">KEY FINDINGS:</span> {selectedCommission.findings}</p>
          
          <div class="overflow-x-auto rounded-lg shadow bg-gray-50 border-2 border-gray-200">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr class="bg-gray-200">
                  <th class="px-4 py-3 text-left font-bold text-gray-900 font-mono text-sm">RECOMMENDATION</th>
                  <th class="px-4 py-3 text-center font-bold text-gray-900 font-mono text-sm">STATUS</th>
                  <th class="px-4 py-3 text-center font-bold text-gray-900 font-mono text-sm">IMPLEMENTATION</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                {#each selectedCommission.recommendations as rec}
                  <tr class="hover:bg-gray-100 transition-colors">
                    <td class="px-4 py-3 align-top text-left">
                      <span class="block font-medium text-gray-900">{rec.recommendation}</span>
                      {#if rec.details}
                        <span class="block text-xs text-gray-500 mt-1 italic">{rec.details}</span>
                      {/if}
                    </td>
                    <td class="px-4 py-3 text-center align-top">
                      {#if rec.accepted}
                        <span class="inline-block px-3 py-1 bg-green-100 border border-green-400 text-green-800 font-bold text-xs font-mono">
                          ✓ ACCEPTED
                        </span>
                      {:else}
                        <span class="inline-block px-3 py-1 bg-red-100 border border-red-400 text-red-800 font-bold text-xs font-mono">
                          ✗ REJECTED
                        </span>
                      {/if}
                    </td>
                    <td class="px-4 py-3 text-center align-top">
                      {#if rec.implemented}
                        <span class="inline-block px-3 py-1 bg-green-100 border border-green-400 text-green-800 font-bold text-xs font-mono">
                          ✓ COMPLETED
                        </span>
                      {:else}
                        <span class="inline-block px-3 py-1 bg-orange-100 border border-orange-400 text-orange-800 font-bold text-xs font-mono">
                          ⏳ PENDING
                        </span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            {#if selectedCommission.recommendations.length === 0}
              <div class="p-8 text-center text-gray-400 font-mono">
                <div class="bg-red-600 text-white px-4 py-2 inline-block font-bold">
                  ████████ REDACTED ████████
                </div>
              </div>
            {/if}
          </div>
          
          <div class="mt-6 text-center">
            <button 
              on:click={closeCommission}
              class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded transition-all duration-300 transform hover:scale-105 font-mono"
            >
              📄 CLOSE FILE
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Random Recommendation Modal -->
    {#if showRandomModal && randomRecommendation}
      <div class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 p-8 relative animate-fade-in border-4 border-red-600">
          <button class="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-2xl font-bold" on:click={closeRandomModal}>&times;</button>
          
          <div class="bg-red-600 text-white p-4 mb-6 -m-8 mb-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-mono font-bold">DECLASSIFIED FINDING</p>
                <p class="text-xs font-mono opacity-75">ACCESS GRANTED: {new Date().toISOString().split('T')[0]}</p>
              </div>
              <div class="bg-orange-500 text-white px-3 py-1 font-mono text-xs font-bold animate-pulse">
                UNIMPLEMENTED
              </div>
            </div>
          </div>
          
          <div class="text-center mb-6">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">ARCHIVED RECOMMENDATION</h2>
            <div class="inline-block px-4 py-2 bg-gray-100 text-gray-800 font-mono text-sm font-bold border">
              SOURCE: {randomRecommendation.commissionName}
            </div>
            <p class="text-xs text-gray-500 mt-2 italic font-mono">Security Level: DECLASSIFIED • Status: PENDING IMPLEMENTATION</p>
          </div>
          
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border-2 border-gray-300">
            <div class="flex items-start gap-4">
              <div class="bg-red-600 text-white font-mono w-12 h-12 flex items-center justify-center font-bold text-sm flex-shrink-0">
                #{randomRecommendation.id}
              </div>
              <div class="flex-1">
                <div class="bg-orange-100 border-l-4 border-orange-500 p-3 mb-4">
                  <p class="text-sm font-bold text-orange-800 font-mono">📋 RECOMMENDATION DETAILS</p>
                </div>
                <p class="text-lg text-gray-900 font-medium leading-relaxed mb-4">
                  {randomRecommendation.recommendation}
                </p>
                {#if randomRecommendation.details}
                  <p class="text-sm text-gray-600 italic bg-gray-100 p-3 border-l-4 border-gray-400">
                    <span class="font-mono font-bold text-gray-800">ADDITIONAL CONTEXT:</span> {randomRecommendation.details}
                  </p>
                {/if}
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex justify-center gap-4">
            <div class="flex items-center gap-2">
              <span class="inline-block px-4 py-2 bg-green-100 border border-green-400 text-green-800 font-bold text-xs font-mono">
                ✓ OFFICIALLY ACCEPTED
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-block px-4 py-2 bg-red-100 border border-red-400 text-red-800 font-bold text-xs font-mono animate-pulse">
                ✗ NOT IMPLEMENTED
              </span>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <button 
              on:click={getRandomUnimplementedRecommendation}
              class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded transition-all duration-300 transform hover:scale-105 mr-4 font-mono"
            >
              📄 ACCESS ANOTHER FILE
            </button>
            <button 
              on:click={closeRandomModal}
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded transition-all duration-300 font-mono"
            >
              CLOSE FILE
            </button>
          </div>
        </div>
      </div>
    {/if}
    <div class="mt-12 text-center text-gray-500 text-sm font-mono">
      &copy; {new Date().getFullYear()} The Redacted Truth • Security Classification: UNCLASSIFIED
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
