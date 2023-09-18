<script lang="ts">
  /**
   * TODO: 
   * - make panels resizable
  */
  import Bibleview from "./Bibleview.svelte";
  import { openBibles,split,selectPanelMode } from "../../../store";

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

<div class="display">
  {#each {length: splitCount }  as _}
    <Bibleview/>
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