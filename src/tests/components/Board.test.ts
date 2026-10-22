import { mount } from '@vue/test-utils'

import { Board } from '../../index'
import { expectAccessible } from '../support/axe'

const columns = [
  {
    id: 'lead',
    name: 'Lead',
    items: [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Grace' },
      { id: 3, name: 'Alan' }
    ]
  },
  { id: 'customer', name: 'Customer', items: [] as { id: number; name: string }[] }
]

describe('Board', () => {
  it('renders named columns with counts and cards', async () => {
    const wrapper = mount(Board, { props: { columns, onCardClick: () => {} }, attachTo: document.body })

    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual(['Lead', 'Customer'])
    expect(wrapper.findAll('header').map((h) => h.text())).toEqual(['Lead3', 'Customer0'])
    expect(wrapper.findAll('[role="button"]').map((c) => c.text())).toEqual(['Ada', 'Grace', 'Alan'])
    expect(wrapper.text()).toContain('No cards')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('opens a card on click, Enter and Space when listened for', async () => {
    const onCardClick = vi.fn()
    const wrapper = mount(Board, { props: { columns, onCardClick }, attachTo: document.body })
    const card = wrapper.find('[role="button"]')

    await card.trigger('click')
    await card.trigger('keydown', { key: 'Enter' })
    await card.trigger('keydown', { key: ' ' })
    expect(onCardClick.mock.calls).toEqual([[columns[0]!.items[0]], [columns[0]!.items[0]], [columns[0]!.items[0]]])
    wrapper.unmount()
  })

  it('leaves the card to its slot without a click handler or a frame', async () => {
    const wrapper = mount(Board, {
      props: { columns, cardFrame: false },
      slots: { card: '<template #card="{ item }"><a href="#">{{ item.name }}</a></template>' },
      attachTo: document.body
    })
    const card = wrapper.find('[data-board-index]')

    expect(wrapper.find('[role="button"]').exists()).toBe(false)
    expect(card.attributes('tabindex')).toBeUndefined()
    expect(card.classes()).not.toContain('border')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('adds to a column, and shows skeleton cards while loading', async () => {
    const onNew = vi.fn()
    const wrapper = mount(Board, { props: { columns, onNew } })

    const buttons = wrapper.findAll('button')
    expect(buttons.map((b) => b.text())).toEqual(['New', 'New'])
    await buttons[1].trigger('click')
    expect(onNew).toHaveBeenCalledWith(columns[1])
    await wrapper.setProps({ loading: true })
    expect(wrapper.findAll('[aria-hidden="true"].rounded-xl')).toHaveLength(6)
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
