<script lang="ts">
  /**
   * TODO: 
   * - make indipendent searchResult for each bibleView
   * - make panels resizable
  */
  import Bibleview from "./Bibleview.svelte";
  import { openBibles,split,selectPanelMode } from "../../../store";

  let sources = [$openBibles.kjv];
  let splitCount = 0;

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
  {#each {length: splitCount + 1}  as _, i}
    <Bibleview idb={i+1}/>
  {/each }
  {#if !$split.isResolved}
    <div class="split-menu">
      <button on:click={addParallel}>parallel</button>
      <button on:click={addBibleview}>independent</button>
      <div class="options">
        <div>
          <input type="radio">
          <label for="">kjv english</label>
        </div>
        <div>
          <input type="radio">
          <label for="">Giovanni Diodati italian</label>
        </div>
      </div>
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
    border: 1px solid black;
    gap: 10px;
  }
  .split-menu button {
    border: 1px solid black;
  }
</style>