<script>
  import Router from 'svelte-spa-router'
  import Home from './Home.svelte'
  import About from './About.svelte'

  const routes = {
    '/': Home,
    '/about': About
  }
</script>

<Router {routes}></Router>
