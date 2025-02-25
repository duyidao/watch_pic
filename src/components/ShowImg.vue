<script setup lang="ts">
defineProps<{
  src: string;
}>()
</script>

<template>
  <div>
    <img :src="src" alt="">
  </div>
</template>

<style scoped>

</style>