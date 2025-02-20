<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  openDirectory: () => void,
  imgTypeSet: Set<string>,
  imgType: string,
  findText: string,
}>()

const emits = defineEmits(['update:imgType', 'update:findText']);

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
</script>

<template>
  <header>
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
  </header>
</template>

<style lang="less" scoped>
.header {
  &-tool {
    display: flex;
    align-items: center;
  }
}
</style>