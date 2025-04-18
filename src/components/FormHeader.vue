<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { Button as AButton, Checkbox, Input as AInput, Select as ASelect } from 'ant-design-vue';
import type { SelectValue, DefaultOptionType } from 'ant-design-vue/es/select';
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
import type { ImgInfo } from '@/types/index'

const props = defineProps<{
  openDirectory: () => void,
  downloadImgFn: () => void,
  clearDownloadDirFn: () => void,
  openIPDirectory: () => void,
  statisticsTotalFn: () => void,
  imgTypeSet: Set<string>,
  imgType: string,
  findText: string,
  showIndex: number,
  totalLength: number,
  imgInfo: ImgInfo,
  choseDirectory: boolean,
  choseIpDirectory: boolean,
  ipFileList: object,
}>()

const emits = defineEmits(['update:imgType', 'update:showIndex', 'update:findText', 'update:choseDirectory', 'update:choseIpDirectory']);

const imgTypeOptions: ComputedRef<DefaultOptionType[]> = computed(() => {
  return Array.from(props.imgTypeSet).map(item => ({ value: item, label: item }));
});

/**
 * 修改图片类型的事件处理函数
 *
 * @param e 事件对象
 */
const changeImgType = (e: SelectValue) => {
  console.log(e);
  emits('update:imgType', e);
};


/**
 * 修改文本的函数
 *
 * @param e 事件对象
 */
const changeInputFn = (type: string, e: Event) => {
  emits(`update:${type}` as 'update:findText', type === 'showIndex' ? Number((e.target as HTMLInputElement).value) : (e.target as HTMLInputElement).value);
};

const changeCkeckFn = (type: 'choseDirectory' | 'choseIpDirectory', e: CheckboxChangeEvent) => {
  console.log(type, e);
  emits(`update:${type}`, (e.target as HTMLInputElement).checked);
};
</script>

<template>
  <header>
    <div class="header-total">
      <span class="img-index">第{{ showIndex + 1 }}张 / 共{{ totalLength }}张</span>
      <span class="img-name"
        :text="imgInfo.name">
        名称：{{ imgInfo.name }}
      </span>
    </div>
    <div class="header-tool">
      <a-button type="primary"
        @click="openDirectory">选取文件夹</a-button>
        <a-input style="width: 210px"
        :value="findText"
        addon-before="图片格式"
        placeholder="请输入关键词"
        @input="($event) => changeInputFn('findText', $event)" />
      <a-input style="width: 210px"
        :value="showIndex"
        addon-before="当前索引"
        placeholder="请输入跳转索引"
        number
        @input="($event) => changeInputFn('showIndex', $event)" />
      <span style="width: 55px;">类型：</span>
      <a-select :value="imgType"
        style="width: 160px"
        :options="imgTypeOptions"
        @change="changeImgType" />
      <a-button @click="openIPDirectory">关联IP</a-button>
      <a-button @click="clearDownloadDirFn">重新指定保存路径</a-button>
      <a-button @click="downloadImgFn">下载图片</a-button>
    </div>
    <div class="header-download">
      <div class="download-chose">
        <checkbox :value:checked="choseDirectory"
          @change="($event) => changeCkeckFn('choseDirectory', $event)">是否保存到指定路径</checkbox>
        <checkbox v-if="JSON.stringify(ipFileList) !== '{}'" :value:checked="choseIpDirectory"
          @change="($event) => changeCkeckFn('choseIpDirectory', $event)">是否携带ip目录</checkbox>
      </div>
      <div class="total">
        <a-button type="link" @click="statisticsTotalFn">统计结果</a-button>
      </div>
    </div>
  </header>
</template>

<style lang="less" scoped>
header {
  padding: 12px 15px;

  .header-total {
    display: flex;
    align-items: center;
    height: 25px;
    font-size: 20px;

    .img-index {
      position: relative;
      max-width: 180px;
      height: 100%;
      margin-right: 10px;
      padding-right: 13px;

      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0px;
        top: -2px;
        width: 2px;
        height: 25px;
        background-color: #555;
      }
    }

    .img-name {
      max-width: 84%;
      height: 100%;
      white-space: nowrap;
      /*禁止文本换行 */
      overflow: hidden;
      /* 隐藏超出范围的内容 */
      text-overflow: ellipsis;
      /* 使用省路号 */
    }
  }

  .header-tool {
    display: flex;
    align-items: center;
    height: 25px;
    margin: 14px 0;
    font-size: 14px;

    button {
      border-radius: 8px;
      margin-right: 20px;
      padding: 0 20px;
      height: 100%;
    }

    :deep(.ant-input-group-wrapper) {
      height: 25px;
      margin-right: 20px;

      .ant-input-wrapper {
        height: 25px;

        span,
        input {
          height: 25px;
        }
      }
    }

    :deep(.ant-select) {
      height: 100%;
      margin-right: 20px;

      .ant-select-selector {
        height: 100%;

        .ant-select-selection-item {
          line-height: 1.6;
        }

        .ant-select-selection-search-input {
          height: 100%;
        }
      }
    }
  }

  .header-download {
    display: flex;
    align-items: center;
    justify-content: space-between;

    >div {
      display: flex;
      align-items: center;

      label {
        margin-right: 14px;
      }
    }
  }
}
</style>