<script>
	import Bibleview from '$lib/Bibleview.svelte';
  import Toolbar from '$lib/Toolbar.svelte';
	import './styles.css';
</script>

<section>
  <Toolbar/>
  <Bibleview/>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
