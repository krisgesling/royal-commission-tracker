<script>
  import Header from './Header.svelte';
  import Footer from './Footer.svelte';
</script>

<main class="min-h-screen bg-neutral-100">
  <Header currentRoute="/about" />

  <!-- Main Content -->
  <div class="container mx-auto px-6 py-12 max-w-4xl">
    
    <!-- The Problem Section -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-primary-navy mb-6">The Problem</h2>
      <div class="prose prose-lg max-w-none">
        <p class="text-neutral-600 leading-relaxed mb-4">
          Australia invests substantial resources in Royal Commissions and inquiries, generating vital recommendations 
          aimed at addressing systemic issues, protecting vulnerable communities, and improving public services. Yet, 
          a significant number of these recommendations remain unimplemented, often gathering dust in bureaucratic silos.
        </p>
        <p class="text-neutral-600 leading-relaxed mb-4">
          This leads to continued harm and erosion of public confidence. The "mandate for change" often remains 
          tragically unfulfilled, while new governments assume office claiming fresh mandates without addressing 
          the unfinished business of the past.
        </p>
        <p class="text-neutral-600 leading-relaxed">
          The need for this platform is more urgent than ever. As new governments assume office, often claiming a fresh mandate, 
          "The Unfinished Mandate" serves as an indispensable tool for citizens, media, and advocacy groups to hold them 
          accountable to the recommendations of the past.
        </p>
      </div>
    </div>

    <!-- Platform Features -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-primary-navy mb-8">Platform Features</h2>
      <p class="text-lg text-neutral-600 mb-8">
        The Unfinished Mandate serves as the definitive public ledger for tracking the implementation 
        status of recommendations from Australian Royal Commissions and inquiries.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="card text-center">
          <div class="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📊</span>
          </div>
          <h3 class="text-xl font-bold text-primary-navy mb-3">Comprehensive Tracking</h3>
          <p class="text-neutral-600">
            A robust database detailing recommendations from key Australian inquiries, including their current 
            status from acceptance to implementation.
          </p>
        </div>
        
        <div class="card text-center">
          <div class="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📈</span>
          </div>
          <h3 class="text-xl font-bold text-primary-navy mb-3">Transparent Reporting</h3>
          <p class="text-neutral-600">
            Intuitive visualizations and clear data presentations that highlight implementation gaps 
            and areas of concern.
          </p>
        </div>
        
        <div class="card text-center">
          <div class="w-16 h-16 bg-primary-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">🎯</span>
          </div>
          <h3 class="text-xl font-bold text-primary-navy mb-3">Actionable Insights</h3>
          <p class="text-neutral-600">
            Easily discover and share specific unimplemented recommendations, fostering public advocacy 
            and direct engagement with decision-makers.
          </p>
        </div>
      </div>
    </div>

    <!-- Our Vision -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-primary-navy mb-6">Our Vision</h2>
      <div class="bg-gradient-to-r from-primary-navy to-slate-700 text-white rounded-xl p-8">
        <p class="text-xl leading-relaxed mb-6">
          We believe that by shining a spotlight on the "unfinished mandates," we can compel governments to act, 
          rebuild public trust, and ultimately contribute to a more just and responsive Australia.
        </p>
      </div>
    </div>

    <!-- Design Principles -->
    <div class="mb-16">
      <h2 class="text-3xl font-bold text-primary-navy mb-8">Our Approach</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg p-6 border border-neutral-200">
          <h3 class="text-xl font-bold text-primary-navy mb-4">🎯 Clarity Over Complexity</h3>
          <p class="text-neutral-600">
            Every design decision prioritizes user understanding. Complex political information becomes accessible without losing nuance.
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 border border-neutral-200">
          <h3 class="text-xl font-bold text-primary-navy mb-4">⚖️ Authority Through Evidence</h3>
          <p class="text-neutral-600">
            Visual hierarchy and typography establish credibility. Data speaks louder than opinion.
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 border border-neutral-200">
          <h3 class="text-xl font-bold text-primary-navy mb-4">🔥 Urgency Without Panic</h3>
          <p class="text-neutral-600">
            Design creates momentum for action while maintaining rational, informed discourse.
          </p>
        </div>
        
        <div class="bg-white rounded-lg p-6 border border-neutral-200">
          <h3 class="text-xl font-bold text-primary-navy mb-4">🌈 Optimism in Accountability</h3>
          <p class="text-neutral-600">
            Colorful elements represent the vibrant democracy we're fighting for, not just the problems we're solving.
          </p>
        </div>
      </div>
    </div>

    <!-- Call to Action -->
    <div class="bg-primary-red/10 border border-primary-red/20 rounded-lg p-8 text-center">
      <h2 class="text-2xl font-bold text-primary-navy mb-4">Join the Movement for Accountability</h2>
      <p class="text-neutral-600 mb-6 leading-relaxed">
        Help us shine a spotlight on unfinished mandates and compel governments to act on the recommendations 
        that matter most to Australian communities.
      </p>
      <div class="space-x-4">
        <a href="/" class="btn-primary inline-block">
          Explore Recommendations
        </a>
        <button class="btn-secondary">
          Contact Us
        </button>
      </div>
    </div>
  </div>

  <Footer />
</main>

<style>
  .prose {
    color: inherit;
  }
</style>
