<script setup lang="ts">
import { computed } from 'vue';
import type { ImgInfo } from '@/types/index'

const props = defineProps<{
  openDirectory: () => void,
  downloadImgFn: () => void,
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
      <span>第{{ showIndex + 1 }}张 / 共{{ totalLength }}张</span>
      <div v-for="item in imgInfo.parentName.split(',')">
        <span>{{ item }}</span>
      </div>
      <span>
        图片名称：{{ imgInfo.name }}
      </span>
    </div>
    <div class="header-tool">
      <button @click="openDirectory">打开文件夹</button>
      <input :value="findText"
        type="text"
        placeholder="请输入精确搜索的关键词"
        @change="changeTextFn" />
      <select :value="imgType"
        name="imgType"
        id=""
        @change="changeImgType">
        <option value="">全部</option>
        <option v-for="item in imgTypeOptions"
          :key="item"
          :value="item">{{ item }}</option>
      </select>
      <button>重新选择要保存的文件夹</button>
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

    div {
      margin: 0 15px;
    }
  }

  .header-tool {
    display: flex;
    align-items: center;
    margin: 15px 0;

    button {
      height: 30px;
      border-radius: 8px;
      margin-right: 20px;
      padding: 0 20px;
    }

    input {
      min-width: 180px;
      height: 30px;
      margin-right: 20px;
      padding-left: 12px;
      border: 1px solid #ccc;
    }

    select {
      min-width: 180px;
      height: 30px;
      margin-right: 20px;
      padding-left: 12px;
      border: 1px solid #ccc;

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