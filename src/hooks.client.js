import { invoke } from '@tauri-apps/api/tauri';
import { bible } from '../src/store';

const resourcePath = '\\smyrna.bible.v2\\src-tauri\\assets\\data\\kjv-english.json';

invoke('read_bible_source', { filePath: resourcePath })
  .then((content) => {
    // temp solution parsing with js instead of callind commnad
    let kjvBible = JSON.parse(content);
    // doesn't work fix struct Data
    // invoke('load_bible', { content: content })
    //   .then((parsedBible) => (kjvBible = parsedBible))
    //   .catch((error) => console.log(error));
    console.log('ciaone');
    bible.set(kjvBible);
    kjvBible = null;
  })
  .catch((error) => console.log(error));
