<script setup lang="ts">
import { computed } from 'vue';
import type { ImgInfo } from '@/types/index'

const props = defineProps<{
  openDirectory: () => void,
  downloadImgFn: () => void,
  clearDownloadDirFn: () => void,
  openIPDirectory: () => void,
  imgTypeSet: Set<string>,
  imgType: string,
  findText: string,
  showIndex: number,
  totalLength: number,
  imgInfo: ImgInfo,
  choseDirectory: boolean,
  choseIpDirectory: boolean,
}>()

const emits = defineEmits(['update:imgType', 'update:findText', 'update:choseDirectory', 'update:choseIpDirectory']);

const imgTypeOptions = computed(() => {
  return Array.from(props.imgTypeSet);
});

/**
 * 修改图片类型的事件处理函数
 *
 * @param e 事件对象
 */
const changeImgType = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  emits('update:imgType', target.value);
};

/**
 * 修改文本的函数
 *
 * @param e 事件对象
 */
const changeTextFn = (e: Event) => {
  const target = e.target as HTMLInputElement;
  emits('update:findText', target.value);
};

const changeCkeckFn = (e: Event, type: 'choseDirectory' | 'choseIpDirectory') => {
  const target = e.target as HTMLInputElement;
  emits(`update:${type}`, target.checked);
};
</script>

<template>
  <header>
    <div class="header-total">
      <span class="img-index">第{{ showIndex + 1 }}张 / 共{{ totalLength }}张</span>
      <span class="img-name" :text="imgInfo.name">
        名称：{{ imgInfo.name }}
      </span>
    </div>
    <div class="header-tool">
      <button @click="openDirectory">选取文件夹</button>
      <span>图片格式：</span>
      <input :value="findText"
        type="text"
        placeholder="请输入精确搜索的关键词"
        @change="changeTextFn" />
      <span>图片类型：</span>
      <select :value="imgType"
        name="imgType"
        id=""
        @change="changeImgType">
        <option value="">全部</option>
        <option v-for="item in imgTypeOptions"
          :key="item"
          :value="item">{{ item }}</option>
      </select>
      <button @click="openIPDirectory">关联IP</button>
      <button @click="clearDownloadDirFn">重新指定保存路径</button>
      <button @click="downloadImgFn">下载图片</button>
    </div>
    <div class="header-download">
      <label for="folder">
        <input :value="choseDirectory"
          type="checkbox"
          name="folder"
          id="folder"
          @change="changeCkeckFn($event, 'choseDirectory')" />
        是否下载到指定文件夹
      </label>
      <label for="ip">
        <input :value="choseIpDirectory"
          type="checkbox"
          name="ip"
          id="ip"
          @change="changeCkeckFn($event, 'choseIpDirectory')" />
        是否携带ip目录
      </label>
    </div>
  </header>
</template>

<style lang="less" scoped>
header {
  padding: 20px;

  .header-total {
    display: flex;
    align-items: center;
    font-size: 20px;

    .img-index {
      position: relative;
      max-width: 180px;
      margin-right: 10px;
      padding-right: 13px;

      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0px;
        top: -2px;
        width: 2px;
        height: 25px;
        background-color: #555;
      }
    }

    .img-name {
      max-width: 84%;
      white-space: nowrap;/*禁止文本换行 */
      overflow: hidden;/* 隐藏超出范围的内容 */
      text-overflow: ellipsis;/* 使用省路号 */
    }
  }

  .header-tool {
    display: flex;
    align-items: center;
    height: 25px;
    margin: 15px 0;
    font-size: 14px;

    button {
      border-radius: 8px;
      margin-right: 20px;
      padding: 0 20px;
      height: 100%;
    }

    input {
      min-width: 180px;
      height: 100%;
      margin-right: 20px;
      padding-left: 12px;
      border: 1px solid #ccc;
      font-size: 14px;
    }

    select {
      min-width: 180px;
      height: 100%;
      margin-right: 20px;
      padding-left: 8px;
      border: 1px solid #ccc;
      font-size: 14px;

      &:focus-visible {
        outline: none;
      }
    }
  }

  .header-download {
    display: flex;
    align-items: center;

    label {
      margin-right: 20px;
      font-size: 14px;
      display: flex;
      align-items: center;

      input {
        margin-right: 8px;
      }
    }
  }
}
</style>