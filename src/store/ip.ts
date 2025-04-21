import { ref } from "vue";
import { handleDirectory } from "./common.ts";

export default () => {
  const ipFileList = ref<any>({}); // 完整ip目录数据

  if (localStorage.getItem("ipFileList")) {
    ipFileList.value = JSON.parse(localStorage.getItem("ipFileList")!);
  }

  /**
   * 打开目录选择器，并输出选中的目录信息
   *
   * @returns 无返回值
   */
  const openIPDirectory = async () => {
    ipFileList.value = {};
    const directorys = await (window as any).showDirectoryPicker();

    const code = await handleDirectory(directorys.entries(), undefined, true);

    ipFileList.value = code.reduce((acc: any, item: any) => {
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
