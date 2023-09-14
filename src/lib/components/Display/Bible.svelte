<script lang="ts">
  import {isDarkMode, shortBooksNames, openBibles} from '../../../store'
  import { getContext, setContext } from 'svelte';
  import type { Data } from '../../../myInterfaces';
  import type { Writable } from 'svelte/store';
  export let source = $openBibles.kjv;
  
  let searchResult: Writable<Data> = getContext('result');
  let selectedVerse: Writable<number> = getContext('selVerse');
  $selectedVerse = $searchResult.selectedVerse

  function highlightVerse (evt: MouseEvent) {
    const element = evt.currentTarget as HTMLDivElement;
    $selectedVerse = parseInt(element.id);
    setContext('selVerse',selectedVerse)
  }
</script>

<div class="verses-viewport">
  {#each $searchResult.results as res, i}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={highlightVerse} id={String(i)} class:selected={i === $selectedVerse} class="wrap-verse">
      <span class="ref-verse" class:darkmode={$isDarkMode}>{$shortBooksNames[res.book]} {res.chapter+1}:{res.verse+1}</span>
      <span class="verse">{source[res.book][res.chapter][res.verse]}</span>
    </div>
  {/each}
  <div class="spacer"/>
</div>

<style>
  .verses-viewport {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 4rem);
    scroll-behavior: smooth;
  }
  .ref-verse {
    color: blue;
    font-weight: 600;
  }
  .ref-verse.darkmode {
    color: yellow;
  }
  .selected {
    color: brown;
  }
  .spacer {
    min-height: 20rem;
  }
  .wrap-verse {
    float: left;
  }
</style>