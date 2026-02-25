/**
 * Mount a component with Vue Router, Pinia and VueQueryPlugin so RouterLink,
 * useRoute, Pinia stores and TanStack Vue Query composables all work.
 */
import { mount, type VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import type { Component } from 'vue'

const routes = [
  { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
  { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
  { path: '/chat', name: 'chat', component: { template: '<div>Chat</div>' } },
  { path: '/resumo', name: 'resumo', component: { template: '<div>Resumo</div>' } },
  { path: '/categorias', name: 'categorias', component: { template: '<div>Categorias</div>' } },
  { path: '/configuracoes', name: 'configuracoes', component: { template: '<div>Config</div>' } },
]

export async function createTestRouter(initialRoute = '/') {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })
  await router.push(initialRoute)
  return router
}

export async function mountWithRouter(
  component: Component,
  options: { route?: string; pinia?: ReturnType<typeof createPinia> } = {},
): Promise<{ wrapper: VueWrapper; router: Router }> {
  const pinia = options.pinia ?? createPinia()
  setActivePinia(pinia)
  const router = await createTestRouter(options.route ?? '/')
  await router.isReady()

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  const wrapper = mount(component, {
    global: {
      plugins: [router, pinia, [VueQueryPlugin, { queryClient }]],
    },
  })
  return { wrapper, router }
}
