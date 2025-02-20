<script setup lang="ts">
import { onMounted, watchEffect } from 'vue';
import file from '@/store/index.ts';
import ShowImg from '@comp/ShowImg.vue';
import FormHeader from '@comp/FormHeader.vue';

const {
  imgList, showIndex, imgTypeSet,
  imgType, findText,
  prevImgFn, nextImgFn, openDirectory
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
      prevImgFn();
      break;
    default:
      break;
  }
}
watchEffect(() => {
  console.log('imgList', imgList.value);
})
onMounted(() => {
  window.addEventListener('keyup', keyup)
})
</script>

<template>
  <div>
    <FormHeader :openDirectory="openDirectory" :imgTypeSet="imgTypeSet" v-model:imgType="imgType" v-model:findText="findText"/>
    <ShowImg :imgList="imgList" :showIndex="showIndex" />
  </div>
</template>

<style scoped>

</style>