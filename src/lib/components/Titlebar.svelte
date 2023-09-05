<script>
  import { appWindow  } from "@tauri-apps/api/window";
  import smyrnaIcon from "$lib/images/32x32.png"

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="titlebar">
  <div data-tauri-drag-region="" class="drag-area"></div>
  <div class="titlebar-icon-wrapper">
    <img src={smyrnaIcon} height={16} alt="icon">
    <span>Smyrna Bible</span>
  </div>
  <div class="titlebar-buttons">
    <div on:click={appWindow.minimize} id="titlebar-minimize">
      <img
        src="https://api.iconify.design/mdi:window-minimize.svg"
        alt="minimize"
      />
    </div>
    <div on:click={appWindow.toggleMaximize} id="titlebar-maximize">
      <img
        src="https://api.iconify.design/mdi:window-maximize.svg"
        alt="maximize"
      />
    </div>
    <div on:click={appWindow.close} id="titlebar-close">
      <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
    </div>
  </div>
</div>


<style>

  .drag-area {
    position: absolute;
    top: 4px;
    width: calc(100% - 100px);
    border-radius: 20px;
    left: 4px;
    height: 24px;
  }
.titlebar {
  height: 30px;
  background: white;
  user-select: none;
  display: flex;
  justify-content: space-between;
}

.titlebar-icon-wrapper {
  height: 32px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  margin-left: 10px;
}

.title {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.titlebar-buttons > div {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 100%;
}

.titlebar-buttons > div:hover {
  transition: 300ms;
  background: lightgray;
}

#titlebar-close:hover {
  transition: 300ms;
  background: red;
}

</style>