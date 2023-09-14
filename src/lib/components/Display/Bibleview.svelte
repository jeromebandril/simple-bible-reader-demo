<script lang="ts">
  import { setContext } from 'svelte';
  import {isDarkMode, searchResult, shortBooksNames} from '../../../store';
  import { writable } from 'svelte/store';
  export let isSplitResolved = false;
  export let sources: any;

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
  function highlightVerse (evt: MouseEvent) {
    const element = evt.currentTarget as HTMLDivElement;
    $thisSelVerse = parseInt(element.id);
  }
</script>

<svelte:window on:keydown={moveTruVerses}/>
<div on:wheel={zoom} class="wrapper" class:darkmode={$isDarkMode} style="font-size: {fontSize}px;">
  {#if !isSplitResolved}
    <button>ciao</button>
  {:else if $searchResult.status.code === 0}
    <table use:scrollToVerse={{listen_target: $searchResult.selectedVerse, behavior: 'auto', block: 'start'}} class="verses-viewport">
      {#each $searchResult.results as res, i}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <tr on:click={highlightVerse} id={String(i)} class:selected={i === $thisSelVerse}>
          {#each sources as source }
          <td>
            <span class="ref-verse" class:darkmode={$isDarkMode}>{$shortBooksNames[res.book]} {res.chapter+1}:{res.verse+1}</span>
            <span class="verse">{source[res.book][res.chapter][res.verse]}</span>
          </td>
          {/each}
        </tr>
      {/each}
    </table>
    <div class="spacer"/>
  {:else}
    <div>
      {$searchResult.status.message}
    </div>
  {/if} 
</div>

<style>
  .wrapper {
    height: calc(100vh - 4rem - 2rem + .5px);
    width: calc(100% - 10px);
    padding-left: 10px;
    background: var(--tertiary-color);
    overflow: auto;
  }
  .wrapper.darkmode {
    background-color: var(--dark-primary-color);
    color: var(--tertiary-color);
  }

  .verses-viewport{
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 4rem);
    scroll-behavior: smooth;
    overflow-y: auto;
  }
  td {
    vertical-align: top;
    text-align: left;
    padding-right: 10px;
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

  ::-webkit-scrollbar {
    display: block;
  }
</style>