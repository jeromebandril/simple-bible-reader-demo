<script lang="ts">
  import Bibleview from "./Bibleview.svelte";
  import Bible from "./Bible.svelte";
  import { openBibles } from "../../../store";
</script>


<div class="display">
  <!-- default view -->
  <Bibleview isSplitResolved={true}>
    <Bible slot="split-1"/>
    <Bible slot="split-2"/>
  </Bibleview>
  <!-- split screen -->
  <!-- <Bibleview isSplitResolved={true}/> -->
</div>

<style>
  .display {
    display: flex;
    flex-direction: row;
  }
</style>