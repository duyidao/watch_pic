<script setup lang="ts">
import { onMounted } from 'vue';
import file from '@/store/index.ts';
import ShowImg from '@comp/ShowImg.vue';

const { imgList, showIndex, openDirectory, prevImgFn, nextImgFn } = file();

const keyup = (e: KeyboardEvent) => {
  if (!e || !e.key) return console.warn(`${e} 未知`);
  switch (e.key) {
    case 'ArrowRight':
      nextImgFn();
      break;
    case 'ArrowLeft':
      prevImgFn();
      break;
    case 'Enter':
      prevImgFn();
      break;
    default:
      break;
  }
}

onMounted(() => {
  window.addEventListener('keyup', keyup)
})
</script>

<template>
  <button @click="openDirectory">打开文件夹</button>
  <ShowImg :imgList="imgList" :showIndex="showIndex" />
</template>

<style scoped>

</style>