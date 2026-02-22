import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import TokenView from '@/views/TokenView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import ChatView from '@/views/ChatView.vue'
import ResumoView from '@/views/ResumoView.vue'
import ConfiguracoesView from '@/views/ConfiguracoesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/token', name: 'token', component: TokenView },
    { path: '/categorias', name: 'categorias', component: CategoriesView },
    { path: '/chat', name: 'chat', component: ChatView },
    { path: '/resumo', name: 'resumo', component: ResumoView },
    { path: '/configuracoes', name: 'configuracoes', component: ConfiguracoesView },
  ],
})

export default router
