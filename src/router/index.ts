import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import TokenView from '@/views/TokenView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import ChatView from '@/views/ChatView.vue'
import ResumoView from '@/views/ResumoView.vue'
import ConfiguracoesView from '@/views/ConfiguracoesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { topbar: { title: 'E aí, João! 👋', subtitle: 'Fevereiro 2025 · aqui tá o resumo do mês' } } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/token', name: 'token', component: TokenView },
    { path: '/categorias', name: 'categorias', component: CategoriesView, meta: { topbar: { subtitle: 'Gerencie suas categorias e orçamentos' } } },
    { path: '/chat', name: 'chat', component: ChatView, meta: { topbar: { title: '💬 Chat financeiro', subtitle: 'Digite seus gastos em linguagem natural' } } },
    { path: '/resumo', name: 'resumo', component: ResumoView, meta: { topbar: { subtitle: 'Visão geral do mês' } } },
    { path: '/configuracoes', name: 'configuracoes', component: ConfiguracoesView, meta: { topbar: { subtitle: 'Perfil e preferências' } } },
  ],
})

router.afterEach(() => {
  nextTick(() => {
    window.scrollTo(0, 0)
    const main = document.querySelector('.page-body-desktop')
    if (main) main.scrollTop = 0
  })
})

export default router
