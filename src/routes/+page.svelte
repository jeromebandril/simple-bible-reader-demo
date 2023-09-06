<script lang="ts">
	import Bibleview from '$lib/components/Bibleview.svelte';
  import Toolbar from '$lib/components/Toolbar/Toolbar.svelte';
  import Titlebar from '$lib/components/Titlebar.svelte';
	import './styles.css';
  import {splitCount} from '../store'
</script>

<main>
  <Titlebar/>
  <Toolbar/>
  <div class="split-screen">
    <Bibleview/>
    {#each {length: $splitCount} as _}
      <Bibleview/>
    {/each}
  </div>
</main>


<style>
  main {
    height: 100%;
  }
  .split-screen {
    display: flex;
    flex-direction: row;
  }

</style>
  

