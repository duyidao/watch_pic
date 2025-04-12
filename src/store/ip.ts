import { ref } from 'vue';

const whiteNameList = ['.DS_Store']; // 白名单，不显示这些文件和目录

export default () => {
  const ipFileList = ref<any[]>([]) // 完整ip目录数据

  const handleIPDirectory: any = async (handle: any) => {
    const list = []; // 存放目录数据的数组
    for await (const directory of handle) {
      if (whiteNameList.includes(directory[0])) continue
  
      if (directory[1].kind === 'directory') {
        list.push({
          name: directory[0],
          children: await handleIPDirectory(directory[1].entries())
        })
      }
      else {
        const file = await directory[1].getFile()
        list.push({
          name: directory[0],
          handle: directory[1],
          config: JSON.parse(await file.text())
        })
      }
    }

    return list
  }

  /**
   * 打开目录选择器，并输出选中的目录信息
   *
   * @returns 无返回值
   */
  const openIPDirectory = async () => {
    const directorys = await (window as any).showDirectoryPicker()
    const code = await handleIPDirectory(directorys.entries())

    ipFileList.value = code.reduce((acc: any, item: any) => {
      acc[item.name] = item.children[0].config;
      return acc;
    }, {});
    localStorage.setItem('ipFileList', JSON.stringify(ipFileList.value))
  }

  return {
    ipFileList,
    openIPDirectory
  }
}