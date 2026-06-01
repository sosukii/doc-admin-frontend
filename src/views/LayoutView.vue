<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import ToastContainer from '../components/ui/ToastContainer.vue'

const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()
const sidebarOpen = ref(false)

const logout = () => {
  auth.logout()
  void router.push({ name: 'login' })
}

const navItems = [
  { name: 'visibility', label: 'Видимость', icon: '👁' },
  { name: 'contacts', label: 'Контакты', icon: '📞' },
  { name: 'system', label: 'Система', icon: '⚙️' },
]

const classes = {
  layout: 'min-h-dvh flex flex-col lg:flex-row',
  // Sidebar
  sidebar: {
    base: 'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[var(--color-surface-solid)] border-r border-[var(--color-border)] transition-transform duration-300 lg:static lg:translate-x-0',
    open: 'translate-x-0',
    closed: '-translate-x-full',
  },
  sidebarHeader: 'flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)]',
  logo: 'text-lg font-heading font-bold gradient-text',
  nav: 'flex flex-col gap-1 p-4 flex-1',
  navItem: {
    base: 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer',
    active: 'bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]',
    inactive: 'text-[var(--color-text-muted)] hover:bg-[rgba(var(--color-text-rgb),0.06)] hover:text-[var(--color-text)]',
  },
  sidebarFooter: 'p-4 border-t border-[var(--color-border)] flex items-center gap-2',
  // Overlay
  overlay: 'fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden',
  // Main
  main: 'flex-1 flex flex-col min-w-0',
  topbar: 'flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface-solid)] lg:px-8',
  menuBtn: 'lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors',
  themeBtn: 'ml-auto flex items-center justify-center w-9 h-9 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-strong)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-all duration-200',
  content: 'flex-1 p-4 sm:p-6 lg:p-8',
}
</script>

<template>
  <div :class="classes.layout">
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div v-if="sidebarOpen" :class="classes.overlay" @click="sidebarOpen = false" />
    </Transition>

    <!-- Sidebar -->
    <aside :class="[classes.sidebar.base, sidebarOpen ? classes.sidebar.open : classes.sidebar.closed]">
      <div :class="classes.sidebarHeader">
        <span :class="classes.logo">Avent Admin</span>
      </div>

      <nav :class="classes.nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          :class="[classes.navItem.base]"
          :active-class="classes.navItem.active"
          exact-active-class=""
          :inactive-class="classes.navItem.inactive"
          @click="sidebarOpen = false"
        >
          <span>{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div :class="classes.sidebarFooter">
        <button
          :class="[classes.navItem.base, classes.navItem.inactive, 'w-full text-left']"
          @click="logout"
        >
          <span>🚪</span>
          <span>Выйти</span>
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div :class="classes.main">
      <header :class="classes.topbar">
        <button :class="classes.menuBtn" @click="sidebarOpen = !sidebarOpen">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <button :class="classes.themeBtn" :title="`Переключить тему`" @click="theme.toggle()">
          <span v-if="theme.theme === 'dark'">☀️</span>
          <span v-else>🌙</span>
        </button>
      </header>

      <main :class="classes.content">
        <RouterView />
      </main>
    </div>

    <ToastContainer />
  </div>
</template>
