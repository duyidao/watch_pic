import { ref } from 'vue'

export type obj = {
  type: 'img' | 'video' | 'other' | '',
  info: string
}

export const showType = ref<'img' | 'video' | 'other' | ''>('')
export const showInfo = ref<string>()

export const choseShowFn = ({type, info}: obj) => {
  showType.value = type
  showInfo.value = info
}

export default {
  showType,
  showInfo
}