export interface FileSystemDirectoryHandleList {
  kind: 'directory' | 'file';
  name: string;
  children?: {
    kind: 'directory' | 'file';
    name: string;
  }[];
  keys(): AsyncIterableIterator<FileSystemHandle>;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  values(): AsyncIterableIterator<FileSystemHandle>;
}
