<script setup lang="ts">
import { ref } from 'vue'
import type { FileSystemDirectoryHandleList } from './types'

const root = ref<FileSystemDirectoryHandleList>(null as unknown as FileSystemDirectoryHandleList)

async function processHandle(handle: FileSystemDirectoryHandleList) {
  // 添加判断，终止递归，返回文件
  if(handle.kind === 'file') {
    return handle
  }
  
  handle.children = []
  const iter = await handle.entries() // 获取文件夹中所有内容
  for await (const info of iter) {
    const subHandle = await processHandle(info[1] as unknown as FileSystemDirectoryHandleList) // 返回的是一个数组，返回的内容格式如上所述。通过递归的思想一直获取文件夹内的内容
    handle.children.push(subHandle)
  }
  
  return handle
}

const showDirectoryPickerFn = async () => {
  try {
    // @ts-ignore
    const handle: FileSystemDirectoryHandleList = await showDirectoryPicker()
    root.value = await processHandle(handle)
    console.log('root.value', root.value);
  } catch (err) {
    console.log('err', err);
  }
}
</script>

<template>
  <div @click="showDirectoryPickerFn">点击选择文件夹</div>
  <div v-if="root">
    <div v-for="item in root.children" :key="item.name">
      {{ item.name }}
    </div>
  </div>
</template>

<style scoped>
</style>
