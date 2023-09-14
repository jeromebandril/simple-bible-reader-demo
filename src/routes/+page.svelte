<script lang="ts">
  import Titlebar from '$lib/components/Titlebar.svelte';
  import Toolbar from '$lib/components/Toolbar/Toolbar.svelte';
  import Display from '$lib/components/Display/Display.svelte';
	import './styles.css';
</script>

<main>
  <Titlebar/>
  <Toolbar/>
  <Display/>
</main>


<style>
  main {
    height: 100%;
  }
</style>
  

