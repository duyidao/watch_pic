<script lang="ts" setup>
import { Modal as AModal, Table as ATable } from 'ant-design-vue';

defineProps({
  open: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array,
    default: () => [],
  }
})

const emit = defineEmits(['update:open'])

const handleClose = () => {
  emit('update:open', false)
}

const columns = [
  {
    title: '误报类型',
    dataIndex: 'name',
    key: 'name',
    width: '150px'
  },
  {
    title: 'ip与相机编号',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: '总数',
    dataIndex: 'total',
    key: 'total',
  },
];
</script>

<template>
  <a-modal :open="open"
    title="统计结果"
    width="550"
    centered
    :footer="null"
    @cancel="handleClose">
    <a-table :pagination="false" :scroll="{ y: 460 }" bordered :defaultExpandAllRows="true" :columns="columns" :data-source="data" />
  </a-modal>
</template>

<style lang="less" scoped></style>