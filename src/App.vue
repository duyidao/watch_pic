<script setup lang="ts">
import { onMounted, computed } from 'vue';
import file from '@/store/index.ts';
import ipFile from '@/store/ip.ts';
import statisticsFile from '@/store/statistics.ts';
import ShowImg from '@comp/ShowImg.vue';
import FormHeader from '@comp/FormHeader.vue';
import ShowModal from '@comp/ShowModal.vue';

const {
  imgList, showIndex, imgTypeSet,
  imgType, findText, imgInfo,
  choseDirectory, choseIpDirectory,
  prevImgFn, nextImgFn, openDirectory, downloadImgFn, clearDownloadDirFn,
} = file();
const {
  openIPDirectory,
} = ipFile();
const {
  showModal,
  totalData,
  statisticsTotalFn,
} = statisticsFile();


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

const totalList = computed(() => {
  return Object.keys(totalData.value).map((key) => {
    console.log(key, totalData.value[key]);
    return {
      name: key,
      total: totalData.value[key].total,
      children: Object.keys(totalData.value[key].children).map(item => {
        return {
          ip: item,
          total: totalData.value[key].children[item],
        }
      }).sort((a, b) => b.total - a.total)
    }
  });
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
      :openIPDirectory="openIPDirectory"
      :statisticsTotalFn="statisticsTotalFn"/>
    <ShowImg :src="imgInfo.src" />
    <ShowModal v-model:open="showModal" :data="totalList" />
  </div>
</template>

<style scoped>

</style>