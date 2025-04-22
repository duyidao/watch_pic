import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import type { FileItem } from '@/types/index.ts'
import ipFile from "./ip.ts";
import {
  getFiles,
  fileList,
  imgType,
  handleDirectory,
  imgInfo,
  imgTypeSet,
  findText,
  showIndex,
} from "./common.ts";

const { findDeviceIp } = ipFile();

const imgTypeList = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

export default () => {
  /**
   * 打开目录选择器，并输出选中的目录信息
   *
   * @returns 无返回值
   */
  async function openDirectory() {
    imgTypeSet.value = new Set(); // 重置图片类型集合
    findText.value = '';
    imgType.value = '';
    showIndex.value = 0;
    message.loading({ content: '正在加载中...', key: 'openDirectory', duration: 0 });
    const directorys = await (window as any).showDirectoryPicker();
    fileList.value = await handleDirectory(directorys.entries());
    message.success({ content: '加载完成', key: 'openDirectory', duration: 2 });
  }

  const choseDirectory = ref<boolean>(false); // 是否选择了目录
  const choseIpDirectory = ref<boolean>(false); // 是否选择了IP目录

  /**
   * 下载当前显示的图片到默认文件夹
   */
  const downloadNotDirectory = () => {
    if (!downloadImgList.value.length) {
      message.warn("请先选择图片");
    }
    downloadImgList.value.forEach((item: any) => {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(item.file!);
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      message.success(`图片下载成功`);
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }, 0);
    });
  };

  const createDirectory = {
    handle: async () => {
      handle.value = await (window as any).showDirectoryPicker({
        mode: "readwrite",
        startIn: "downloads",
      });
    },
    dir: async () => {
      dir.value = imgType.value
        ? await handle.value!.getDirectoryHandle(imgType.value, {
            create: true,
          })
        : handle.value;
    },
    ipDir: async (parentName: string) => {
      ipDir.value = await dir.value!.getDirectoryHandle(parentName, {
        create: true,
      });
      const deviceId = imgInfo.value.name.split("_")[1];
      const ip = findDeviceIp(parentName, deviceId);
      if (deviceId && ip) {
        // deviceId-ip文件夹
        deviceIdDir.value = await ipDir.value.getDirectoryHandle(
          `${deviceId}-${ip}`,
          {
            create: true,
          }
        );
      }
    },
  };

  const handle = ref<FileSystemDirectoryHandle>();
  const dir = ref<FileSystemDirectoryHandle>();
  const ipDir = ref<FileSystemDirectoryHandle>();
  const deviceIdDir = ref<FileSystemDirectoryHandle>();
  const downloadImgList = ref<FileItem[]>([]);
  /**
   * 获取用户选择的下载目录路径
   *
   * @returns 返回用户选择的下载目录路径的 Promise 对象
   */
  const downloadDirectory = async () => {
    try {
      // 请求用户选择保存位置
      !handle.value && (await createDirectory.handle());

      // 写入文件内容
      !dir.value && (await createDirectory.dir());

      const parentName =
        imgInfo.value.parentName.split(",")[
          imgInfo.value.parentName.split(",").length - 1
        ];
      // ip文件夹
      choseIpDirectory.value && (await createDirectory.ipDir(parentName));

      const downloadDir = deviceIdDir.value || ipDir.value || dir.value;

      downloadImgList.value.forEach(async (item) => {
        const fileHandle = await downloadDir!.getFileHandle(item.name, {
          create: true,
        });
        const writable = await fileHandle.createWritable();
        const buffer = await fileAndBlobToArrayBuffer(item.file!);
        await writable.write(buffer);
        await writable.close();
      });
      message.success(`图片${downloadImgList.value[0].name.split(".")[0]}下载成功`);
      } catch (err) {
      message.error(`图片下载发生错误：${err}`);
    }
  };

  function fileAndBlobToArrayBuffer(file: File): Promise<ArrayBuffer> {
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
    handle.value = undefined;
    dir.value = undefined;
    message.info("已清空目录");
  };

  /**
   * 下载图片的函数
   *
   * 如果未选择目录，则调用 downloadNotDirectory 函数；
   * 否则，调用 downloadDirectory 函数。
   */
  const downloadImgFn = () => {
    const imgName = imgInfo.value.name.split(".")[0];
    downloadImgList.value = [];

    const imgData = imgTypeList.map((item) => imgName + item);

    imgData.forEach((item) => {
      downloadImgList.value.push(...getFiles(undefined, item));
    });

    if (!choseDirectory.value) {
      downloadNotDirectory();
    } else {
      downloadDirectory();
    }
  };

  watch(
    () => imgType.value,
    () => {
      dir.value = undefined;
    }
  );

  return {
    imgType,
    choseDirectory,
    choseIpDirectory,
    openDirectory,
    downloadImgFn,
    clearDownloadDirFn,
  };
};
