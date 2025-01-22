<script setup lang="ts">
import { ref, watch } from 'vue'
import { choseShowFn } from '@/store/show.ts';
import type { obj } from '@/store/show.ts';
import type { FileSystemDirectoryHandleItem } from '@/types';

const props = defineProps<{
  list: FileSystemDirectoryHandleItem[],
}>()

const data = ref<FileSystemDirectoryHandleItem[]>([])

watch(() => props.list, (val: FileSystemDirectoryHandleItem[]) => {
  if (!val || val.length === 0) return;
  data.value = val.map(item => {
    return {
      kind: item.kind,
      name: item.name,
      children: item.children,
      expanded: false
    }
  })
}, {deep: true, immediate: true })

/**
 * 打开或关闭文件夹📁
 * @param item 文件目录项
 */
const directoryFn = (item: FileSystemDirectoryHandleItem) => {
  data.value.find(e => e.name === item.name)!.expanded = !item.expanded
}

/**
 * 阅读文件内容📃
 * @param item 文件目录项
 */
const fileUrl= ref()
const fileFn = async (item: FileSystemDirectoryHandleItem) => {
  console.log('item, props.list[0]', item, props.list[0]);
  // 读取文件内容
  const file = await props.list[0].getFile!();
  const file1 = await item.getFile!();
  console.log('file', file, file1);
  let params: obj = { type: '', info: '' } as unknown as obj;
  switch (file.name.split('.')[file.name.split('.').length - 1]) {
    case 'jpg':
    case 'png':
    params.type = 'img', params.info = URL.createObjectURL(file as unknown as Blob);
      break;
  
    default:
      break;
  }
  choseShowFn(params)
}

const showFile = (item: FileSystemDirectoryHandleItem) => {
  switch (item.kind) {
    case 'directory':
      directoryFn(item);
      break;
    case 'file':
      fileFn(item);
      break;
    default:
      break;
  }
}
</script>

<template>
  <div class="catalogue">
    <nav v-for="(item, index) in data" :key="item.name">
      <div class="title" @click="showFile(item)">
        <div class="icon" v-if="item.kind === 'directory'" :class="{ 'open': item.expanded }">{{ item.expanded ? '[➖]' : '[➕]'}}</div>
        <div class="name">{{ item.name }}</div>
      </div>
      <div class="content" v-if="item.expanded && item.children && item.children.length > 0">
        <Catalogue :list="props.list[index].children" :parentIndex="index" />
      </div>
    </nav>
  </div>
  <img :src="fileUrl" alt="">
</template>

<style lang="less" scoped>
nav {
  margin-bottom: 10px;
  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    margin-bottom: 10px;

    .icon {
      width: 22px;
      margin-right: 10px;
    }
  }

  .content {
    padding-left: 34px;
  }
}
</style>