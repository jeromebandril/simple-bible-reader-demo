<script>
  import { afterUpdate } from 'svelte';
  import {bibleData, shortBooksNames} from '../../store'
  
  let currentScale = 1;
  $: selVerse = $bibleData.verse;
  $: fontSize = 25 * currentScale;

  function scrollToVerse (node) {
    const update = () => {
      const item = node.querySelector('.selected');
      if (item)
        item.scrollIntoView({ behavior: 'auto' });  
    }
    update();
    return {update};
  }

  function zoom (evt) {
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

  function moveTruVerses (evt) {
    if(evt.repeat) return;

    switch (evt.key) {
      case 'ArrowLeft':
        if (selVerse > 1) selVerse -= 1
        break;
    
      case 'ArrowRight':
        if (selVerse < $bibleData.allVerses.length) selVerse += 1;
        break;
    }
  }

  function highlightVerse (evt) {
    selVerse = parseInt(evt.currentTarget.id);
  }

</script>

<svelte:window on:keydown={moveTruVerses}/>
<div on:mousewheel={zoom} class="wrapper" style="font-size: {fontSize}px;">
  {#if $bibleData.error.code === 0}
    <div use:scrollToVerse={$bibleData.verse} id="container" class="verses-viewport">
      {#each $bibleData.allVerses as verse,i } 
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={highlightVerse} id={i+1} class:selected={i+1 === selVerse} class="wrap-verse">
          <span class="ref-verse">{$shortBooksNames[$bibleData.book]} {$bibleData.chapter}:{i+1}</span>
          <span class="verse">{verse}</span>
        </div>
      {/each}
      <div  class="spacer"></div>
    </div>
  {:else}
    <div>
      {$bibleData.error.message}
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