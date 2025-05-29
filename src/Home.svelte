<script>
  import { onMount } from 'svelte';
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';

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
        // Add stats - handle both old flat structure and new categorized structure
        let recs = [];
        if (data.categories && Array.isArray(data.categories)) {
          // New categorized structure
          recs = data.categories.flatMap(cat => cat.recommendations || []);
        } else {
          // Old flat structure
          recs = data.recommendations || [];
        }
        
        data.stats = {
          total: data.totalRecommendations || recs.length,
          accepted: recs.filter(r => r.accepted === true || r.accepted === 'true').length,
          implemented: recs.filter(r => r.implemented === true || r.implemented === 'true').length
        };
        
        // Store flattened recommendations for easier access
        data.allRecommendations = recs;
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
      const allRecs = commission.allRecommendations || commission.recommendations || [];
      allRecs.forEach(rec => {
        if (!rec.implemented || rec.implemented === 'partial' || rec.implemented === false) {
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

<div class="min-h-screen bg-neutral-100">
  <Header currentRoute="/" />
  <!-- Main Content -->
  <div class="container mx-auto px-6 py-12 max-w-6xl">
    <!-- Introduction Section -->
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold text-primary-navy mb-6">Tracking Implementation Status</h2>
      <p class="text-lg text-neutral-600 max-w-4xl mx-auto mb-8">
        Australia invests substantial resources in Royal Commissions and inquiries, generating vital recommendations 
        aimed at addressing systemic issues. Yet many of these recommendations remain unimplemented, often gathering 
        dust in bureaucratic silos.
      </p>
      
      <!-- Action Button -->
      <button 
        on:click={getRandomUnimplementedRecommendation}
        class="btn-primary text-lg px-8 py-4"
      >
        🔍 Discover Unimplemented Recommendations
      </button>
      <p class="text-sm text-neutral-600 mt-4">
        Explore recommendations that remain unfulfilled across Australian inquiries
      </p>
    </div>

    {#if loading}
      <div class="flex justify-center items-center h-32">
        <div class="bg-white rounded-lg shadow-card p-8">
          <div class="animate-pulse text-primary-navy font-semibold">
            Loading commission data...
          </div>
          <div class="mt-4 h-2 bg-neutral-200 rounded">
            <div class="h-2 bg-primary-red rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-800 font-semibold">{error}</div>
      </div>
    {:else}
      <!-- Commission Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {#each commissions as c}
          <div class="card cursor-pointer group" on:click={() => openCommission(c)} on:keydown={(e) => e.key === 'Enter' && openCommission(c)} role="button" tabindex="0">
            <div class="flex justify-between items-start mb-4">
              <div class="bg-primary-red/10 px-3 py-1 rounded-full">
                <span class="text-primary-red font-medium text-sm">Royal Commission</span>
              </div>
              <div class="bg-primary-navy text-white px-3 py-1 rounded-full text-sm font-medium">
                {c.stats.total} Recommendations
              </div>
            </div>
            
            <h3 class="text-xl font-bold text-primary-navy mb-3 group-hover:text-primary-red transition-colors">
              {c.name}
            </h3>
            
            <p class="text-neutral-600 mb-6 line-clamp-3">
              {c.summary}
            </p>
            
            <!-- Status Indicators -->
            <div class="flex flex-wrap gap-3 mb-4">
              <div class="status-badge status-implemented">
                ✓ Accepted: {c.stats.accepted}
              </div>
              <div class="status-badge status-pending">
                ⏳ Implemented: {c.stats.implemented}
              </div>
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-neutral-200">
              <span class="text-sm text-neutral-500">Click to view details</span>
              <span class="text-primary-red group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    
    {#if selectedCommission}
      <!-- Commission Detail Modal -->
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-primary-navy to-slate-700 text-white p-6 relative">
            <button 
              class="absolute top-4 right-4 text-white/60 hover:text-white text-2xl font-bold"
              on:click={closeCommission}
            >
              ×
            </button>
            
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium opacity-90 mb-1">Royal Commission Report</div>
                <h2 class="text-2xl font-bold">{selectedCommission.name}</h2>
              </div>
              <div class="bg-white/20 px-4 py-2 rounded-lg">
                <span class="text-sm font-semibold">{selectedCommission.stats.total} Recommendations</span>
              </div>
            </div>
          </div>
          
          <!-- Modal Content -->
          <div class="p-6">
            <!-- Commission Overview -->
            <div class="mb-8">
              {#if selectedCommission.year}
                <p class="text-neutral-600 mb-3">
                  <span class="font-semibold text-primary-navy">Report Year:</span> {selectedCommission.year}
                </p>
              {/if}
              <p class="text-neutral-600 mb-4">
                <span class="font-semibold text-primary-navy">Summary:</span> {selectedCommission.summary}
              </p>
              <p class="text-neutral-600">
                <span class="font-semibold text-primary-navy">Key Findings:</span> {selectedCommission.findings}
              </p>
            </div>
            
            <!-- Implementation Status Overview -->
            {#if selectedCommission.implementationStatus}
              <div class="bg-neutral-50 rounded-lg p-6 mb-8">
                <h3 class="font-bold text-primary-navy mb-6">Implementation Status Overview</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="text-center">
                    <div class="bg-status-implemented/20 border border-status-implemented text-status-implemented font-bold text-2xl px-4 py-3 rounded-lg mb-2">
                      {selectedCommission.implementationStatus.fullyImplemented}
                    </div>
                    <p class="text-xs text-neutral-600 font-medium">Fully Implemented</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-status-partial/20 border border-status-partial text-status-partial font-bold text-2xl px-4 py-3 rounded-lg mb-2">
                      {selectedCommission.implementationStatus.partiallyImplemented}
                    </div>
                    <p class="text-xs text-neutral-600 font-medium">Partially Implemented</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-status-pending/20 border border-status-pending text-status-pending font-bold text-2xl px-4 py-3 rounded-lg mb-2">
                      {selectedCommission.implementationStatus.notImplemented}
                    </div>
                    <p class="text-xs text-neutral-600 font-medium">Not Implemented</p>
                  </div>
                  <div class="text-center">
                    <div class="bg-status-ignored/20 border border-status-ignored text-status-ignored font-bold text-2xl px-4 py-3 rounded-lg mb-2">
                      {selectedCommission.implementationStatus.notAccepted}
                    </div>
                    <p class="text-xs text-neutral-600 font-medium">Not Accepted</p>
                  </div>
                </div>
              </div>
            {/if}
          
            <!-- Recommendations Table -->
            {#if selectedCommission.categories && selectedCommission.categories.length > 0}
              <!-- New categorized display -->
              <div class="space-y-8">
                {#each selectedCommission.categories as category}
                  <div class="border border-neutral-200 rounded-lg overflow-hidden">
                    <div class="bg-primary-navy text-white p-4">
                      <h3 class="font-bold text-lg">{category.name}</h3>
                      <p class="text-sm opacity-90">{category.description}</p>
                    </div>
                    <div class="overflow-x-auto">
                      <table class="min-w-full">
                        <thead class="bg-neutral-50">
                          <tr>
                            <th class="px-4 py-3 text-left font-semibold text-neutral-800 text-sm">ID</th>
                            <th class="px-4 py-3 text-left font-semibold text-neutral-800 text-sm">Recommendation</th>
                            <th class="px-4 py-3 text-center font-semibold text-neutral-800 text-sm">Status</th>
                            <th class="px-4 py-3 text-center font-semibold text-neutral-800 text-sm">Implementation</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-neutral-200">
                          {#each category.recommendations as rec}
                            <tr class="hover:bg-neutral-50">
                              <td class="px-4 py-4 text-center">
                                <span class="bg-primary-red text-white font-semibold text-xs px-2 py-1 rounded">#{rec.id}</span>
                              </td>
                              <td class="px-4 py-4">
                                <p class="text-neutral-800 text-sm leading-relaxed">{rec.recommendation}</p>
                                {#if rec.notes}
                                  <div class="mt-2 p-3 bg-amber-50 border-l-4 border-amber-400 text-sm text-amber-800">
                                    <span class="font-semibold">Note:</span> {rec.notes}
                                  </div>
                                {/if}
                              </td>
                              <td class="px-4 py-4 text-center">
                                {#if rec.accepted === true || rec.accepted === 'true'}
                                  <span class="status-badge status-implemented">✓ Accepted</span>
                                {:else if rec.accepted === 'partial'}
                                  <span class="status-badge status-partial">~ Partial</span>
                                {:else}
                                  <span class="status-badge status-ignored">✗ Rejected</span>
                                {/if}
                              </td>
                              <td class="px-4 py-4 text-center">
                                {#if rec.implemented === true || rec.implemented === 'true'}
                                  <span class="status-badge status-implemented">✓ Complete</span>
                                {:else if rec.implemented === 'partial'}
                                  <span class="status-badge status-partial">⏳ Partial</span>
                                {:else}
                                  <span class="status-badge status-pending">✗ Unmet</span>
                                {/if}
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <!-- Fallback for old flat structure -->
              <div class="border border-neutral-200 rounded-lg overflow-hidden">
                <table class="min-w-full">
                  <thead class="bg-neutral-50">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold text-neutral-800">Recommendation</th>
                      <th class="px-4 py-3 text-center font-semibold text-neutral-800">Status</th>
                      <th class="px-4 py-3 text-center font-semibold text-neutral-800">Implementation</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-neutral-200">
                    {#each (selectedCommission.recommendations || []) as rec}
                      <tr class="hover:bg-neutral-50">
                        <td class="px-4 py-4">
                          <p class="text-neutral-800 leading-relaxed">{rec.recommendation}</p>
                          {#if rec.details}
                            <p class="text-sm text-neutral-600 mt-2 italic">{rec.details}</p>
                          {/if}
                        </td>
                        <td class="px-4 py-4 text-center">
                          {#if rec.accepted}
                            <span class="status-badge status-implemented">✓ Accepted</span>
                          {:else}
                            <span class="status-badge status-ignored">✗ Rejected</span>
                          {/if}
                        </td>
                        <td class="px-4 py-4 text-center">
                          {#if rec.implemented}
                            <span class="status-badge status-implemented">✓ Complete</span>
                          {:else}
                            <span class="status-badge status-pending">⏳ Unmet</span>
                          {/if}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
                {#if !selectedCommission.recommendations || selectedCommission.recommendations.length === 0}
                  <div class="p-8 text-center text-neutral-500">
                    <div class="bg-neutral-100 rounded-lg py-4 px-6 inline-block">
                      No recommendations data available
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
            
            <!-- Key Outcomes and Challenges -->
            {#if selectedCommission.keyOutcomes && selectedCommission.keyOutcomes.length > 0}
              <div class="mt-8 bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 class="font-bold text-green-800 mb-4">Key Outcomes Achieved</h3>
                <ul class="list-disc list-inside space-y-2">
                  {#each selectedCommission.keyOutcomes as outcome}
                    <li class="text-sm text-green-700">{outcome}</li>
                  {/each}
                </ul>
              </div>
            {/if}
            
            {#if selectedCommission.ongoingChallenges && selectedCommission.ongoingChallenges.length > 0}
              <div class="mt-4 bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h3 class="font-bold text-orange-800 mb-4">Ongoing Challenges</h3>
                <ul class="list-disc list-inside space-y-2">
                  {#each selectedCommission.ongoingChallenges as challenge}
                    <li class="text-sm text-orange-700">{challenge}</li>
                  {/each}
                </ul>
              </div>
            {/if}
            
            <!-- Close Button -->
            <div class="mt-8 text-center">
              <button 
                on:click={closeCommission}
                class="btn-primary"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Random Recommendation Modal -->
    {#if showRandomModal && randomRecommendation}
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-primary-red to-red-600 text-white p-6 relative">
            <button 
              class="absolute top-4 right-4 text-white/60 hover:text-white text-2xl font-bold"
              on:click={closeRandomModal}
            >
              ×
            </button>
            
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium opacity-90 mb-1">Unfinished Business</div>
                <div class="text-xs opacity-75">Discovered: {new Date().toLocaleDateString()}</div>
              </div>
              <div class="bg-white/20 px-4 py-2 rounded-lg animate-pulse">
                <span class="text-sm font-bold">UNMET</span>
              </div>
            </div>
          </div>
          
          <!-- Modal Content -->
          <div class="p-6">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-primary-navy mb-3">Unfinished Mandate</h2>
              <div class="inline-block px-6 py-3 bg-neutral-100 border border-neutral-300 rounded-lg">
                <span class="text-sm font-semibold text-neutral-700">Source: {randomRecommendation.commissionName}</span>
              </div>
              <p class="text-sm text-neutral-500 mt-3 italic">A recommendation that remains unfulfilled</p>
            </div>
            
            <!-- Recommendation Content -->
            <div class="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
              <div class="flex items-start gap-6">
                <div class="bg-primary-red text-white font-bold w-16 h-16 flex items-center justify-center text-sm flex-shrink-0 rounded-lg shadow-lg">
                  #{randomRecommendation.id}
                </div>
                <div class="flex-1">
                  <div class="bg-orange-100 border-l-4 border-orange-400 p-4 mb-6">
                    <p class="text-sm font-semibold text-orange-800">Recommendation Details</p>
                  </div>
                  <p class="text-lg text-neutral-800 font-medium leading-relaxed mb-6">
                    {randomRecommendation.recommendation}
                  </p>
                  {#if randomRecommendation.notes}
                    <div class="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-800">
                      <span class="font-semibold">Implementation Notes:</span> {randomRecommendation.notes}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
            
            <!-- Status Indicators -->
            <div class="mt-8 flex justify-center gap-6 flex-wrap">
              <div>
                {#if randomRecommendation.accepted === true || randomRecommendation.accepted === 'true'}
                  <span class="status-badge status-implemented">✓ Officially Accepted</span>
                {:else if randomRecommendation.accepted === 'partial'}
                  <span class="status-badge status-partial">~ Partially Accepted</span>
                {:else}
                  <span class="status-badge status-ignored">✗ Not Accepted</span>
                {/if}
              </div>
              <div>
                {#if randomRecommendation.implemented === true || randomRecommendation.implemented === 'true'}
                  <span class="status-badge status-implemented">✓ Fully Implemented</span>
                {:else if randomRecommendation.implemented === 'partial'}
                  <span class="status-badge status-partial">⏳ Partially Implemented</span>
                {:else}
                  <span class="status-badge status-pending">✗ Unfinished Business</span>
                {/if}
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="mt-8 text-center space-x-4">
              <button 
                on:click={getRandomUnimplementedRecommendation}
                class="btn-primary"
              >
                Find Another
              </button>
              <button 
                on:click={closeRandomModal}
                class="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <Footer />
</div>

<style>
  /* Additional custom styles for enhanced UX */
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
