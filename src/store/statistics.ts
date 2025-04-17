import { ref } from "vue";

const whiteNameList = [".DS_Store"]; // 白名单，不显示这些文件和目录

export default () => {
  const totalData = ref<any>({}); // 完整ip目录数据
  const showModal = ref<boolean>(false); // 是否显示弹窗
  const imgSearchList = ['施工区域', '火焰烟雾', '道路遗撒', 'roi偏移', '异常停车', '道路遗撒', '占用应急车道', '交通事故', '交通拥堵'];

  const handleIPDirectory: any = async (
    handle: any,
    parentName: string = ""
  ) => {
    for await (const directory of handle) {
      if (whiteNameList.includes(directory[0])) continue;

      if (directory[1].kind === "directory") {
        const name = imgSearchList.includes(directory[0]) ? directory[0] : parentName;
        await handleIPDirectory(directory[1].entries(), name);
        if (imgSearchList.includes(directory[0]) && !totalData.value[directory[0]]) {
          totalData.value[directory[0]] = {
            total: 0,
            children: {},
          }
        }
      } else {
        const ipCameraName = `${directory[0].split("_")[0]}_${directory[0].split("_")[1]}`;
        if (directory[0].split('.').at(-1) !== 'jpg') continue;
        
        totalData.value[parentName] = {
          ...totalData.value[parentName],
          total: totalData.value[parentName]?.total + 1 || 1,
          children: {
            ...totalData.value[parentName]?.children,
            [ipCameraName]: totalData.value[parentName]?.children?.[ipCameraName] + 1 || 1, 
          },
        }
      }
    }
  };

  /**
   * 打开目录选择器，并输出选中的目录信息
   *
   * @returns 无返回值
   */
  const statisticsTotalFn = async () => {
    totalData.value = {};
    const directorys = await (window as any).showDirectoryPicker();
    await handleIPDirectory(directorys.entries());
    showModal.value = true;
    console.log("-------------", totalData.value);
  };

  return {
    totalData,
    showModal,
    statisticsTotalFn,
  };
};
