export interface FileSystemDirectoryHandleItem {
  kind: 'directory' | 'file';
  name: string;
  expanded?: boolean;
  children?: FileSystemDirectoryHandleItem[];
  getFile?: () => Promise<FileSystemFileHandle>;
}

export interface FileSystemDirectoryHandleData {
  kind: 'directory' | 'file';
  name: string;
  expanded?: boolean;
  children?: FileSystemDirectoryHandleItem[];
  keys?: () => AsyncIterableIterator<FileSystemHandle>;
  entries?: () => AsyncIterableIterator<[string, FileSystemHandle]>;
  values?: () => AsyncIterableIterator<FileSystemHandle>;
  getFile?: () => Promise<FileSystemFileHandle>;
}
