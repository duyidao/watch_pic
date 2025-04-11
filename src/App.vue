<script setup lang="ts">
import { onMounted } from 'vue';
import file from '@/store/index.ts';
import ipFile from '@/store/ip.ts';
import ShowImg from '@comp/ShowImg.vue';
import FormHeader from '@comp/FormHeader.vue';

const {
  imgList, showIndex, imgTypeSet,
  imgType, findText, imgInfo,
  choseDirectory, choseIpDirectory,
  prevImgFn, nextImgFn, openDirectory, downloadImgFn, clearDownloadDirFn,
} = file();
const {
  openIPDirectory,
} = ipFile();


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
      downloadImgFn();
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
  <div>
    <FormHeader
      v-model:imgType="imgType" v-model:findText="findText" v-model:choseDirectory="choseDirectory" v-model:choseIpDirectory="choseIpDirectory"
      :imgTypeSet="imgTypeSet" :showIndex="showIndex" :imgInfo="imgInfo"
      :totalLength="imgList.length"
      :openDirectory="openDirectory"
      :downloadImgFn="downloadImgFn"
      :clearDownloadDirFn="clearDownloadDirFn"
      :openIPDirectory="openIPDirectory"/>
    <ShowImg :src="imgInfo.src" />
  </div>
</template>

<style scoped>

</style>