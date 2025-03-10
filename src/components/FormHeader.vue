<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  openDirectory: () => void,
  imgTypeSet: Set<string>,
  imgType: string,
  findText: string,
  showIndex: number,
  totalLength: number,
  imgName: string,
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
      <span>
        图片名称：{{ imgName }}
      </span>
    </div>
    <div class="header-tool">
      <button @click="openDirectory">打开文件夹</button>
      <input
        :value="findText"
        type="text"
        placeholder="请输入精确搜索的关键词"
        @change="changeTextFn"
      />
      <select
        :value="imgType"
        name="imgType"
        id=""
        @change="changeImgType"
      >
        <option value="">全部</option>
        <option v-for="item in imgTypeOptions" :key="item" :value="item">{{ item }}</option>
      </select>
    </div>
    <div class="header-download">
      <label for="folder">
        <input
          :value="choseDirectory"
          type="checkbox" name="folder" id="folder"
          @change="changeCkeckFn($event, 'choseDirectory')" />
        是否下载到指定文件夹
      </label>
      <label for="ip">
        <input
          :value="choseIpDirectory"
          type="checkbox" name="ip" id="ip"
          @change="changeCkeckFn($event, 'choseIpDirectory')" />
        是否携带ip目录
      </label>
      <button>重新选择要保存的文件夹</button>
      <button>下载图片</button>
    </div>
  </header>
</template>

<style lang="less" scoped>
header {
  padding: 20px;
  &-tool {
    display: flex;
    align-items: center;
  }
}
</style>