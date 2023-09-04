<script>
  import {openBibles, booksNames, bibleData} from '../store'

  let bibleUsed = $openBibles;
  let bibleBooks = $booksNames;
  let prompt = "";

  // TODO: handle errors and exceptions
  function search(prompt) {
    try {
      // Divide prompt into two pieces: book reference and chapter/verse
      const matchResult = prompt.match(/(.*[a-zA-Z]\s*)(.*)/);
      const matchBook = matchResult && matchResult[1];
      const matchChapVer = matchResult && matchResult[2];
      // Parse the prompt and get book, chapter, verse
      let promptBook = matchBook.replace(/\s/g, '');
      const nums = matchChapVer.match(/\d+/g) || [];
      // Construct the prompt book better
      if (/\d/.test(promptBook)) {
        const firstPart = promptBook.match(/(\d+)(\w+)?|(\w+)/);
        promptBook = (firstPart[1] || '') + ' ' + (firstPart[2] || '');
      } else {
        promptBook = (promptBook.match(/[a-zA-Z]+/) || [''])[0];
      }
      // If verse is not specified, go to verse 1
      if (nums.length < 2) {
        nums.push('1');
      }
      // Get index of the book
      let selBook = null;
      for (let i = 0; i < bibleBooks.length; i++) {
        if (bibleBooks[i].toLowerCase().includes(promptBook.toLowerCase())) {
          selBook = i;
          break;
        }
      }

      const selChapter = parseInt(nums[0], 10);
      const selVerse = parseInt(nums[1], 10);
      const allVerses = bibleUsed[selBook][selChapter-1];

      if (allVerses === undefined) throw error;
      if (allVerses[selVerse-1] === undefined) throw error;

      bibleData.set({
        book: selBook,
        chapter: selChapter,
        verse: selVerse,
        allVerses: allVerses,
        error: {code: 0,message:""}
      })
    } catch (error) {
      bibleData.set({
        error: {code: 1,message:"Not a valid reference"}
      })
    }
  }

</script>

<div class="toolbar">
  <form class="search-input">
    <label for="">search</label>
    <input bind:value={prompt} type="text">
    <button on:click={search(prompt)}>go</button>
  </form>
  <input type="checkbox">
  <label for="">presentation mode</label>
</div>

<style>
  .toolbar {
    display: flex;
    flex-direction: row;
    height: 4rem;
    width: 100%;
    align-items: center;
    top: 0;
    background: white;
  }
  .search-input {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.2rem;
  }
</style>