<script lang="ts">
  /**
   * TODO: 
   * - make panels resizable
  */
  import Bibleview from "./Bibleview.svelte";
  import Divider from "./Divider.svelte";
  import { openBibles,split, isDarkMode, focusedId } from "../../../store";
  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/tauri";

  onMount(async()=>{
    const resourcePath: string = '\\smyrna\\src-tauri\\assets\\data\\bibles\\english\\kjv-english.json';
    const italianBible: string = '\\smyrna\\src-tauri\\assets\\data\\bibles\\italian\\giovanni-diodati.json';
    $openBibles.kjv = JSON.parse(await invoke('read_file', { filePath: resourcePath }))
    $openBibles.ita = JSON.parse(await invoke('read_file', { filePath: italianBible }))
  })

  $: sources = [
    [$openBibles.kjv],
    [$openBibles.ita]
  ];
  $: console.log(sources);
  
  let splitCount = $split.count;

  function addBibleview () {
    splitCount++;
    $split.isResolved = true;
  }

  function addParallel () {
    //make parallel bible to select panel
    let newSource = $openBibles.ita;
    sources[$focusedId-1] = [...sources[$focusedId-1],newSource]
    $split.isResolved = true;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="display" class:darkmode={$isDarkMode}>
  {#each {length: splitCount }  as _,i}
    <Bibleview sources={sources[i]}/>
    {#if splitCount > 1 && i < splitCount-1}
      <Divider/>
    {/if}
  {/each }
  {#if !$split.isResolved}
    <div class="split-menu"> 
        <button on:click={addParallel}>parallel</button>
        <button on:click={addBibleview}>independent</button>
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