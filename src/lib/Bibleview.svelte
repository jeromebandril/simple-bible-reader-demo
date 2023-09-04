<script>
  import {bibleData, shortBooksNames} from '../store'
  
  let currentScale = 1;
  $: fontSize = 25 * currentScale;

  function scrollToVerse (id) {
    const el = document.getElementById(`${id}`)
    if (el != null) {
      el.scrollIntoView()
    }
  }

  function zoom (evt) {
    if (evt.ctrlKey) {
      // Calculate the new scale based on scroll direction
      const zoomableText = document.querySelector('.verse');
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

  $: {scrollToVerse($bibleData.verse)};
</script>

<div on:mousewheel={zoom} class="wrapper" style="font-size: {fontSize}px;">
  {#if $bibleData.error.code === 0}
    <div  id="container" class="verses-viewport">
      {#each $bibleData.allVerses as verse,i } 
        <div class="wrap-verse">
          <span class="ref-verse">{$shortBooksNames[$bibleData.book]} {$bibleData.chapter}:{i+1}</span>
          <span id={i+1} class="verse">{verse}</span>
        </div>
      {/each}
      <div class="spacer"></div>
    </div>
  {:else}
    <div>
      {$bibleData.error.message}
    </div>
  {/if} 
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
  }
  .verses-viewport {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    max-height: calc(100vh - 4rem);
  }
  .ref-verse {
    color: blue;
    font-weight: 600;
  }

  .ref-verse:enabled {
    color: brown;
  }

  .spacer {
    height: 30rem;
  }
  .wrap-verse {
    float: left;
  }
</style>