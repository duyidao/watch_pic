<script setup lang="ts">
import { onMounted, computed } from 'vue';
import file from '@/store/file.ts';
import ipFile from '@/store/ip.ts';
import filterFile from '@/store/filter.ts';
import statisticsFile from '@/store/statistics.ts';
import ShowImg from '@comp/ShowImg.vue';
import FormHeader from '@comp/FormHeader.vue';
import ShowModal from '@comp/ShowModal.vue';
import { imgTypeSet } from "@/store/common.ts";

const {
  imgType, choseDirectory, choseIpDirectory, openDirectory, downloadImgFn, clearDownloadDirFn,
} = file();
const {
  imgList, showIndex, findText, imgInfo,
  prevImgFn, nextImgFn,
} = filterFile();
const {
  ipFileList,
  openIPDirectory,
} = ipFile();
const {
  showModal,
  totalData,
  statisticsTotalFn,
} = statisticsFile();


const keyup = (e: KeyboardEvent) => {
  if (!e || !e.key) return console.warn(`${e} 未知`);
  if (document.activeElement?.tagName === 'INPUT') return;
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
    return {
      name: key,
      total: totalData.value[key].total,
      children: Object.keys(totalData.value[key].children).map(item => {
        return {
          ip: item,
          total: totalData.value[key].children[item],
        }
      }).sort((a, b) => b.total - a.total).slice(0, 5),
    }
  });
})
</script>

<template>
  <div>
    <FormHeader
      v-model:imgType="imgType" v-model:findText="findText" v-model:showIndex="showIndex"
      v-model:choseDirectory="choseDirectory" v-model:choseIpDirectory="choseIpDirectory"
      :imgTypeSet="imgTypeSet" :imgInfo="imgInfo"
      :totalLength="imgList.length"
      :ipFileList="ipFileList"
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