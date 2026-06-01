<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productsApi, pagesApi, bannersApi } from '../api'
import { useToastStore } from '../stores/toast'
import { useDebounce } from '../composables/useDebounce'
import AppSwitch from '../components/ui/AppSwitch.vue'
import AppInput from '../components/ui/AppInput.vue'
import type { Product, Page, Banner } from '../api/types'

const toast = useToastStore()

const PAGE_SIZE = 5
const activeTab = ref<'products' | 'pages' | 'banners'>('products')

const products = ref<Product[]>([])
const pages = ref<Page[]>([])
const banners = ref<Banner[]>([])
const loading = ref(false)

// Product search + pagination
const searchQuery = ref('')
const debouncedQuery = useDebounce(searchQuery)
const visibleCount = ref(PAGE_SIZE)

const filteredProducts = computed(() => {
  const q = debouncedQuery.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter((p) => p.title.toLowerCase().includes(q))
})

const displayedProducts = computed(() =>
  filteredProducts.value.slice(0, visibleCount.value)
)

const hasMore = computed(() =>
  visibleCount.value < filteredProducts.value.length
)

const loadMore = () => { visibleCount.value += PAGE_SIZE }

// Reset pagination when search changes
const onSearch = () => { visibleCount.value = PAGE_SIZE }

const loadAll = async () => {
  loading.value = true
  try {
    const [p, pg, b] = await Promise.all([
      productsApi.getAll(),
      pagesApi.getAll(),
      bannersApi.getAll(),
    ])
    products.value = p
    pages.value = pg
    banners.value = b
  } catch {
    toast.show('Ошибка загрузки данных', 'error')
  } finally {
    loading.value = false
  }
}

const toggleProduct = async (item: Product) => {
  const prev = item.isPublished
  item.isPublished = !prev
  try {
    await productsApi.updateVisibility(item._id, item.isPublished)
    toast.show(`«${item.title}» — ${item.isPublished ? 'показан' : 'скрыт'}`)
  } catch {
    item.isPublished = prev
    toast.show('Ошибка обновления', 'error')
  }
}

const togglePage = async (item: Page) => {
  const prev = item.visible
  item.visible = !prev
  try {
    await pagesApi.updateVisibility(item.key, item.visible)
    toast.show(`«${item.label}» — ${item.visible ? 'показана' : 'скрыта'}`)
  } catch {
    item.visible = prev
    toast.show('Ошибка обновления', 'error')
  }
}

const toggleBanner = async (item: Banner) => {
  const prev = item.visible
  item.visible = !prev
  try {
    await bannersApi.updateVisibility(item._id, item.visible)
    toast.show(`«${item.title}» — ${item.visible ? 'показан' : 'скрыт'}`)
  } catch {
    item.visible = prev
    toast.show('Ошибка обновления', 'error')
  }
}

onMounted(loadAll)

const tabs = [
  { key: 'products', label: 'Товары' },
  { key: 'pages', label: 'Страницы' },
  { key: 'banners', label: 'Баннеры' },
] as const

const classes = {
  page: 'flex flex-col gap-6',
  title: 'text-2xl font-heading font-bold text-[var(--color-text)]',
  tabs: 'flex gap-1 p-1 bg-[var(--color-surface-strong)] rounded-xl w-fit',
  tab: {
    base: 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
    active: 'bg-[var(--color-surface-solid)] text-[var(--color-primary)] shadow-sm',
    inactive: 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
  },
  panel: 'glass-panel p-4 sm:p-6 flex flex-col gap-3',
  searchWrapper: 'pb-2',
  counter: 'text-xs text-[var(--color-text-muted)] pb-1',
  row: 'flex items-center justify-between gap-4 py-3 border-b border-[var(--color-border)] last:border-0',
  rowTitle: 'text-sm text-[var(--color-text)] flex-1 truncate',
  badge: {
    base: 'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
    visible: 'bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]',
    hidden: 'bg-[rgba(var(--color-text-rgb),0.08)] text-[var(--color-text-muted)]',
  },
  loadMore: 'w-full py-2 text-sm text-[var(--color-primary)] hover:underline cursor-pointer transition-colors',
  empty: 'py-6 text-center text-sm text-[var(--color-text-muted)]',
  bannerGrid: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
  bannerCard: 'glass-panel overflow-hidden flex flex-col',
  bannerImg: 'w-full aspect-[16/7] object-cover',
  bannerBody: 'p-4 flex items-center justify-between gap-3',
  bannerTitle: 'text-sm font-medium text-[var(--color-text)] truncate',
  spinner: 'flex items-center justify-center py-16 text-[var(--color-text-muted)] text-sm',
}
</script>

<template>
  <div :class="classes.page">
    <h1 :class="classes.title">Видимость</h1>

    <div :class="classes.tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="[classes.tab.base, activeTab === tab.key ? classes.tab.active : classes.tab.inactive]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" :class="classes.spinner">Загрузка...</div>

    <template v-else>
      <Transition name="fade" mode="out-in">

        <!-- Products -->
        <div v-if="activeTab === 'products'" :class="classes.panel">
          <div :class="classes.searchWrapper">
            <AppInput
              v-model="searchQuery"
              placeholder="Поиск по названию..."
              @input="onSearch"
            />
          </div>

          <p :class="classes.counter">
            Показано {{ displayedProducts.length }} из {{ filteredProducts.length }}
            <template v-if="debouncedQuery"> (всего {{ products.length }})</template>
          </p>

          <template v-if="displayedProducts.length > 0">
            <div v-for="item in displayedProducts" :key="item._id" :class="classes.row">
              <span :class="classes.rowTitle">{{ item.title }}</span>
              <span :class="[classes.badge.base, item.isPublished ? classes.badge.visible : classes.badge.hidden]">
                {{ item.isPublished ? '👁 Виден' : '🚫 Скрыт' }}
              </span>
              <AppSwitch :model-value="item.isPublished" @update:model-value="toggleProduct(item)" />
            </div>

            <button v-if="hasMore" :class="classes.loadMore" @click="loadMore">
              Показать ещё {{ Math.min(PAGE_SIZE, filteredProducts.length - visibleCount) }}
            </button>
          </template>

          <p v-else :class="classes.empty">Ничего не найдено</p>
        </div>

        <!-- Pages -->
        <div v-else-if="activeTab === 'pages'" :class="classes.panel">
          <div v-for="item in pages" :key="item._id" :class="classes.row">
            <span :class="classes.rowTitle">{{ item.label }}</span>
            <span :class="[classes.badge.base, item.visible ? classes.badge.visible : classes.badge.hidden]">
              {{ item.visible ? '👁 Видна' : '🚫 Скрыта' }}
            </span>
            <AppSwitch :model-value="item.visible" @update:model-value="togglePage(item)" />
          </div>
        </div>

        <!-- Banners -->
        <div v-else-if="activeTab === 'banners'" :class="classes.bannerGrid">
          <div v-for="item in banners" :key="item._id" :class="classes.bannerCard">
            <picture>
              <source media="(min-width: 1024px)" :srcset="item.image.desktop" />
              <source media="(min-width: 640px)" :srcset="item.image.tablet" />
              <img :src="item.image.mobile" :alt="item.title" :class="classes.bannerImg" loading="lazy" />
            </picture>
            <div :class="classes.bannerBody">
              <span :class="classes.bannerTitle">{{ item.title }}</span>
              <AppSwitch :model-value="item.visible" @update:model-value="toggleBanner(item)" />
            </div>
          </div>
        </div>

      </Transition>
    </template>
  </div>
</template>
