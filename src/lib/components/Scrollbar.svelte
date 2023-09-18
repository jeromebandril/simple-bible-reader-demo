<script lang="ts">
  /**
   * TODO:
   * make visible when content overflows
   */
  export let scrollableContainer: HTMLElement;
  export let content: HTMLElement;
  
  let trackHeight: number;
  let thumbTop: number; 
  let thumbHeight: number;

  function positionThumb () {
    thumbHeight = (trackHeight*trackHeight) / content.offsetHeight;
    thumbTop = (scrollableContainer.scrollTop * trackHeight) / content.offsetHeight;
  }

  scrollableContainer.addEventListener('scroll',positionThumb);
</script>


<div class="track" bind:offsetHeight={trackHeight}>
  <div class="thumb" style="height: {thumbHeight}px; top: {thumbTop}px;"/>
</div>

<style>
  .track {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 1rem;
    background-color: transparent;
    border-left: 1px solid black;
  }
  .thumb {
    width: 100%;
    z-index: 100;
    position: absolute;
    right: 0;
    background: rgba(30, 30, 30, 20%)
  }
</style>