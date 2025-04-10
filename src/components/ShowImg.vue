<script setup lang="ts">
defineProps<{
  src: string;
}>()
</script>

<template>
  <div class="show-img">
    <img :src="src" alt="">
  </div>
</template>

<style lang="less" scoped>
.show-img {
  display: flex;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 135px);

  img {
    height: 100%;
  }
}
</style>