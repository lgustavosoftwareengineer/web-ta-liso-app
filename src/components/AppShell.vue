<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterView } from 'vue-router'
import DesktopSidebar from '@/components/DesktopSidebar.vue'
import DesktopTopbar from '@/components/DesktopTopbar.vue'

const route = useRoute()

const isAuthRoute = computed(() => {
  const name = route.name as string
  return name === 'login' || name === 'token'
})
</script>

<template>
  <!-- Login / Token: full screen, no shell -->
  <RouterView v-if="isAuthRoute" />

  <!-- App routes: one RouterView; on desktop, sidebar + topbar wrap it and CSS hides view header/nav -->
  <div
    v-else
    class="min-h-screen lg:h-screen lg:flex lg:flex-row bg-[#F5EDD8] app-shell-desktop"
  >
    <DesktopSidebar class="hidden lg:flex lg:h-full lg:shrink-0" />
    <div class="flex-1 flex flex-col min-h-0 min-w-0">
      <DesktopTopbar class="hidden lg:flex" />
      <div class="flex-1 overflow-y-auto page-body-desktop min-h-0">
        <RouterView />
      </div>
    </div>
  </div>
</template>
