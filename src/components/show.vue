<script setup lang="ts">
import { showType, showInfo } from '@/store/show.ts';
</script>

<template>
  <div class="show">
    <img v-if="showType === 'img'" :src="showInfo" alt="">
    <video v-else-if="showType === 'video'" :src="showInfo"></video>
    <div v-else></div>
  </div>
</template>

<style scoped>

</style>