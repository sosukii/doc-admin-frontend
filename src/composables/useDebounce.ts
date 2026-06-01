import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export const useDebounce = <T>(source: Ref<T>, delay = 350): Ref<T> => {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>

  watch(source, (val) => {
    clearTimeout(timer)
    timer = setTimeout(() => { debounced.value = val }, delay)
  })

  return debounced
}
