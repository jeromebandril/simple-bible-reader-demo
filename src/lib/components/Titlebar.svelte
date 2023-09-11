<script lang="ts">
  import { appWindow } from "@tauri-apps/api/window";
  import { isDarkMode } from "../../store";
  import smyrnaIcon from "$lib/images/32x32.png"
  import { onMount } from "svelte";


  let isMaximized: boolean;
  onMount(async () => {
    isMaximized = await appWindow.isMaximized();
    console.log(isMaximized);
  });

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="titlebar" class:darkmode={$isDarkMode}>
  <div data-tauri-drag-region="" class="drag-area"></div>
  <div class="titlebar-icon-wrapper">
    <img src={smyrnaIcon} height={16} alt="icon">
    <span>Smyrna Bible</span>
  </div>
  <div class="titlebar-buttons" class:darkmode={$isDarkMode}>
    <div on:click={appWindow.minimize} id="titlebar-minimize">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M14 8v1H3V8h11z"/></svg>
    </div>
    <div on:click={appWindow.toggleMaximize} id="titlebar-maximize">
        {#if isMaximized}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M3 5v9h9V5H3zm8 8H4V6h7v7z"/><path fill-rule="evenodd" d="M5 5h1V4h7v7h-1v1h2V3H5v2z" clip-rule="evenodd"/></g></svg>
        {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M3 3v10h10V3H3zm9 9H4V4h8v8z"/></svg>
        {/if}
    </div>
    <div on:click={appWindow.close} id="titlebar-close">
      <svg xmlns="http://www.w3.org/2000/svg" stroke-width="1" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884L7.116 8z" clip-rule="evenodd"/></svg>
    </div>
  </div>
</div>


<style>
  .titlebar {
    min-height: 30px;
    background: var(--secondary-color);
    user-select: none;
    display: flex;
    justify-content: space-between;
    z-index: 9999;
  }
  .titlebar.darkmode{
    background: var(--dark-primary-color);
    color: var(--tertiary-color);
  }

  .drag-area {
    position: absolute;
    top: 4px;
    width: calc(100% - 150px);
    border-radius: 20px;
    left: 4px;
    height: 24px;
  }

  .titlebar-icon-wrapper {
    height: 32px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }

  .titlebar-buttons {
    display: flex;
  }
  .titlebar-buttons > div {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 100%;
  }
  .titlebar-buttons > div:hover {
    transition: 150ms;
    background: lightgray;
  }
  .titlebar-buttons.darkmode > div:hover {
    background: darkslategray
  }
  #titlebar-close:hover {
    transition: 150ms;
    color: white;
    background: red;
  }
</style>