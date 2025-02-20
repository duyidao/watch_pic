export interface FileItem {
  name: string;
  kind: string;
  parentName: string;
  file?: File; // 添加 `file` 属性的定义
  children?: Array<FileItem>;
}