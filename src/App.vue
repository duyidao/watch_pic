<script setup lang="ts">
import Catalogue from '@comp/catalogue.vue';
import Filter from '@comp/filter.vue';
import { root } from '@/store/catalogue.ts';
</script>

<template>
  <Filter/>
  <main class="container">
    <Catalogue v-if="root" :list="root"/>
  </main>
</template>

<style lang="less" scoped>
main.container {
  width: 100vw;
  height: calc(100% - 30px);
  /* height: 100vh; */
  padding: 20px;

  :deep(> .catalogue) {
    width: 30%;
    height: 100%;
    overflow-y: scroll;
  }
}
</style>
