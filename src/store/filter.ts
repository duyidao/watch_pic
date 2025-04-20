import { watchEffect } from "vue";
import { message } from "ant-design-vue";
import {
  getFiles,
  fileList,
  findText,
  showIndex,
  imgList,
  imgInfo,
} from "./common.ts";

export default () => {
  /**
   * 操作图片函数
   */
  // 定义一个函数，用于显示上一张图片
  const prevImgFn = () => {
    showIndex.value -= 1;
    // 将当前显示的图片索引减1，并取最小值，防止小于0
    showIndex.value = Math.max(
      Math.min(imgList.value.length - 1, 0),
      showIndex.value
    );

    if (showIndex.value === 0) message.info("已经是第一张图片了");
  };
  // 定义一个函数，用于显示下一张图片
  const nextImgFn = () => {
    showIndex.value += 1;
    // 将当前显示的图片索引加1，并取最大值，防止超出图片列表长度
    showIndex.value = Math.min(
      Math.max(imgList.value.length - 1, 0),
      showIndex.value
    );

    if (showIndex.value === imgList.value.length - 1)
      message.info("已经是最后一张图片了");
  };

  watchEffect(() => {
    imgList.value = [];
    showIndex.value = 0;
    imgList.value = getFiles(fileList.value);
  });

  return {
    imgList,
    showIndex,
    findText,
    imgInfo,
    prevImgFn,
    nextImgFn,
  };
};
