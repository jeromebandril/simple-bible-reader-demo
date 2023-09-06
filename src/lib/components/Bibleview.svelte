<script lang="ts">
  import {openBibles,searchResult, shortBooksNames} from '../../store'
  
  $: currentBible = $openBibles.kjv;
  $: results = $searchResult.results
  $: selectedVerse = $searchResult.selectedVerse;
  let currentScale = 1;
  $: fontSize = 25 * currentScale;

  function scrollToVerse (node: Element, id: number) {
    const update = () => {
      const item = node.querySelector('.selected');
      if (item)
        item.scrollIntoView({ behavior: 'auto' });  
    }
    update();
    return {update};
  }

  function zoom (evt: WheelEvent) { 
    if (evt.ctrlKey) {
      // Calculate the new scale based on scroll direction
      if (evt.deltaY < 0) {
        currentScale += 0.1; // Zoom in when scrolling up
      } else {
        currentScale -= 0.1; // Zoom out when scrolling down
      }

      // Limit the scale to a specific range if needed
      if (currentScale < 0.5) {
        currentScale = 0.5;
      } else if (currentScale > 2.0) {
        currentScale = 2.0;
      }
    }
  }

  function moveTruVerses (evt: KeyboardEvent) {
    if(evt.repeat) return;

    switch (evt.key) {
      case 'ArrowLeft':
        if (selectedVerse > 1) selectedVerse -= 1
        break;
    
      case 'ArrowRight':
        if (selectedVerse < results.length) selectedVerse += 1;
        break;
    }
  }

  function highlightVerse (evt: MouseEvent) {
    const element = evt.currentTarget as HTMLDivElement;
    selectedVerse = parseInt(element.id);
  }

</script>

<div></div>
<svelte:window on:keydown={moveTruVerses}/>
<div on:wheel={zoom} class="wrapper" style="font-size: {fontSize}px;">
  {#if $searchResult.status.code === 0}
    <div use:scrollToVerse={$searchResult.selectedVerse} id="container" class="verses-viewport">
      {#each results as res, i} 
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={highlightVerse} id={String(i)} class:selected={i === selectedVerse} class="wrap-verse">
          <span class="ref-verse">{$shortBooksNames[res.book]} {res.chapter+1}:{res.verse+1}</span>
          <span class="verse">{currentBible[res.book][res.chapter][res.verse]}</span>
        </div>
      {/each}
      <div  class="spacer"></div>
    </div>
  {:else}
    <div>
      {$searchResult.status.message}
    </div>
  {/if} 
</div>

<style>
  .wrapper {
    width: calc(100% - 10px);
    height: 100%;
    padding: 10px 0 10px 10px;
    background: var(--tertiary-color);
  }
  .verses-viewport {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    max-height: calc(100vh - 4rem);
    scroll-behavior: smooth;
  }
  .ref-verse {
    color: blue;
    font-weight: 600;
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