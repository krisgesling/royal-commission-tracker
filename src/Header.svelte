<script>
  import { link } from 'svelte-spa-router';
  
  export let currentRoute = '/';
</script>

<!-- Header Section -->
<header class="bg-gradient-to-r from-primary-navy to-slate-700 text-white">
  <div class="container mx-auto px-6 py-8 text-center">
    <div class="mb-8">
      <img 
        src="The-Unfinished-Mandate-banner.png" 
        alt="The Unfinished Mandate" 
        class="h-32 md:h-40 lg:h-48 w-auto mx-auto mb-6 max-w-full object-contain" 
      />
    </div>
    <p class="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
      Empowering accountability in Australian governance through transparent tracking of Royal Commission recommendations
    </p>
    
    <!-- Navigation -->
    <div class="mt-10">
      <nav class="flex justify-center space-x-8">
        <a 
          href="/" 
          use:link 
          class="px-6 py-3 rounded-lg transition-all duration-200 text-lg font-medium {currentRoute === '/' ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}"
        >
          Home
        </a>
        <a 
          href="/about" 
          use:link 
          class="px-6 py-3 rounded-lg transition-all duration-200 text-lg font-medium {currentRoute === '/about' ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'}"
        >
          About
        </a>
      </nav>
    </div>
  </div>
</header>
