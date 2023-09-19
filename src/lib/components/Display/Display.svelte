<script lang="ts">
  /**
   * TODO: 
   * - make panels resizable
  */
  import Bibleview from "./Bibleview.svelte";
  import Divider from "./Divider.svelte";
  import { openBibles,split,selectPanelMode, isDarkMode } from "../../../store";

  let sources = [$openBibles.kjv,$openBibles.ita];
  let splitCount = $split.count;

  function addBibleview () {
    splitCount++;
    $split.isResolved = true;
  }

  function addParallel () {
    $selectPanelMode=true;
    //make parallel bible to select panel
  }

</script>

<div class="display" class:darkmode={$isDarkMode}>
  {#each {length: splitCount }  as _,i}
    <Bibleview/>
    {#if splitCount > 1 && i < splitCount-1}
      <Divider/>
    {/if}
  {/each }
  {#if !$split.isResolved}
    <div class="split-menu">
      {#if !$selectPanelMode} 
        <button on:click={addParallel}>parallel</button>
        <button on:click={addBibleview}>independent</button>
      {:else}
        <div>
          select which one
        </div>
      {/if}
      <!-- <div class="options">
        <div>
          <input type="radio">
          <label for="">kjv english</label>
        </div>
        <div>
          <input type="radio">
          <label for="">Giovanni Diodati italian</label>
        </div>
      </div> -->
    </div>
  {/if}
  
</div>

<style>
  .display {
    display: flex;
    flex-direction: row;
    background: var(--tertiary-color);
  }
  .display.darkmode {
    background-color: var(--dark-secondary-color);
    color: var(--tertiary-color);
  }
  .split-menu {
    width: 100%;
    height: calc(100vh - 4rem - 2rem + .5px);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .split-menu button {
    border: 1px solid black;
  }
</style>