<script context="module" lang="ts">
  import { writable, type Writable } from 'svelte/store';

  const focusedId = writable(1);
  let id = 1;
</script>

<script lang="ts">
  import {isFullscreen, openBibles, searchResult, shortBooksNames, selectPanelMode, isDarkMode, isManuallyScrolling} from '../../../store';
  import Scrollbar from '../Scrollbar.svelte';
  import { getContext } from 'svelte';
  export let sources: any = [$openBibles.kjv];

  // OPTIONS //
  const MAX_ZOOM_OUT: number = 0.5;
  const MAX_ZOOM_IN: number = 4;
  const DEFAULT_FONT_SIZE: number = 25;
  const DEFAULT_SCALE: number = 1;

  // VARIABLES
  const componentId = id++;
  let currentScale = DEFAULT_SCALE;
  $: fontSize = DEFAULT_FONT_SIZE * currentScale;
  let thisResult = writable($searchResult);
  $: thisSelVerse = $thisResult.selectedVerse;
  let versesTable: HTMLElement;
  let wrapper: HTMLElement;
  let scrollableContainer: HTMLElement;
  
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
        if (thisSelVerse > 0){
          thisSelVerse -= 1
          newSelected = versesTable.querySelector('.selected')!.previousSibling as HTMLElement
        }
        break;
    
      case 'ArrowRight':
        if (thisSelVerse < $thisResult.results.length - 1) {
          thisSelVerse += 1;
          newSelected = versesTable.querySelector('.selected')!.nextSibling as HTMLElement
        }
        break;
    }
    
    if (newSelected) {
      const containerBound = wrapper.getBoundingClientRect();
      const targetBounds = newSelected.getBoundingClientRect();
      if (targetBounds.top < containerBound.top || targetBounds.bottom > containerBound.bottom) scrollToVerse(wrapper,{listen_target:null,behavior: 'auto',block: 'center'})
    }
  } 
  function highlightVerse (evt: MouseEvent) {
    const element = evt.currentTarget as HTMLDivElement;
    thisSelVerse = parseInt(element.id);
  }
  function shortcuts (evt: KeyboardEvent) {
    if(evt.repeat) 
      return;
    if (evt.ctrlKey && evt.key===componentId.toString()) 
      focusThis()
  }
  function focusThis () {
    if (versesTable) {
      versesTable.focus();
      $focusedId = componentId;
    }
  }
  function updateResult (searchResult: any) {
    if (componentId === $focusedId) {
      $thisResult = searchResult;
      thisSelVerse = $thisResult.selectedVerse
      focusThis()
    }
  }
  $: updateResult($searchResult)
</script>

<svelte:window on:keydown={shortcuts}/>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:wheel={zoom} on:click={focusThis} class="wrapper" class:fullscreen={$isFullscreen} class:select-panel-mode={$selectPanelMode} style="font-size: {fontSize}px;" bind:this={wrapper}>
  {#if componentId === $focusedId}
    <div class="marker"/>
  {/if}
  {#if $thisResult.status.code === 0}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <!-- svelte-ignore a11y-positive-tabindex -->
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div bind:this={scrollableContainer} class="verses-viewport" class:darkmode={$isDarkMode} class:smooth={$isManuallyScrolling}>
      <table tabindex="1" on:keydown={moveTruVerses} use:scrollToVerse={{listen_target: $thisResult.selectedVerse, behavior: 'auto', block: 'start'}} bind:this={versesTable} class="verses-table">
        {#each $thisResult.results as res, i}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <tr on:click={highlightVerse} id={String(i)} class:selected={i === thisSelVerse} class:darkmode={$isDarkMode}>
            {#each sources as source }
            <td>
              <span class="ref-verse" class:darkmode={$isDarkMode}>{$shortBooksNames[res.book]} {res.chapter+1}:{res.verse+1}</span>
              <span class="verse">{source[res.book][res.chapter][res.verse]}</span>
            </td>
            {/each}
          </tr>
        {/each}
        <div class="spacer"/>
      </table>
    </div>
    {#if versesTable && scrollableContainer}
      <Scrollbar {scrollableContainer} content={versesTable}/>
    {/if}
  {:else}
    <div>
      {$thisResult.status.message}
    </div>
  {/if}
</div>

<style>
  /** wrapper */
  .wrapper {
    height: calc(100vh - 4rem - 2rem + 0.5px);
    width: calc(100% - 10px);
    padding-left: 10px;
    border-right: 1px solid black;
    position: relative;
  }
  .wrapper:hover {
    --scrollbar-init-opacity: 1;
  }
  .wrapper.fullscreen {
    height: calc(100vh - 4rem);
  }

  /** verses viewport*/
  .verses-viewport {
    height: 100%;
    overflow: scroll;
    width: 100%;
    scroll-behavior: smooth;
    box-sizing: border-box;
    position: relative;
  }
  .verses-viewport.smooth {
    scroll-behavior:unset;
  }
  .verses-viewport .spacer {
    min-height: 20rem;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  /* .verses-viewport::-webkit-scrollbar {
    visibility: hidden;
    background: none;
    border-left: 1px solid lightgray;
    z-index: 100;
    transition: visibility 0.3 ease;
  }
  .verses-viewport::-webkit-scrollbar-thumb {
    background: rgba(30, 30, 30,10%);
    visibility: hidden;
    transition: visibility 1 ease;
  }
  .verses-viewport::-webkit-scrollbar-thumb:hover {
    background: rgba(30, 30, 30,30%);
  }
  .verses-viewport.darkmode::-webkit-scrollbar {
    border-left: 1px solid rgb(0, 0, 0);
  }
  .verses-viewport.darkmode::-webkit-scrollbar-thumb {
    background: rgba(47, 47, 47,100%);
  }
  .verses-viewport:hover::-webkit-scrollbar,
  .verses-viewport:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  } */

  /* verses table */
  .verses-table {
    height: 100%;
    border-spacing: 0 1rem;
    outline: none;
  }

  .verses-table td {
    vertical-align: top;
    text-align: left;
  }

  .verses-table .ref-verse {
    color: blue;
    font-weight: 600;
  }
  .verses-table .ref-verse.darkmode {
    color: yellow;
  }
  .verses-table .selected {
    color: brown;
  }

  .verses-table .selected.darkmode {
    color: lightskyblue;
  }

  /** others */
  .select-panel-mode:hover {
    filter: brightness(90%);
  }
  .marker {
    position: absolute;
    left: calc(50% - 20%);
    border-top: 2px solid blue;
    height: 10px;
    width: 40%;
  }
</style>