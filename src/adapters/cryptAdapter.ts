export interface EncodeData {
  content: string;
}

export interface CompareData {
  content: string;
  contentEncoded: string;
}

export interface ToSHA256 {
  content: string;
}

export interface CryptAdapter {
  hash: ({ content }: EncodeData) => Promise<string>;
  compare: ({ content, contentEncoded }: CompareData) => Promise<boolean>;
}
