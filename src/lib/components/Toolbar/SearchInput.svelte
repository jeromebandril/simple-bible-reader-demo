<script lang="ts">
  import {isDarkMode,openBibles,booksNames, searchResult} from '../../../store'
  import type {BibleRef, Data} from '../../../myInterfaces'

  let bibleUsed = $openBibles.kjv;
  let bibleBooks = $booksNames;
  let prompt: string;


  const mySearchResult: Record<string,()=>Data> = {
    'string': () => {
      const temp: BibleRef[] = [];
      let thisPrompt: string = prompt.slice(1);
      thisPrompt = thisPrompt.replace(/\s+/g,' '); //replace all unecessary spaces (maybe typos)
      const keyWords: string[] = thisPrompt.split("-");
      
      for (let b = 0; b < bibleUsed.length; b++) {
        for (let c = 0; c < bibleUsed[b].length; c++) {
          for (let v = 0; v < bibleUsed[b][c].length; v++) {
            let verse: string = bibleUsed[b][c][v].replace(/[^a-zA-Z0-9\s]/g,'');
            if (verse.toLowerCase().includes(keyWords[0].toLowerCase())) {
              temp.push({
                book: b,
                chapter: c,
                verse: v
              })
            }
            if (temp.length === 500) throw new Error("Too vague");
          }
        }
      }

      const recursive = (index: number, keyWords: string[], temp: BibleRef[]): BibleRef[] => {
        if (index >= keyWords.length) return temp;
        
        const shrinkSearch: BibleRef[] = [];
        temp.forEach(ref => {
          let verse = bibleUsed[ref.book][ref.chapter][ref.verse].replace(/[^a-zA-Z0-9\s]/g,'');
          
          if (verse.toLowerCase().includes(keyWords[index].toLowerCase().trim())) {
            shrinkSearch.push ({
              book:    ref.book,
              chapter: ref.chapter,
              verse:   ref.verse
            })
          }
        });
        
        return recursive(index+1,keyWords,shrinkSearch)
      }
      
      let newResult = recursive(1,keyWords,temp);
      //build response
      return {
        results: newResult,
        selectedVerse: 0,
        status: {
          code: 0,
          message: "ok"
        }
      }
    },

    'default' : () => {
      let resultBook    : number;
      let resultChapter : number;
      let resultVerse   : number;

      // Divide prompt into two: book reference and chapter+verse
      const rawResult   = prompt.match(/(.*[a-zA-Z]\s*)(.*)/);
      const rawBook     = rawResult && rawResult[1];
      const rawChapVer  = rawResult && rawResult[2];
      
      if (rawBook === null || rawChapVer === null) 
        throw Error('no characters or too short');
      
      // Clean string and distinguish book, chapter and verse
      const cleanedBook = rawBook.replace(/[\s\W]/g, ''); //remove all spaces and special characters 

      // Construct the prompt book better
      // if book contains digits (e.g. 1 john, 1 peter, 1 samuel etc...) add space in between
      const promptBook = (/\d/.test(cleanedBook)) ? cleanedBook.replace(/(\d)([a-zA-Z])/g, '$1 $2') : cleanedBook;
      const promptDigits: string[] | null= rawChapVer.match(/\d+/g) || []; //collect all digits into array
      // If verse is not specified, go to verse 1
      if (promptDigits.length < 2) promptDigits.push('1');

      // Get index of the book
      let isMatch = false;
      let i = 0;
      while (!isMatch && i < bibleBooks.length) {
        if (bibleBooks[i].toLowerCase().includes(promptBook.toLowerCase())) {
          isMatch = !isMatch;
        } else {
          i++;
        }
      }

      // final results
      resultBook    = i;
      resultChapter = parseInt(promptDigits[0], 10) - 1;
      resultVerse   = parseInt(promptDigits[1], 10) - 1; 
      
      //check if reference is valid
      if (!(
        bibleUsed[resultBook] && 
        bibleUsed[resultBook][resultChapter] && 
        bibleUsed[resultBook][resultChapter][resultVerse]
        )) throw new Error("reference doesn't exist");
      
      // get all verses of the chapter
      const temp: BibleRef[] = [];
      for (let i = 0; i < bibleUsed[resultBook][resultChapter].length; i++) {
        temp.push({
          book:    resultBook,
          chapter: resultChapter,
          verse:   i,
        })
      }

      // build response
      return {
        results: temp,
        selectedVerse: resultVerse,
        status: {
          code: 0,
          message: "ok"
        }
      }
    }
  }


  function process(prompt: string): void {
    if (typeof prompt === 'undefined') return;

    const keyCommand: string = prompt.charAt(0);
    let result: Data;
    
    try {
      switch (keyCommand) {
        case '$': result = mySearchResult['string'](); break;
        default: result = mySearchResult['default'](); break;
      }
      searchResult.set(result)
    } catch (error: any) {
      searchResult.set({
        results: [],
        selectedVerse: 0,
        status: {
          code: 1,
          message: error as string
        }
      })
            
    }
  } 

  function activateShortcuts (evt: KeyboardEvent) {
    if (evt.repeat) 
      return;
    if (evt.ctrlKey && evt.key === 'l') 
      document.querySelector('input')!.focus(); 
    if (evt.ctrlKey && evt.altKey && evt.key === 'l') 
      prompt = ''
  }
</script>

<svelte:window on:keydown={activateShortcuts}/>
<form>
  <input bind:value={prompt} type="text" placeholder="Search" class:darkmode={$isDarkMode}>
  <button on:click={()=>{process(prompt)}} class:darkmode={$isDarkMode}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="m9 13.887l5-5V8.18l-5-5l-.707.707l4.146 4.147H2v1h10.44L8.292 13.18l.707.707z" clip-rule="evenodd"/></svg>
  </button>
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
  input.darkmode{
    background: var(--dark-secondary-color);
    color: var(--tertiary-color);
  }
</style>