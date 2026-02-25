<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import DesktopSidebar from '@/components/DesktopSidebar.vue'
import DesktopTopbar from '@/components/DesktopTopbar.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const route = useRoute()

const isAuthRoute = computed(() => {
  const name = route.name as string
  return name === 'login' || name === 'token'
})
</script>

<template>
  <!-- Login / Token: full screen, no shell -->
  <RouterView v-if="isAuthRoute" />

  <!-- App routes: on mobile viewport fixo e só o conteúdo da view rola; no desktop sidebar + topbar -->
  <div
    v-else
    class="flex flex-col h-dvh max-h-dvh overflow-hidden bg-[#F5EDD8] lg:h-screen lg:max-h-none lg:overflow-visible lg:flex-row app-shell-desktop"
  >
    <DesktopSidebar class="hidden lg:flex lg:h-full lg:shrink-0" />
    <div class="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
      <DesktopTopbar class="hidden lg:flex" />
      <div class="flex-1 min-h-0 overflow-hidden lg:overflow-y-auto page-body-desktop">
        <RouterView />
      </div>
    </div>
    <ToastContainer />
  </div>
</template>
