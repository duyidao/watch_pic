import { ref, computed, ComputedRef } from "vue";
import { extractChinese } from "@/utils/index";
import type { FileItem, ImgInfo, fileItem } from "@/types/index";

export const fileList = ref<FileItem[]>([]); // 完整目录数据
export const imgType = ref<string>(""); // 图片类型过滤（火焰烟雾、道路遗撒等）
export const findText = ref<string>(""); // 图片标题过滤（jpg、名称等）
export const imgTypeSet = ref<Set<string>>(new Set()); // 图片类型集合

export const imgList = ref<FileItem[]>([]); // 全图片数组
export const showIndex = ref<number>(0);

export const imgInfo: ComputedRef<ImgInfo> = computed(() => {
  return {
    file: imgList.value?.[showIndex.value]?.file || null,
    src: !!imgList.value?.length
      ? URL.createObjectURL(imgList.value[showIndex.value].file as Blob)
      : "",
    name: imgList.value?.[showIndex.value]?.name || "暂无图片",
    parentName: imgList.value?.[showIndex.value]?.parentName || "暂无信息",
  };
});

const whiteNameList: string[] = [".DS_Store"]; // 白名单，不显示这些文件和目录

const imgTypeFilter = (item: FileItem) => {
  let name = extractChinese(item.name);
  if (imgTypeSet.value.has(name)) return;
  imgTypeSet.value.add(name);
};

const handleDirectoryChose = {
  directory: async (
    list: FileItem[],
    directory: fileItem,
    parentName: string,
    _: any
  ) => {
    const name: string = parentName
      ? `${parentName},${directory[0]}`
      : directory[0]!;
    list.push({
      name: directory[0]!,
      kind: directory[1]!.kind,
      parentName: name,
      children: await handleDirectory(directory[1]!.entries(), name),
    });
  },
  file: async (
    list: FileItem[],
    directory: fileItem,
    parentName: string,
    toJSON?: boolean
  ) => {
    const file = await directory[1]!.getFile();
    let obj: any = {
      name: directory[0],
      kind: directory[1]!.kind,
      parentName,
      file,
    };
    if (!toJSON) imgTypeFilter(obj);
    else obj.config = JSON.parse(await directory[1]!.text());
    list.push(obj);
  },
};

export async function handleDirectory(
  handle: any,
  parentName?: string,
  toJSON?: boolean
) {
  const directoryList = ref<FileItem[]>([]);

  for await (const directory of handle) {
    if (whiteNameList.includes(directory[0])) continue;
    // 为确保 directory[1].kind 类型安全，添加类型断言
    handleDirectoryChose[directory[1].kind as "directory" | "file"](
      directoryList.value,
      directory,
      parentName!,
      toJSON
    );
  }

  return directoryList.value; // 返回处理后的目录列表
}

/**
 * 过滤出所有符合条件的的图片列表用于展示渲染
 *
 * @param list 文件列表，默认为 fileList.value
 * @returns 过滤后的图片文件列表
 */
export const getFiles: any = (
  list: FileItem[] = fileList.value,
  filterText: string = ""
) => {
  if (!list.length) return [];

  const data = []; // 存放符合条件的图片文件
  for (const item of list) {
    if (item.kind === "directory") {
      data.push(...getFiles(item.children, filterText));
    } else {
      if (filterText && item.name === filterText) data.push(item);
      else if (
        !filterText &&
        item.name.includes(findText.value) &&
        (imgType.value === "" || extractChinese(item.name) === imgType.value)
      )
        data.push(item);
    }
  }

  return data;
};
