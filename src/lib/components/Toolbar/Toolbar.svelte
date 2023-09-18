<script lang="ts">
  import SearchInput from './SearchInput.svelte';
  import {isDarkMode,split} from '../../../store' 


  function splitDisplay () {
    if (!$split.isResolved) return;
    if ($split.count < 4) $split.count += 1;
    $split.isResolved = false;
  }

</script>

<div class="toolbar" class:darkmode={$isDarkMode}>
  <div>
    <SearchInput/>
  </div>
  <!-- <input type="checkbox">
  <label for="">presentation mode</label> -->
  <div>
    <button on:click={splitDisplay} class:darkmode={$isDarkMode}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zM8 13H3V2h5v11zm6 0H9V2h5v11z"/></svg>
      &nbsp {$split.count}
    </button>
    <button on:click={() => {isDarkMode.set(!$isDarkMode); console.log($isDarkMode)}} class:darkmode={$isDarkMode}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path fill="currentColor" d="M10 3a7 7 0 1 1 0 14V3Zm0-1a8 8 0 1 0 0 16a8 8 0 0 0 0-16Z"/></svg>
      &nbsp switch theme
    </button>
  </div>
</div>

<style>
  .toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
    height: 4rem;
    width: calc(100% -20px);
    align-items: center;
    top: 0;
    background: white;
    padding: 0 10px;
    background: var(--secondary-color);
  }
  .toolbar > div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }
  .toolbar.darkmode{
    background: var(--dark-primary-color);
    color: var(--tertiary-color);
  }
</style>