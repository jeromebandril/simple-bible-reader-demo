import { invoke } from '@tauri-apps/api/tauri';
import { writable, readable } from 'svelte/store';

const resourcePath = '\\smyrna.bible.v2\\src-tauri\\assets\\data\\kjv-english.json';
export const openBibles = readable(JSON.parse(await invoke('read_bible_source', { filePath: resourcePath })));
export const booksNames = readable(new Array('Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'));
export const shortBooksNames = readable(new Array('Gen', 'Exo', 'Lev', 'Num', 'Deu', 'Jos', 'Jdg', 'Rth', '1Sa', '2Sa', '1Ki', '2Ki', '1Ch', '2Ch', 'Ezr', 'Neh', 'Est', 'Job', 'Psa', 'Pro', 'Ecc', 'Son', 'Isa', 'Jer', 'Lam', 'Eze', 'Dan', 'Hos', 'Joe', 'Amo', 'Oba', 'Jon', 'Mic', 'Nah', 'Hab', 'Zep', 'Hag', 'Zec', 'Mal', 'Mat', 'Mar', 'Luk', 'Joh', 'Act', 'Rom', '1Co', '2Co', 'Gal', 'Eph', 'Phi', 'Col', '1Th', '2Th', '1Ti', '2Ti', 'Tit', 'Phm', 'Heb', 'Jam', '1Pe', '2Pe', '1Jo', '2Jo', '3Jo', 'Jud', 'Rev'));
export const bibleData = writable({
  book: 1,
  chapter: 1,
  verse: 1,
  allVerses: [],
  error: { code: 0, message: '' }
});
