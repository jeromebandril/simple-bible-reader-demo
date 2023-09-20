<script lang="ts">
  import SearchInput from './SearchInput.svelte';
  import {isDarkMode,isFullscreen,split} from '../../../store' 
  import {appWindow} from '@tauri-apps/api/window'


  function splitDisplay () {
    if (!$split.isResolved) return;
    if ($split.count >= 4)  return;
    $split.isResolved = false;
  }

  function setFullscreen () {
    appWindow.isFullscreen().then((it)=>{
      appWindow.isMaximized().then((isMaxi)=>{
        if (!it && isMaxi) {
         appWindow.toggleMaximize(); 
        } 
        appWindow.setFullscreen(!it);
        $isFullscreen = !it;
        appWindow.setResizable(it)
        })
    })
  }

</script>

<div class="toolbar" class:darkmode={$isDarkMode}>
  <div>
    <SearchInput/>
  </div>
  <!-- <input type="checkbox">
  <label for="">presentation mode</label> -->
  <div>
    <button on:click={setFullscreen} class:darkmode={$isDarkMode}>
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M3 12h10V4H3v8zm2-6h6v4H5V6zM2 6H1V2.5l.5-.5H5v1H2v3zm13-3.5V6h-1V3h-3V2h3.5l.5.5zM14 10h1v3.5l-.5.5H11v-1h3v-3zM2 13h3v1H1.5l-.5-.5V10h1v3z"/></svg>
      <span>&nbsp full screen </span>
    </button>
    <button on:click={splitDisplay} class:darkmode={$isDarkMode}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M14 1H3L2 2v11l1 1h11l1-1V2l-1-1zM8 13H3V2h5v11zm6 0H9V2h5v11z"/></svg>
      <span>&nbsp {$split.count}</span>
    </button>
    <button on:click={() => {isDarkMode.set(!$isDarkMode); console.log($isDarkMode)}} class:darkmode={$isDarkMode}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path fill="currentColor" d="M10 3a7 7 0 1 1 0 14V3Zm0-1a8 8 0 1 0 0 16a8 8 0 0 0 0-16Z"/></svg>
      <span>&nbsp switch theme</span>
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
    align-items: cente;
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
  span {
    vertical-align: middle;
  }
  .toolbar.darkmode{
    background: var(--dark-primary-color);
    color: var(--tertiary-color);
  }
</style>