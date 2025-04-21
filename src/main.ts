import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/reset.less'

import { message } from 'ant-design-vue';

// 全局配置 Message
message.config({
  maxCount: 3, // 同时最多显示 3 条消息
  duration: 2, // 默认持续时间（可选配置）
});

createApp(App).mount('#app')
