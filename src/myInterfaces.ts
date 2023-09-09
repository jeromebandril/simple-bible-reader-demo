export interface BibleRef {
  book: number;
  chapter: number;
  verse: number;
}

export interface MessageCode {
  code: number;
  message: string;
}

export interface Data {
  results: BibleRef[];
  selectedVerse: number;
  status: MessageCode;
}
