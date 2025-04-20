export interface FileItem {
  name: string;
  kind: string;
  parentName: string;
  file?: File; // 添加 `file` 属性的定义
  children?: Array<FileItem>;
  config?: string;
}

export interface ImgInfo {
  name: string;
  src: string;
  file: File | null;
  parentName: string;
}

interface FileSystemDirectoryHandle {
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  kind: "directory";
  name: string;
  getFile(): Promise<File>;
  text(): Promise<string>;
}

export type fileItem = [string?, FileSystemDirectoryHandle?];
