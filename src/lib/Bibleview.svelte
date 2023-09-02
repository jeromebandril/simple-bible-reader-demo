<script>
  import {bibleData, abbreviationBooks} from '../store'


  let currentScale = 1;

  document.addEventListener('wheel', (event) => {

    const zoomableText = document.querySelector('.verse');
    // Check if the Ctrl key is held down (event.ctrlKey) and prevent the default
    if (event.ctrlKey) {
      // Calculate the new scale based on scroll direction
      if (event.deltaY < 0) {
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

      // Apply the scale to the text element
      zoomableText.style.transform = `scale(${currentScale})`;
      console.log("zooming");
      // Prevent the default behavior of the scroll event
      event.preventDefault();
    }
  });
</script>

<div class="wrapper">
  <div class="verses-viewport">
  <!-- here load bibles verses as span -->
    {#each $bibleData.data as verse,i } 
    <div class="wrap-verse">
        <span class="ref-verse">{$abbreviationBooks[$bibleData.book]} {$bibleData.chapter}:{i+1}</span>
        <span class="verse">{verse}</span>
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
    margin-top:8rem;
  }
  .verses-viewport {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    height: 100%;
  }
  .ref-verse {
    color: blue;
    font-weight: 600;
  }

  .ref-verse:active {
    color: brown;
  }

  .spacer {
    height: 30rem;
  }
  .wrap-verse {
    float: left;
  }
</style>