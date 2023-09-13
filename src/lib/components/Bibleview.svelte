<script lang="ts">
  import {isDarkMode,openBibles,searchResult, shortBooksNames} from '../../store'
  
  // OPTIONS //
  const MAX_ZOOM_OUT: number = 0.5;
  const MAX_ZOOM_IN: number = 4;
  const DEFAULT_FONT_SIZE: number = 25;
  const DEFAULT_SCALE: number = 1;

  let currentScale = DEFAULT_SCALE;
  $: fontSize = DEFAULT_FONT_SIZE * currentScale;
  $: currentBible = $openBibles.kjv;
  $: results = $searchResult.results
  $: selectedVerse = $searchResult.selectedVerse;


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
        if (selectedVerse > 0){
          selectedVerse -= 1
          newSelected = document.querySelector('.selected')!.previousSibling as HTMLElement
        }
        break;
    
      case 'ArrowRight':
        if (selectedVerse < results.length - 1) {
          selectedVerse += 1;
          newSelected = document.querySelector('.selected')!.nextSibling as HTMLElement
        }
        break;
    }
    
    if (newSelected) {
      const container = document.querySelector('.wrapper');
      const containerBound = container!.getBoundingClientRect();
      const targetBounds = newSelected.getBoundingClientRect();
      if (targetBounds.top < containerBound.top || targetBounds.bottom > containerBound.bottom) scrollToVerse(container!,{listen_target:null,behavior: 'auto',block: 'center'})
    }
  } 

  function highlightVerse (evt: MouseEvent) {
    const element = evt.currentTarget as HTMLDivElement;
    selectedVerse = parseInt(element.id);
  }

</script>

<div></div>
<svelte:window on:keydown={moveTruVerses}/>
<div on:wheel={zoom} class="wrapper" class:darkmode={$isDarkMode} style="font-size: {fontSize}px;">
  {#if $searchResult.status.code === 0}
    <div use:scrollToVerse={{listen_target: $searchResult.selectedVerse, behavior: 'auto', block: 'start'}} id="container" class="verses-viewport">
      {#each results as res, i} 
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={highlightVerse} id={String(i)} class:selected={i === selectedVerse} class="wrap-verse">
          <span class="ref-verse" class:darkmode={$isDarkMode}>{$shortBooksNames[res.book]} {res.chapter+1}:{res.verse+1}</span>
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
    height: calc(100vh - 4rem - 2rem + .5px);
    width: calc(100% - 10px);
    padding-left: 10px;
    background: var(--tertiary-color);
  }
  .wrapper.darkmode {
    background-color: var(--dark-primary-color);
    color: var(--tertiary-color);
  }

  .verses-viewport {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    max-height: calc(100vh - 4rem);
    scroll-behavior: smooth;
  }

  .verses-viewport > div {
    margin-top: 2rem;
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
  .wrap-verse {
    float: left;
  }

  ::-webkit-scrollbar {
    display: none;
  }
</style>