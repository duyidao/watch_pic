<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  imgList: Array<{ name: string, parentName: string, kind: string, file?: File }>,
  showIndex: number
}>()

const src = computed(() => {
  return props.imgList.length ? URL.createObjectURL(props.imgList[props.showIndex].file as Blob) : ''
})
</script>

<template>
  <div>
    <img :src="src" alt="">
  </div>
</template>

<style scoped>

</style>