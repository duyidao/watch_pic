<script setup lang="ts">
import { onMounted, computed } from 'vue';
import file from '@/store/index.ts';
import ShowImg from '@comp/ShowImg.vue';
import FormHeader from '@comp/FormHeader.vue';

const {
  imgList, showIndex, imgTypeSet,
  imgType, findText,
  choseDirectory, choseIpDirectory,
  prevImgFn, nextImgFn, openDirectory, downloadImgFn,
} = file();

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

const imgInfo = computed(() => {
  return {
    src: imgList.value.length ? URL.createObjectURL(imgList.value[showIndex.value].file as Blob) : '',
    name: imgList.value.length ? imgList.value[showIndex.value].name : ''
  }
})
</script>

<template>
  <div>
    <FormHeader
      v-model:imgType="imgType" v-model:findText="findText" v-model:choseDirectory="choseDirectory" v-model:choseIpDirectory="choseIpDirectory"
      :imgTypeSet="imgTypeSet" :showIndex="showIndex" :imgName="imgInfo.name"
      :totalLength="imgList.length"
      :openDirectory="openDirectory"/>
    <ShowImg :src="imgInfo.src" />
  </div>
</template>

<style scoped>

</style>