import { ref } from "vue";

const whiteNameList = [".DS_Store"]; // 白名单，不显示这些文件和目录

export default () => {
  const ipFileList = ref<any>({}); // 完整ip目录数据

  const handleIPDirectory: any = async (handle: any) => {
    const list = []; // 存放目录数据的数组
    for await (const directory of handle) {
      if (whiteNameList.includes(directory[0])) continue;
console.log(directory, handle);

      if (directory[1].kind === "directory") {
        const children = await handleIPDirectory(directory[1].entries())
        console.log("children", children);
        list.push({
          name: directory[0],
          children,
        });
      } else {
        console.log("file", directory);

        const file = await directory[1].getFile();
        console.log(file, file.text());
        list.push({
          name: directory[0],
          handle: directory[1],
          config: JSON.parse(await file.text()),
        });
      }
    }

    return list;
  };

  /**
   * 打开目录选择器，并输出选中的目录信息
   *
   * @returns 无返回值
   */
  const openIPDirectory = async () => {
    const directorys = await (window as any).showDirectoryPicker();
    console.log(directorys);
    
    const code = await handleIPDirectory(directorys.entries());

    ipFileList.value = code.reduce((acc: any, item: any) => {
      // console.log(acc, item);
      acc[item.name] = item.children[0]?.config;
      return acc;
    }, {});
    localStorage.setItem("ipFileList", JSON.stringify(ipFileList.value));
  };

  function findDeviceIp(parentName: string, deviceId: string) {
    const configJson = ipFileList.value[parentName];
    if (!configJson) {
      return "";
    }
    return (
      configJson.cameraInfos.find((item: any) => item.deviceId === deviceId)
        ?.deviceIp || ""
    );
  }

  return {
    ipFileList,
    openIPDirectory,
    findDeviceIp,
  };
};
