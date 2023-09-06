<script lang="ts">
  import {openBibles,booksNames, searchResult} from '../../../store'
  import type {BibleRef, MessageCode} from '../../../myInterfaces'

  let bibleUsed = $openBibles.kjv;
  let bibleBooks = $booksNames;
  let prompt: string;

  function searchBy(method: string, prompt: string) : void{
    try {
      // DATA //
      let results: BibleRef[] = [];
      let selectedVerse: number = 0;
      let status: MessageCode = {
        code: 0,
        message: ""
      };

      const mySearchResult: Record<string,any> = {
        'string': () => {
          mainloop: for (let b = 0; b < bibleUsed.length; b++) {
            for (let c = 0; c < bibleUsed[b].length; c++) {
              for (let v = 0; v < bibleUsed[b][c].length; v++) {
                let verse: string = bibleUsed[b][c][v];
                if (verse.toLowerCase().includes(prompt.toLowerCase())) {
                  results.push({
                    book: b,
                    chapter: c,
                    verse: v
                  })
                }
                if (results.length === 30) break mainloop;
              }
            }
          }
          status = {
            code: 0,
            message: "ok"
          }
          return {results,selectedVerse,status} 
        },

        'reference' : () => {
          // Divide prompt into two pieces: book reference and chapter/verse
          const matchResult = prompt.match(/(.*[a-zA-Z]\s*)(.*)/);
          const matchBook = matchResult && matchResult[1];
          const matchChapVer = matchResult && matchResult[2];
          if (matchResult === null || matchBook === null || matchChapVer === null) throw Error;
          // Parse the prompt and get book, chapter, verse
          let promptBook = matchBook.replace(/\s/g, '');
          const nums: string[] = matchChapVer.match(/\d+/g) || [];
          // Construct the prompt book better
          if (/\d/.test(promptBook)) {
            const firstPart = promptBook.match(/(\d+)(\w+)?|(\w+)/);
            if (firstPart === null) throw Error;
            promptBook = (firstPart[1] || '') + ' ' + (firstPart[2] || '');
          } else {
            promptBook = (promptBook.match(/[a-zA-Z]+/) || [''])[0];
          }
          // If verse is not specified, go to verse 1
          if (nums.length < 2) {
            nums.push('1');
          }
          // Get index of the book
          let selBook: number = 0;
          for (let i = 0; i < bibleBooks.length; i++) {
            if (bibleBooks[i].toLowerCase().includes(promptBook.toLowerCase())) {
              selBook = i;
              break;
            }
          }

          const selChapter = parseInt(nums[0], 10) - 1;
          const selVerse = parseInt(nums[1], 10) - 1; 

          console.log("why?");

          selectedVerse = selVerse;
          status = {
            code: 0,
            message: "ok"
          }
          for (let i = 0; i < bibleUsed[selBook][selChapter].length; i++) {
            results.push({
              book: selBook,
              chapter: selChapter,
              verse: i,
            })
          }
          return {results,selectedVerse,status}
        }
      }

      searchResult.set(mySearchResult[method]());
    } catch (error) {
      console.log(error);
    }
  }
  
  function process(prompt: string): void {
    let method : string = 'reference'
    if (prompt.startsWith('$')) {
      method = 'string'
      
    }
    prompt = prompt.slice(1);
    searchBy(method,prompt)
  } 
</script>

<form>
  <input bind:value={prompt} type="text" placeholder="Search">
  <button on:click={()=>{process(prompt)}}>go</button>
</form>
  
<style>
  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.2rem;
  }

  input {
    background: var(--tertiary-color);
    padding-left: 10px;
    border: none;
    outline: none;
    border-radius: var(--border-radius);
    min-width: 300px;
  }
</style>