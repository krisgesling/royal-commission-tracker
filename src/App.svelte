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

<main class="min-h-screen bg-mandate-dark text-mandate-light p-4 flex flex-col items-center relative">
  <!-- Subtle pattern background -->
  <div class="absolute inset-0 opacity-5 bg-repeat" style="background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22><rect width=%2220%22 height=%2220%22 fill=%22%23000%22/><rect x=%222%22 y=%222%22 width=%2216%22 height=%2216%22 fill=%22%23fff%22/><rect x=%224%22 y=%224%22 width=%2212%22 height=%221%22 fill=%22%23000%22/><rect x=%224%22 y=%226%22 width=%2212%22 height=%221%22 fill=%22%23000%22/><rect x=%224%22 y=%228%22 width=%2212%22 height=%221%22 fill=%22%23000%22/></svg>'); background-size: 40px 40px;"></div>
  
  <div class="w-full max-w-5xl relative z-10">
    <!-- Logo/Title section with UNMET stamp -->
    <div class="text-center mb-8">
      <h1 class="text-5xl md:text-6xl font-official font-bold mb-2 text-mandate-light uppercase tracking-wide">
        THE 
        <span class="relative inline-block">
          <span class="text-5xl md:text-6xl font-impact font-bold text-mandate-light uppercase tracking-mandate">UNFINISHED</span>
          <div class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-mandate-red to-mandate-orange"></div>
        </span>
      </h1>
      <div class="relative inline-block mt-4">
        <h2 class="text-6xl md:text-7xl font-impact font-bold text-mandate-light uppercase tracking-mandate">MANDATE</h2>
        <!-- UNMET stamp overlaid -->
        <div class="absolute -top-4 -right-8 transform rotate-12">
          <div class="bg-gradient-to-r from-mandate-red to-mandate-orange text-white px-4 py-2 rounded-md shadow-lg border-2 border-mandate-deep-red">
            <span class="font-official font-bold text-lg uppercase tracking-wide">UNMET</span>
          </div>
        </div>
      </div>
      <p class="text-xl text-mandate-light/80 mt-6 font-body max-w-3xl mx-auto leading-relaxed">
        What happens when the cameras stop rolling and the spotlight fades? Tracking the unfinished business of Australian Royal Commissions and inquiries.
      </p>
    </div>
    
    <!-- Random Recommendation Button -->
    <div class="text-center mb-12">
      <button 
        on:click={getRandomUnimplementedRecommendation}
        class="bg-gradient-to-r from-mandate-red to-mandate-orange hover:from-mandate-deep-red hover:to-mandate-red text-white font-official font-bold py-4 px-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-mandate-red/50 uppercase tracking-wide"
      >
        🔍 Find Unfinished Business
      </button>
      <p class="text-sm text-mandate-light/60 mt-3 max-w-lg mx-auto font-body">
        Discover recommendations that remain unfulfilled - the mandates that time forgot
      </p>
    </div>
    {#if loading}
      <div class="flex justify-center items-center h-32">
        <div class="relative">
          <span class="animate-pulse bg-gradient-to-r from-mandate-red to-mandate-orange text-white px-6 py-3 rounded-lg font-official font-bold text-sm uppercase tracking-wide shadow-lg">
            Searching Records...
          </span>
          <div class="absolute -bottom-3 left-0 right-0 h-1 bg-mandate-card rounded">
            <div class="h-1 bg-gradient-to-r from-mandate-red to-mandate-orange rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    {:else if error}
      <div class="text-mandate-red text-center font-official font-bold">{error}</div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {#each commissions as c}
          <div class="bg-mandate-card rounded-xl shadow-xl border border-mandate-slate/30 hover:border-mandate-red/50 transition-all duration-300 p-6 flex flex-col items-start relative group cursor-pointer hover:scale-[1.02] hover:shadow-2xl" on:click={() => openCommission(c)}>
            <div class="absolute top-0 right-0 m-4">
              <span class="inline-block px-3 py-1 bg-gradient-to-r from-mandate-red to-mandate-orange text-white text-xs font-official font-bold shadow-lg rounded uppercase tracking-wide">
                {c.stats.total} Recommendations
              </span>
            </div>
            <div class="bg-mandate-red/10 border-l-4 border-mandate-red p-3 mb-4 w-full rounded-r">
              <p class="text-xs font-official font-bold text-mandate-red uppercase tracking-wide">Official Inquiry</p>
            </div>
            <h2 class="text-2xl font-official font-bold text-mandate-light mb-3 group-hover:text-mandate-gold transition-colors pr-20 leading-tight">{c.name}</h2>
            <p class="mb-6 text-mandate-light/80 line-clamp-3 font-body leading-relaxed flex-grow">{c.summary}</p>
            <div class="flex gap-3 mt-auto">
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-mandate-green/20 border border-mandate-green/50 text-mandate-green font-official font-bold text-xs uppercase tracking-wide rounded">
                ✓ Accepted: {c.stats.accepted}
              </span>
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-mandate-pending/20 border border-mandate-pending/50 text-mandate-pending font-official font-bold text-xs uppercase tracking-wide rounded">
                ⏳ Implemented: {c.stats.implemented}
              </span>
            </div>
            <div class="absolute bottom-0 right-0 m-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-mandate-gold font-official font-bold text-xs uppercase tracking-wide">View Details →</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
    {#if selectedCommission}
      <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div class="bg-mandate-card rounded-xl shadow-2xl max-w-5xl w-full mx-4 p-8 relative animate-fade-in border border-mandate-slate/30 max-h-screen overflow-y-auto">
          <button class="absolute top-4 right-4 text-mandate-light/60 hover:text-mandate-red text-3xl font-bold transition-colors" on:click={closeCommission}>&times;</button>
          
          <div class="bg-gradient-to-r from-mandate-red to-mandate-orange text-white p-6 mb-6 -m-8 mb-6 rounded-t-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-official font-bold uppercase tracking-wide">Royal Commission Report</p>
                <p class="text-xs font-body opacity-90">Official Government Inquiry</p>
              </div>
              <div class="bg-white text-mandate-red px-4 py-2 font-official text-xs font-bold uppercase tracking-wide rounded shadow">
                {selectedCommission.stats.total} Recommendations
              </div>
            </div>
          </div>
          
          <h2 class="text-3xl font-official font-bold text-mandate-light mb-6 leading-tight">{selectedCommission.name}</h2>
          {#if selectedCommission.year}
            <p class="mb-3 text-mandate-light/80 font-body"><span class="font-official font-bold text-mandate-gold">Report Year:</span> {selectedCommission.year}</p>
          {/if}
          <p class="mb-4 text-mandate-light/80 font-body leading-relaxed"><span class="font-official font-bold text-mandate-gold">Summary:</span> {selectedCommission.summary}</p>
          <p class="mb-8 text-mandate-light/80 font-body leading-relaxed"><span class="font-official font-bold text-mandate-gold">Key Findings:</span> {selectedCommission.findings}</p>
          
          {#if selectedCommission.implementationStatus}
            <div class="bg-mandate-slate/20 rounded-lg p-6 mb-8 border border-mandate-slate/30">
              <h3 class="font-official font-bold text-mandate-gold mb-4 uppercase tracking-wide">Implementation Status Overview</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                  <div class="bg-mandate-green/20 border border-mandate-green text-mandate-green font-official font-bold text-xl px-4 py-3 rounded-lg">
                    {selectedCommission.implementationStatus.fullyImplemented}
                  </div>
                  <p class="text-xs text-mandate-light/60 mt-2 font-body uppercase tracking-wide">Fully Implemented</p>
                </div>
                <div class="text-center">
                  <div class="bg-mandate-pending/20 border border-mandate-pending text-mandate-pending font-official font-bold text-xl px-4 py-3 rounded-lg">
                    {selectedCommission.implementationStatus.partiallyImplemented}
                  </div>
                  <p class="text-xs text-mandate-light/60 mt-2 font-body uppercase tracking-wide">Partially Implemented</p>
                </div>
                <div class="text-center">
                  <div class="bg-mandate-orange/20 border border-mandate-orange text-mandate-orange font-official font-bold text-xl px-4 py-3 rounded-lg">
                    {selectedCommission.implementationStatus.notImplemented}
                  </div>
                  <p class="text-xs text-mandate-light/60 mt-2 font-body uppercase tracking-wide">Not Implemented</p>
                </div>
                <div class="text-center">
                  <div class="bg-mandate-red/20 border border-mandate-red text-mandate-red font-official font-bold text-xl px-4 py-3 rounded-lg">
                    {selectedCommission.implementationStatus.notAccepted}
                  </div>
                  <p class="text-xs text-mandate-light/60 mt-2 font-body uppercase tracking-wide">Not Accepted</p>
                </div>
              </div>
            </div>
          {/if}
          
          {#if selectedCommission.categories && selectedCommission.categories.length > 0}
            <!-- New categorized display -->
            <div class="space-y-8">
              {#each selectedCommission.categories as category}
                <div class="bg-mandate-slate/10 rounded-lg border border-mandate-slate/30 overflow-hidden">
                  <div class="bg-gradient-to-r from-mandate-red to-mandate-orange text-white p-4">
                    <h3 class="font-official font-bold text-lg uppercase tracking-wide">{category.name}</h3>
                    <p class="text-sm opacity-90 font-body">{category.description}</p>
                  </div>
                  <div class="overflow-x-auto">
                    <table class="min-w-full">
                      <thead>
                        <tr class="bg-mandate-card border-b border-mandate-slate/30">
                          <th class="px-4 py-3 text-left font-official font-bold text-mandate-light text-sm uppercase tracking-wide">ID</th>
                          <th class="px-4 py-3 text-left font-official font-bold text-mandate-light text-sm uppercase tracking-wide">Recommendation</th>
                          <th class="px-4 py-3 text-center font-official font-bold text-mandate-light text-sm uppercase tracking-wide">Status</th>
                          <th class="px-4 py-3 text-center font-official font-bold text-mandate-light text-sm uppercase tracking-wide">Implementation</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-mandate-slate/20">
                        {#each category.recommendations as rec}
                          <tr class="hover:bg-mandate-slate/10 transition-colors">
                            <td class="px-4 py-4 align-top text-center">
                              <span class="bg-gradient-to-r from-mandate-red to-mandate-orange text-white font-official text-xs px-3 py-1 rounded font-bold">#{rec.id}</span>
                            </td>
                            <td class="px-4 py-4 align-top text-left">
                              <span class="block font-body font-medium text-mandate-light text-sm leading-relaxed">{rec.recommendation}</span>
                              {#if rec.notes}
                                <span class="block text-xs text-mandate-light/60 mt-2 italic bg-mandate-slate/20 p-3 rounded border-l-2 border-mandate-gold font-body">
                                  <span class="font-official font-bold text-mandate-gold uppercase">Note:</span> {rec.notes}
                                </span>
                              {/if}
                            </td>
                            <td class="px-4 py-4 text-center align-top">
                              {#if rec.accepted === true || rec.accepted === 'true'}
                                <span class="inline-block px-3 py-1 bg-mandate-green/20 border border-mandate-green text-mandate-green font-official font-bold text-xs uppercase tracking-wide rounded">
                                  ✓ Accepted
                                </span>
                              {:else if rec.accepted === 'partial'}
                                <span class="inline-block px-3 py-1 bg-mandate-pending/20 border border-mandate-pending text-mandate-pending font-official font-bold text-xs uppercase tracking-wide rounded">
                                  ~ Partial
                                </span>
                              {:else}
                                <span class="inline-block px-3 py-1 bg-mandate-red/20 border border-mandate-red text-mandate-red font-official font-bold text-xs uppercase tracking-wide rounded">
                                  ✗ Rejected
                                </span>
                              {/if}
                            </td>
                            <td class="px-4 py-4 text-center align-top">
                              {#if rec.implemented === true || rec.implemented === 'true'}
                                <span class="inline-block px-3 py-1 bg-mandate-green/20 border border-mandate-green text-mandate-green font-official font-bold text-xs uppercase tracking-wide rounded">
                                  ✓ Complete
                                </span>
                              {:else if rec.implemented === 'partial'}
                                <span class="inline-block px-3 py-1 bg-mandate-pending/20 border border-mandate-pending text-mandate-pending font-official font-bold text-xs uppercase tracking-wide rounded">
                                  ⏳ Partial
                                </span>
                              {:else}
                                <span class="inline-block px-3 py-1 bg-mandate-orange/20 border border-mandate-orange text-mandate-orange font-official font-bold text-xs uppercase tracking-wide rounded animate-pulse">
                                  ✗ Unmet
                                </span>
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
            <div class="overflow-x-auto rounded-lg shadow bg-mandate-slate/10 border border-mandate-slate/30">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-mandate-card border-b border-mandate-slate/30">
                    <th class="px-4 py-3 text-left font-official font-bold text-mandate-light text-sm uppercase tracking-wide">Recommendation</th>
                    <th class="px-4 py-3 text-center font-official font-bold text-mandate-light text-sm uppercase tracking-wide">Status</th>
                    <th class="px-4 py-3 text-center font-official font-bold text-mandate-light text-sm uppercase tracking-wide">Implementation</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-mandate-slate/20">
                  {#each (selectedCommission.recommendations || []) as rec}
                    <tr class="hover:bg-mandate-slate/10 transition-colors">
                      <td class="px-4 py-4 align-top text-left">
                        <span class="block font-body font-medium text-mandate-light leading-relaxed">{rec.recommendation}</span>
                        {#if rec.details}
                          <span class="block text-xs text-mandate-light/60 mt-2 italic font-body">{rec.details}</span>
                        {/if}
                      </td>
                      <td class="px-4 py-4 text-center align-top">
                        {#if rec.accepted}
                          <span class="inline-block px-3 py-1 bg-mandate-green/20 border border-mandate-green text-mandate-green font-official font-bold text-xs uppercase tracking-wide rounded">
                            ✓ Accepted
                          </span>
                        {:else}
                          <span class="inline-block px-3 py-1 bg-mandate-red/20 border border-mandate-red text-mandate-red font-official font-bold text-xs uppercase tracking-wide rounded">
                            ✗ Rejected
                          </span>
                        {/if}
                      </td>
                      <td class="px-4 py-4 text-center align-top">
                        {#if rec.implemented}
                          <span class="inline-block px-3 py-1 bg-mandate-green/20 border border-mandate-green text-mandate-green font-official font-bold text-xs uppercase tracking-wide rounded">
                            ✓ Complete
                          </span>
                        {:else}
                          <span class="inline-block px-3 py-1 bg-mandate-orange/20 border border-mandate-orange text-mandate-orange font-official font-bold text-xs uppercase tracking-wide rounded animate-pulse">
                            ⏳ Unmet
                          </span>
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              {#if !selectedCommission.recommendations || selectedCommission.recommendations.length === 0}
                <div class="p-8 text-center text-mandate-light/40 font-official">
                  <div class="bg-gradient-to-r from-mandate-red to-mandate-orange text-white px-6 py-3 inline-block font-bold uppercase tracking-wide rounded">
                    No Data Available
                  </div>
                </div>
              {/if}
            </div>
          {/if}
          
          {#if selectedCommission.keyOutcomes && selectedCommission.keyOutcomes.length > 0}
            <div class="mt-8 bg-mandate-green/10 rounded-lg p-6 border border-mandate-green/30">
              <h3 class="font-official font-bold text-mandate-green mb-4 uppercase tracking-wide">Key Outcomes Achieved</h3>
              <ul class="list-disc list-inside space-y-2">
                {#each selectedCommission.keyOutcomes as outcome}
                  <li class="text-sm text-mandate-light/80 font-body leading-relaxed">{outcome}</li>
                {/each}
              </ul>
            </div>
          {/if}
          
          {#if selectedCommission.ongoingChallenges && selectedCommission.ongoingChallenges.length > 0}
            <div class="mt-4 bg-mandate-orange/10 rounded-lg p-6 border border-mandate-orange/30">
              <h3 class="font-official font-bold text-mandate-orange mb-4 uppercase tracking-wide">Ongoing Challenges</h3>
              <ul class="list-disc list-inside space-y-2">
                {#each selectedCommission.ongoingChallenges as challenge}
                  <li class="text-sm text-mandate-light/80 font-body leading-relaxed">{challenge}</li>
                {/each}
              </ul>
            </div>
          {/if}
          
          <div class="mt-8 text-center">
            <button 
              on:click={closeCommission}
              class="bg-gradient-to-r from-mandate-red to-mandate-orange hover:from-mandate-deep-red hover:to-mandate-red text-white font-official font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 uppercase tracking-wide shadow-lg"
            >
              Close Report
            </button>
          </div>
        </div>
      </div>
    {/if}
    
    <!-- Random Recommendation Modal -->
    {#if showRandomModal && randomRecommendation}
      <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div class="bg-mandate-card rounded-xl shadow-2xl max-w-4xl w-full mx-4 p-8 relative animate-fade-in border border-mandate-slate/30">
          <button class="absolute top-4 right-4 text-mandate-light/60 hover:text-mandate-red text-3xl font-bold transition-colors" on:click={closeRandomModal}>&times;</button>
          
          <div class="bg-gradient-to-r from-mandate-red to-mandate-orange text-white p-6 mb-6 -m-8 mb-6 rounded-t-xl">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-official font-bold uppercase tracking-wide">Unfinished Business</p>
                <p class="text-xs font-body opacity-90">Found: {new Date().toLocaleDateString()}</p>
              </div>
              <div class="bg-white/20 text-white px-4 py-2 font-official text-xs font-bold uppercase tracking-wide rounded shadow animate-pulse">
                UNMET
              </div>
            </div>
          </div>
          
          <div class="text-center mb-8">
            <h2 class="text-4xl font-impact font-bold text-mandate-light mb-3 uppercase tracking-mandate">Unfinished Mandate</h2>
            <div class="inline-block px-6 py-3 bg-mandate-slate/20 text-mandate-light font-official text-sm font-bold border border-mandate-slate/50 rounded-lg">
              Source: {randomRecommendation.commissionName}
            </div>
            <p class="text-xs text-mandate-light/60 mt-3 italic font-body">A recommendation that remains unfulfilled</p>
          </div>
          
          <div class="bg-mandate-slate/10 rounded-lg p-6 border border-mandate-slate/30">
            <div class="flex items-start gap-6">
              <div class="bg-gradient-to-r from-mandate-red to-mandate-orange text-white font-official w-16 h-16 flex items-center justify-center font-bold text-sm flex-shrink-0 rounded-lg shadow-lg">
                #{randomRecommendation.id}
              </div>
              <div class="flex-1">
                <div class="bg-mandate-orange/20 border-l-4 border-mandate-orange p-4 mb-6 rounded-r">
                  <p class="text-sm font-official font-bold text-mandate-orange uppercase tracking-wide">Recommendation Details</p>
                </div>
                <p class="text-lg text-mandate-light font-body font-medium leading-relaxed mb-6">
                  {randomRecommendation.recommendation}
                </p>
                {#if randomRecommendation.notes}
                  <p class="text-sm text-mandate-light/70 italic bg-mandate-slate/20 p-4 border-l-4 border-mandate-gold rounded-r font-body">
                    <span class="font-official font-bold text-mandate-gold uppercase">Implementation Notes:</span> {randomRecommendation.notes}
                  </p>
                {/if}
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-center gap-6">
            <div class="flex items-center gap-2">
              {#if randomRecommendation.accepted === true || randomRecommendation.accepted === 'true'}
                <span class="inline-block px-4 py-2 bg-mandate-green/20 border border-mandate-green text-mandate-green font-official font-bold text-xs uppercase tracking-wide rounded">
                  ✓ Officially Accepted
                </span>
              {:else if randomRecommendation.accepted === 'partial'}
                <span class="inline-block px-4 py-2 bg-mandate-pending/20 border border-mandate-pending text-mandate-pending font-official font-bold text-xs uppercase tracking-wide rounded">
                  ~ Partially Accepted
                </span>
              {:else}
                <span class="inline-block px-4 py-2 bg-mandate-red/20 border border-mandate-red text-mandate-red font-official font-bold text-xs uppercase tracking-wide rounded">
                  ✗ Not Accepted
                </span>
              {/if}
            </div>
            <div class="flex items-center gap-2">
              {#if randomRecommendation.implemented === true || randomRecommendation.implemented === 'true'}
                <span class="inline-block px-4 py-2 bg-mandate-green/20 border border-mandate-green text-mandate-green font-official font-bold text-xs uppercase tracking-wide rounded">
                  ✓ Fully Implemented
                </span>
              {:else if randomRecommendation.implemented === 'partial'}
                <span class="inline-block px-4 py-2 bg-mandate-pending/20 border border-mandate-pending text-mandate-pending font-official font-bold text-xs uppercase tracking-wide rounded animate-pulse">
                  ⏳ Partially Implemented
                </span>
              {:else}
                <span class="inline-block px-4 py-2 bg-mandate-red/20 border border-mandate-red text-mandate-red font-official font-bold text-xs uppercase tracking-wide rounded animate-pulse">
                  ✗ Unfinished Business
                </span>
              {/if}
            </div>
          </div>
          
          <div class="mt-8 text-center">
            <button 
              on:click={getRandomUnimplementedRecommendation}
              class="bg-gradient-to-r from-mandate-red to-mandate-orange hover:from-mandate-deep-red hover:to-mandate-red text-white font-official font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 mr-4 uppercase tracking-wide shadow-lg"
            >
              Find Another
            </button>
            <button 
              on:click={closeRandomModal}
              class="bg-mandate-slate/30 hover:bg-mandate-slate/50 text-mandate-light font-official font-bold py-3 px-8 rounded-lg transition-all duration-300 uppercase tracking-wide"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    {/if}
    <div class="mt-16 text-center text-mandate-light/40 text-sm font-body">
      &copy; {new Date().getFullYear()} The Unfinished Mandate • Tracking accountability in Australian governance
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
