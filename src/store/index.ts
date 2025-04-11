import { ref, watch, watchEffect, computed, ComputedRef } from 'vue';
import { extractChinese } from '@/utils/index';
import { ipFileList } from './ip.ts';
import type { FileItem, ImgInfo } from '@/types/index'

const whiteNameList = ['.DS_Store']; // 白名单，不显示这些文件和目录
const imgTypeList = ['.jpg', '.jpeg', '.png', '.webp']

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

  const findText = ref<string>('jpg') // 图片标题过滤（jpg、名称等）
  const imgType = ref<string>('') // 图片类型过滤（火焰烟雾、道路遗撒等）
  const imgList = ref<{ name: string, parentName: string, kind: string, file?: File }[]>([]) // 全图片数组
  const imgInfo: ComputedRef<ImgInfo> = computed(() => {
    return {
      file: imgList.value?.[showIndex.value]?.file || null,
      src: !!imgList.value?.length ? URL.createObjectURL(imgList.value[showIndex.value].file as Blob) : '',
      name: imgList.value?.[showIndex.value]?.name || '暂无图片',
      parentName: imgList.value?.[showIndex.value]?.parentName || '暂无信息',
    }
  })

  /**
   * 过滤出所有符合条件的的图片列表用于展示渲染
   *
   * @param list 文件列表，默认为 fileList.value
   * @returns 过滤后的图片文件列表
   */
  const getFiles = (list = fileList.value, filterText = '') => {
    if (!list.length) return [];

    const data = []; // 存放符合条件的图片文件
    for (const item of list) {
      if (item.kind === "directory") {
        data.push(...getFiles(item.children))
      }
      else {
        if (item.name.includes(findText.value) && (imgType.value === '' || extractChinese(item.name) === imgType.value)) data.push(item)
      }
    }

    return data
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

  const choseDirectory = ref(false) // 是否选择了目录
  const choseIpDirectory = ref(false) // 是否选择了IP目录

  /**
   * 下载当前显示的图片到默认文件夹
   */
  const downloadNotDirectory = () => {
    let a = document.createElement('a');
    a.href = URL.createObjectURL(imgList.value[showIndex.value].file!);
    a.download = imgList.value[showIndex.value].name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    }, 0);
  }


  const handle: any = ref(null);
  const dir: any = ref(null);
  const downloadImgList = ref([]);
  /**
   * 获取用户选择的下载目录路径
   *
   * @returns 返回用户选择的下载目录路径的 Promise 对象
   */
  const getDownloadDir = () => {
    const options = {
      mode: 'readwrite',
      startIn: 'downloads',
    };
    return (window as any).showDirectoryPicker(options);
  };
  const downloadDirectory = async () => {

    try {
      if (!handle.value) {
        // 请求用户选择保存位置
        handle.value = await getDownloadDir();
      }
      
      if (!dir.value) {
        // 写入文件内容
        dir.value = imgType.value ? await handle.value!.getDirectoryHandle(imgType.value, {create: true}) : handle.value;
      }

      const fileHandle = await dir.value!.getFileHandle(imgInfo.value.name, {create: true});
      const writable = await fileHandle.createWritable();
      const buffer = await fileAndBlobToArrayBuffer(imgInfo.value.file!);
      await writable.write(buffer);

      await writable.close();
    } catch (err) {
      console.error('用户取消或发生错误:', err);
    }
  }
  function fileAndBlobToArrayBuffer(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let arraybuffer: ArrayBuffer;
      reader.onload = function () {
        arraybuffer = reader.result as ArrayBuffer;
      };
      reader.onerror = function (error) {
          reject(error);
      };
      reader.onloadend = function () {
        resolve(arraybuffer);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // 清掉记忆的要保存的handle和dir，重新选择目录
  const clearDownloadDirFn = () => {
    handle.value = null;
    dir.value = null;
  }

  /**
   * 下载图片的函数
   *
   * 如果未选择目录，则调用 downloadNotDirectory 函数；
   * 否则，调用 downloadDirectory 函数。
   */
  const downloadImgFn = () => {
    const imgName = imgInfo.value.name.split('.')[0];
    const imgData = imgTypeList.map(item => imgName + item);
    console.log('imgData', imgData);
    downloadImgList.value = getFiles(_, imgData)
    console.log('downloadImgList.value', downloadImgList.value);
    return
    if (!choseDirectory.value) {
      downloadNotDirectory();
    }
    else {
      downloadDirectory();
    }
  }

  watchEffect(() => {
    imgList.value = [];
    showIndex.value = 0;
    imgList.value = getFiles();
  })

  watch(() => imgType.value, async (newVal) => {
    dir.value = newVal ? await handle.value!.getDirectoryHandle(imgType.value, {create: true}) : handle.value;
  })

  return {
    imgList, fileList, showIndex,
    findText, imgTypeSet, imgType, imgInfo,
    choseDirectory, choseIpDirectory,
    openDirectory,
    prevImgFn, nextImgFn, downloadImgFn, clearDownloadDirFn,
  }
}