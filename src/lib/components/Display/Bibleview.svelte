<script lang="ts">
  import { getContext, setContext } from 'svelte';
  import {isDarkMode, searchResult} from '../../../store';
  import { writable } from 'svelte/store';
  export let isSplitResolved = false;

  // OPTIONS //
  const MAX_ZOOM_OUT: number = 0.5;
  const MAX_ZOOM_IN: number = 4;
  const DEFAULT_FONT_SIZE: number = 25;
  const DEFAULT_SCALE: number = 1;

  // VARIABLES
  let currentScale = DEFAULT_SCALE;
  $: fontSize = DEFAULT_FONT_SIZE * currentScale;
  let thisResult = searchResult;
  let thisSelVerse = writable($searchResult.selectedVerse);

  // CONTEXTS
  setContext('result', thisResult);
  setContext('selVerse',thisSelVerse)
  
  // FUNCTIONS
  interface ScrollOptions {
    listen_target: any,
    behavior: string,
    block: string
  }
  function scrollToVerse (node: Element, options: ScrollOptions) {
    const update = () => {
      const item = node.querySelector('.selected');
      if (item)
        item.scrollIntoView({ 
          behavior: options.behavior as ScrollBehavior,
          block: options.block as ScrollLogicalPosition 
        });  
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
      if (currentScale < MAX_ZOOM_OUT) {
        currentScale = MAX_ZOOM_OUT;
      } else if (currentScale > MAX_ZOOM_IN) {
        currentScale = MAX_ZOOM_IN;
      }
    }
  }
  function moveTruVerses (evt: KeyboardEvent) {
    if(evt.repeat) return;

    let newSelected: HTMLElement | null = null;
    switch (evt.key) {
      case 'ArrowLeft':
        if ($thisSelVerse > 0){
          $thisSelVerse -= 1
          //newSelected = document.querySelector('.selected')!.previousSibling as HTMLElement
        }
        break;
    
      case 'ArrowRight':
        if ($thisSelVerse < $thisResult.results.length - 1) {
          $thisSelVerse += 1;
          //newSelected = document.querySelector('.selected')!.nextSibling as HTMLElement
        }
        break;
    }
    
    // note: temp disabled  
    // description: scroll automatically when next select is out of view
    // if (newSelected) {
    //   const container = document.querySelector('.wrapper');
    //   const containerBound = container!.getBoundingClientRect();
    //   const targetBounds = newSelected.getBoundingClientRect();
    //   if (targetBounds.top < containerBound.top || targetBounds.bottom > containerBound.bottom) scrollToVerse(container!,{listen_target:null,behavior: 'auto',block: 'center'})
    // }
  } 
</script>

<svelte:window on:keydown={moveTruVerses}/>
<div on:wheel={zoom} class="wrapper" class:darkmode={$isDarkMode} style="font-size: {fontSize}px;">
  {#if !isSplitResolved}
    <button>ciao</button>
  {:else if $searchResult.status.code === 0}
    <div use:scrollToVerse={{listen_target: $searchResult.selectedVerse, behavior: 'auto', block: 'start'}} id="container">
      <slot name="split-1"/>
      <slot name="split-2"/>
    </div>
  {:else}
    <div>
      {$searchResult.status.message}
    </div>
  {/if} 
</div>

<style>
  #container {
    display: flex;
    flex-direction: row;
    overflow-y: auto;
  }
  .wrapper {
    height: calc(100vh - 4rem - 2rem + .5px);
    width: calc(100% - 10px);
    padding-left: 10px;
    background: var(--tertiary-color);
  }
  .wrapper.darkmode {
    background-color: var(--dark-primary-color);
    color: var(--tertiary-color);
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>