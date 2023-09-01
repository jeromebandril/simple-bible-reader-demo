import { invoke } from '@tauri-apps/api/tauri';

const resourcePath = '\\smyrna.bible.v2\\src-tauri\\assets\\data\\kjv-english.json';

let kjvBible;

invoke('read_bible_source', { filePath: resourcePath })
  .then((content) => {
    // temp solution parsing with js instead of callind commnad
    kjvBible = JSON.parse(content);
    // doesn't work fix struct Data
    // invoke('load_bible', { content: content })
    //   .then((parsedBible) => (kjvBible = parsedBible))
    //   .catch((error) => console.log(error));
  })
  .catch((error) => console.log(error));
