import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import HomeView from '../HomeView.vue'

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renderiza título e texto de boas-vindas', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('Ta Liso')
    expect(wrapper.text()).toContain('Bem-vindo ao seu projeto')
  })

  it('exibe o contador do Pinia e incrementa ao clicar', async () => {
    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('0')
    await wrapper.find('button').trigger('click')
    expect(wrapper.text()).toContain('1')
  })
})
