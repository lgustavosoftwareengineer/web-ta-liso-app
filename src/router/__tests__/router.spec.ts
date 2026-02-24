/**
 * Feature: Protected routes (BDD)
 * Scenario: Usuário tenta acessar tela protegida sem autenticação → redirect to login.
 * AAA pattern.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ResumoView from '@/views/ResumoView.vue'

// Minimal route config for guard tests (no API-dependent components needed for navigation)
const AUTH_ROUTES = ['login', 'token']
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/token', name: 'token', component: { template: '<div>Token</div>' } },
    { path: '/resumo', name: 'resumo', component: ResumoView },
    { path: '/categorias', name: 'categorias', component: { template: '<div>Categorias</div>' } },
    { path: '/configuracoes', name: 'configuracoes', component: { template: '<div>Config</div>' } },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('access_token')
  const isAuthRoute = AUTH_ROUTES.includes(to.name as string)
  if (!isAuthenticated && !isAuthRoute) {
    return { name: 'login' }
  }
})

describe('Feature: Protected routes', () => {
  beforeEach(async () => {
    localStorage.clear()
    vi.stubGlobal('scrollTo', vi.fn())
    await router.replace('/')
  })

  describe('Scenario: Usuário tenta acessar tela protegida sem autenticação', () => {
    it('redireciona para a tela de login ao acessar Início', async () => {
      // Arrange: user not authenticated
      expect(localStorage.getItem('access_token')).toBeNull()

      // Act: navigate to protected route
      await router.push({ name: 'home' })
      await nextTick()

      // Assert: redirected to login
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('redireciona para a tela de login ao acessar Resumo', async () => {
      // Arrange
      expect(localStorage.getItem('access_token')).toBeNull()

      // Act
      await router.push({ name: 'resumo' })
      await nextTick()

      // Assert
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('redireciona para a tela de login ao acessar Categorias', async () => {
      // Arrange
      expect(localStorage.getItem('access_token')).toBeNull()

      // Act
      await router.push({ name: 'categorias' })
      await nextTick()

      // Assert
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('permite acessar a tela de login sem token', async () => {
      // Arrange: not authenticated

      // Act
      await router.push({ name: 'login' })
      await nextTick()

      // Assert: stays on login
      expect(router.currentRoute.value.name).toBe('login')
    })

    it('permite acessar Início quando autenticado', async () => {
      // Arrange: user has token
      localStorage.setItem('access_token', 'fake-jwt')

      // Act
      await router.push({ name: 'home' })
      await nextTick()

      // Assert: stays on home
      expect(router.currentRoute.value.name).toBe('home')
    })
  })
})
