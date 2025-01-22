import { ref } from 'vue'
import type { FileSystemDirectoryHandleData } from '@/types';

export const root = ref<FileSystemDirectoryHandleData[]>([] as FileSystemDirectoryHandleData[])

const blackList = ['.DS_Store', '.vscode']

/**
 * 异步处理文件或文件夹句柄。
 *
 * @param handle 文件或文件夹句柄，类型为 FileSystemDirectoryHandleData 或 FileSystemDirectoryHandleItem。
 * @returns 返回处理后的文件或文件夹句柄。
 */
async function processHandle(handle: FileSystemDirectoryHandleData) {
  // 添加判断，终止递归，返回文件
  if(handle.kind === 'file') {
    return handle
  }
  
  // 设置文件夹的子文件
  handle.children = []
  const iter = await handle!.entries!() // 获取文件夹中所有内容
  for await (const info of iter) {
    if (blackList.includes(info[1].name)) continue // 如果文件名在黑名单中，跳过

    const subHandle = await processHandle(info[1] as FileSystemDirectoryHandleData) // 返回的是一个数组，返回的内容格式如上所述。通过递归的思想一直获取文件夹内的内容
    handle.children.push(subHandle)
  }
  
  return handle
}

// 导出一个异步函数，用于显示目录选择器
export const showDirectoryPickerFn = async () => {
  try {
    // @ts-ignore
    // 调用showDirectoryPicker函数，获取文件系统目录句柄
    const handle: FileSystemDirectoryHandleData = await showDirectoryPicker()
    // 将获取到的句柄传递给processHandle函数，处理句柄
    const data = await processHandle(handle)
    root.value = data.children!
    // 打印处理后的句柄
  } catch (err) {
    // 捕获错误并打印
    console.log('err', err);
  }
}

export default {
  root,
  showDirectoryPickerFn
}