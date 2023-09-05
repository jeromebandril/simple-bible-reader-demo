<script>
  import BibleChooser from './BibleChooser.svelte';
  import SearchInput from './SearchInput.svelte';

  let isCtrlDown = false;
  let isLDown = false; 

  function onBind(){
    console.log("yoooooooo");
    document.querySelector('input').focus();
  }

  function onKeyPress (evt) {
    if (evt.repeat) return;
    switch (evt.key) {
      case 'Control':
          isCtrlDown = true;
        break;
      case 'l':
          isLDown = true;
        break;
    }
    if (isCtrlDown && isLDown) {
      //onBind();
    }

  }
</script>

<svelte:window on:keydown={onKeyPress}/>
<div class="toolbar">
  <SearchInput/>
  <input type="checkbox">
  <label for="">presentation mode</label>
  <BibleChooser/>
</div>

<style>
  .toolbar {
    display: flex;
    flex-direction: row;
    height: 4rem;
    width: calc(100% -20px);
    align-items: center;
    top: 0;
    background: white;
    padding: 0 10px;
  }
</style>