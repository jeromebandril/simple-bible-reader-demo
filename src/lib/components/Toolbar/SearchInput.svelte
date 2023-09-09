<script lang="ts">
  import {openBibles,booksNames, searchResult} from '../../../store'
  import type {BibleRef, MessageCode} from '../../../myInterfaces'
  import { LogicalPosition } from '@tauri-apps/api/window';

  let bibleUsed = $openBibles.kjv;
  let bibleBooks = $booksNames;
  let prompt: string;


  /**
   * 
   * @param method
   * @param prompt
   * @returns void
   * @description 
   * search for bible references that matches the input "prompt". 
   * The searching can be process in two ways based on "method" value:
   * - string: accept a sentence as prompt
   * - reference: accept book, chapter and verse.
   * 
   * Each method builds a result matching "searchResult" data structure,
   * then "searchResult" value is set to that value.
   * The book, chapter and verse starts from 0.
   */
  function searchBy(method: string, prompt: string): void{
    let thisSearchResult = {
      results: [] as BibleRef[],
      selectedVerse: 0 as number,
      status: {
        code: 0,
        message: ""
      } as MessageCode
    }

    try {
      // DATA //
      const mySearchResult: Record<string,any> = {
        'string': () => {
          const temp: BibleRef[] = [];
          prompt = prompt.slice(1);
          prompt = prompt.replace(/\s+/g,' '); //replace all unecessary spaces (maybe typos)
          const keyWords: string[] = prompt.split("-");
          console.log(keyWords);
          
          mainloop: for (let b = 0; b < bibleUsed.length; b++) {
            for (let c = 0; c < bibleUsed[b].length; c++) {
              for (let v = 0; v < bibleUsed[b][c].length; v++) {
                let verse: string = bibleUsed[b][c][v];
                if (verse.toLowerCase().includes(keyWords[0].toLowerCase())) {
                  temp.push({
                    book: b,
                    chapter: c,
                    verse: v
                  })
                }
                if (temp.length === 30) break mainloop;
              }
            }
          }

          const recursive = (index: number, keyWords: string[], temp: BibleRef[]): BibleRef[] => {
            console.log(keyWords.length);
            console.log(temp);
            
            if (index >= keyWords.length) return temp;
            
            
            const shrinkSearch: BibleRef[] = [];
            temp.forEach(ref => {
              const verse = bibleUsed[ref.book][ref.chapter][ref.verse];
              
              if (verse.toLowerCase().includes(keyWords[index].toLowerCase())) {
                shrinkSearch.push ({
                  book: ref.book,
                  chapter: ref.chapter,
                  verse: ref.verse
                })
              }
            });
            console.log(shrinkSearch);
            
            return recursive(index+1,keyWords,shrinkSearch)
          }

          console.log("temp",temp);
          
          let newResult = recursive(1,keyWords,temp);
          //build response
          return thisSearchResult = {
            results: newResult,
            selectedVerse: 0,
            status: {
              code: 0,
              message: "ok"
            }
          }
        },

        'reference' : () => {
          let resultBook: number;
          let resultChapter: number;
          let resultVerse: number;

          // Divide prompt into two: book reference and chapter+verse
          const rawResult = prompt.match(/(.*[a-zA-Z]\s*)(.*)/);
          const rawBook = rawResult && rawResult[1];
          const rawChapVer = rawResult && rawResult[2];
          
          if (rawBook === null || rawChapVer === null) throw Error('no characters or too short');
          
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
          resultBook = i;
          resultChapter = parseInt(promptDigits[0], 10) - 1;
          resultVerse = parseInt(promptDigits[1], 10) - 1; 

          //check if reference is valid
          if (typeof bibleUsed[resultBook][resultChapter][resultVerse] === 'undefined') throw new Error("reference doesn't exist");

          // get all verses of the chapter
          const temp: BibleRef[] = [];
          for (let i = 0; i < bibleUsed[resultBook][resultChapter].length; i++) {
            temp.push({
              book: resultBook,
              chapter: resultChapter,
              verse: i,
            })
          }

          // build response
          return thisSearchResult = {
            results: temp,
            selectedVerse: resultVerse,
            status: {
              code: 0,
              message: "ok"
            }
          }
        }
      }
      searchResult.set(mySearchResult[method]());
    } catch (error: any) {
      searchResult.set({
        results: [],
        selectedVerse: 0,
        status: {
          code: 1,
          message:"Not a valid reference"
        }
      })
    }
  }
  
  function process(prompt: string): void {
    if (typeof prompt === 'undefined') return;

    const keyCommand: string = prompt.charAt(0);

    const redirect: Record<string,()=>void> = {
      '$': () => searchBy('string',prompt),
      'default': ()=> searchBy('reference',prompt)
    }
    
    const commnad = (redirect[keyCommand] || redirect['default']); 
    (commnad as () => void)()
  } 

  function activateShortcuts (evt: KeyboardEvent) {
    if (evt.repeat) return;
    if (evt.ctrlKey && evt.key === 'l') {
      document.querySelector('input')!.focus();
    }
  }
</script>

<svelte:window on:keydown={activateShortcuts}/>
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