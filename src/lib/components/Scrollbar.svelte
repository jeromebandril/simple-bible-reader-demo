<script lang="ts">
  import { isDarkMode, isManuallyScrolling } from "../../store";
  export let scrollableContainer: HTMLElement;
  export let content: HTMLElement;
  
  let trackHeight: number;
  let thumbTop: number; 
  let thumbHeight: number;
  let isDrag: boolean;
  let startY: number;


  function positionThumb () {
    thumbHeight = (trackHeight*trackHeight) / content.offsetHeight;
    thumbTop = (scrollableContainer.scrollTop * trackHeight) / content.offsetHeight;
    content.scrollTop = (thumbTop / trackHeight) * content.offsetHeight;
  }

  function startDrag (evt: MouseEvent) {
    isDrag = true;
    startY = evt.offsetY;
    scrollableContainer.removeEventListener('scroll',positionThumb);
    $isManuallyScrolling = true;
  }

  function stopDrag () {
    if (isDrag) {
      isDrag = false;
      scrollableContainer.addEventListener('scroll',positionThumb);
      $isManuallyScrolling = false;
    }
  }

  function thumbScroll (evt: MouseEvent) {
    if (!isDrag) return;
    thumbTop = evt.y - startY - 90; 
    if (thumbTop < 0) thumbTop = 0;
    if (thumbTop+thumbHeight > trackHeight) thumbTop = trackHeight - thumbHeight;
    scrollableContainer.scrollTop = (thumbTop * content.offsetHeight) / trackHeight;
  }

  scrollableContainer.addEventListener('scroll',positionThumb);
  scrollableContainer.addEventListener('mousemove',thumbScroll)
</script>

<svelte:window on:mouseup={stopDrag} on:mousemove={thumbScroll}/>
<div class="track" bind:offsetHeight={trackHeight} class:darkmode={$isDarkMode}>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:mousedown={startDrag} style="height: {thumbHeight}px; top: {thumbTop}px;"/>
</div>

<style>
  .track {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 3%;
    max-width: 1rem;
    background-color: transparent;
    border-left: 1px solid rgba(30, 30, 30, 80%);
    opacity: var(--scrollbar-init-opacity, 10%);
    transition: var(--transition, opacity 0.1s ease);
  }  
  .track > div {
    width: 100%;
    position: absolute;
    right: 0;
    background: rgba(30, 30, 30, 20%)
  }
  .track.darkmode {
    border-left: rgba(255, 255,255,100%);
  }
  .track.darkmode > div {
    background: rgba(50, 50, 50, 80%);
  }
</style>