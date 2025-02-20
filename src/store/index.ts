import { ref, watchEffect } from 'vue';
import { extractChinese } from '@/utils/index';
import type { FileItem } from '@/types/index'

const whiteNameList = ['.DS_Store']; // 白名单，不显示这些文件和目录

export default () => {
  const fileList = ref<FileItem[]>([]) // 完整目录数据
  
  const imgTypeSet = ref<Set<string>>(new Set()) // 图片类型集合

  /**
   * 文件类型过滤器函数
   *
   * @param item 文件项
   * @returns 无返回值
   */
  const imgTypeFilter = (item: FileItem) => {
    let name = extractChinese(item.name)
    if (imgTypeSet.value.has(name)) return
    imgTypeSet.value.add(name)
  }

  /**
   * 异步处理目录的函数
   *
   * @param handle 一个异步生成器，生成目录项
   * @param parentName 父目录名称
   * @returns 包含所有目录和文件的列表
   */
  const handleDirectory = async (handle: any, parentName?: string) => {
    const list = [];
    for await (const directory of handle) {
      if (whiteNameList.includes(directory[0])) continue

      let name: string = ''
      if (directory[1].kind === 'directory') name = parentName ? `${parentName},${directory[0]}` : directory[0]

      let obj: FileItem = {
        name: directory[0],
        kind: directory[1].kind,
        parentName: (directory[1].kind === 'file' ? parentName : name) as string,
      }

      if (directory[1].kind === 'file') {
        imgTypeFilter(obj)
        obj!.file = await directory[1].getFile()
      }
      else {
        obj!.children = await handleDirectory(directory[1].entries(), name)
      }

      list.push(obj)
    }
    return list
  }

  /**
   * 打开目录选择器，并输出选中的目录信息
   *
   * @returns 无返回值
   */
  const openDirectory = async () => {
    const directorys = await (window as any).showDirectoryPicker()
    fileList.value = await handleDirectory(directorys.entries())
  }

  const findText = ref<string>('jpg') // 图片标题过滤
  const imgType = ref<string>('')
  const imgList = ref<{ name: string, parentName: string, kind: string, file?: File }[]>([]) // 全图片数组

  /**
   * 过滤图片文件列表
   *
   * @param list 文件列表，默认为 fileList.value
   * @returns 过滤后的图片文件列表
   */
  const filterImgFn = (list = fileList.value) => {
    if (!list.length) return;
    for (const item of list) {
      if (item.kind === "directory") {
        filterImgFn(item.children)
      }
      else {
        if (item.name.includes(findText.value) && (imgType.value === '' || extractChinese(item.name) === imgType.value)) imgList.value.push(item)
      }
    }
  }

  /**
   * 操作图片函数
   */
  const showIndex = ref<number>(0)
  // 定义一个函数，用于显示上一张图片
  const prevImgFn = () => {
    showIndex.value -= 1
    // 将当前显示的图片索引减1，并取最小值，防止小于0
    showIndex.value = Math.max(Math.min(imgList.value.length - 1, 0), showIndex.value)
  }
  // 定义一个函数，用于显示下一张图片
  const nextImgFn = () => {
    showIndex.value += 1
    // 将当前显示的图片索引加1，并取最大值，防止超出图片列表长度
    showIndex.value = Math.min(Math.max(imgList.value.length - 1, 0), showIndex.value)
  }

  watchEffect(() => {
    imgList.value = [];
    showIndex.value = 0;
    filterImgFn();
  })

  return {
    imgList, fileList, showIndex,
    findText, imgTypeSet, imgType,
    openDirectory,
    prevImgFn, nextImgFn,
  }
}