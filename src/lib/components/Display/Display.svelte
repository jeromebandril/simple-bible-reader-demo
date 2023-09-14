<script lang="ts">
  import Bibleview from "./Bibleview.svelte";
  import Bible from "./Bible.svelte";
  import { openBibles } from "../../../store";

  let sources = [$openBibles.kjv,$openBibles.ita];
</script>


<div class="display">
  <!-- default view -->
  <Bibleview {sources} isSplitResolved={true}/>
</div>

<style>
  .display {
    display: flex;
    flex-direction: row;
  }
</style>