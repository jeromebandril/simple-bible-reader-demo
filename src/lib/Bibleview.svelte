<script>
  import {bibleData, shortBooksNames} from '../store'
  import {onMount} from 'svelte'

  let currentScale = 1;
  let currectSelectedVerse = $bibleData.verse;

  function scrollToVerse (id) {
  }


  onMount(()=>{
    // document.addEventListener('wheel', (event) => {
    //   const zoomableText = document.querySelector('.verse');
    //   // Check if the Ctrl key is held down (event.ctrlKey) and prevent the default
    //   if (event.ctrlKey) {
    //     // Calculate the new scale based on scroll direction
    //     if (event.deltaY < 0) {
    //       currentScale += 0.1; // Zoom in when scrolling up
    //     } else {
    //       currentScale -= 0.1; // Zoom out when scrolling down
    //     }

    //     // Limit the scale to a specific range if needed
    //     if (currentScale < 0.5) {
    //       currentScale = 0.5;
    //     } else if (currentScale > 2.0) {
    //       currentScale = 2.0;
    //     }

    //     // Apply the scale to the text element
    //     zoomableText.style.transform = `scale(${currentScale})`;
    //     console.log("zooming");
    //     // Prevent the default behavior of the scroll event
    //     event.preventDefault();
    //   }
    // });
    scrollToVerse(currectSelectedVerse)
  });

</script>

<div class="wrapper">
  <div id="container" class="verses-viewport">
    {#each $bibleData.data as verse,i } 
    <div class="wrap-verse">
        <span class="ref-verse">{$shortBooksNames[$bibleData.book]} {$bibleData.chapter}:{i+1}</span>
        <span id={i+1} class="verse">{verse}</span>
    </div>
    {/each}
    <div class="spacer"></div>
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    font-size: x-large;
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