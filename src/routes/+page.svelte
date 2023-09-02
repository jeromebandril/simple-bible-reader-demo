<script>
  import { bible } from '../store';
  import { invoke } from '@tauri-apps/api/tauri';
  import {onMount} from 'svelte'
	import Bibleview from '$lib/Bibleview.svelte';
  import Toolbar from '$lib/Toolbar.svelte';
	import './styles.css';

  const resourcePath = '\\smyrna.bible.v2\\src-tauri\\assets\\data\\kjv-english.json';
  onMount(()=>{

  invoke('read_bible_source', { filePath: resourcePath })
    .then((content) => {
      // temp solution parsing with js instead of callind commnad
      let kjvBible = JSON.parse(content);
      // doesn't work fix struct Data
      // invoke('load_bible', { content: content })
      //   .then((parsedBible) => (kjvBible = parsedBible))
      //   .catch((error) => console.log(error));
      bible.set(kjvBible);
    })
    .catch((error) => console.log(error));
  })
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

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
