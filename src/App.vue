<script setup lang="ts">
import Catalogue from '@comp/catalogue.vue';
import Filter from '@comp/filter.vue';
import Show from '@comp/show.vue';
import { root } from '@/store/catalogue.ts';
</script>

<template>
  <Filter/>
  <main class="container">
    <Catalogue v-if="root" :list="root"/>
    <Show />
  </main>
</template>

<style lang="less" scoped>
main.container {
  display: flex;
  justify-content: space-between;
  width: 100vw;
  height: calc(100% - 30px);
  /* height: 100vh; */
  padding: 20px;

  :deep(> .catalogue) {
    width: 30%;
    height: 100%;
    overflow-y: scroll;
  }

  :deep(.show) {
    width: 70%;
    height: 100%;
  }
}
</style>
