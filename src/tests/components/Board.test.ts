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

function dataTransfer() {
  return { effectAllowed: '', setData: vi.fn() }
}

describe('Board', () => {
  it('renders named columns with counts and cards', async () => {
    const wrapper = mount(Board, { props: { columns }, attachTo: document.body })

    expect(wrapper.findAll('h3').map((h) => h.text())).toEqual(['Lead', 'Customer'])
    expect(wrapper.findAll('header').map((h) => h.text())).toEqual(['Lead3', 'Customer0'])
    expect(wrapper.findAll('[role="button"]').map((c) => c.text())).toEqual(['Ada', 'Grace', 'Alan'])
    expect(wrapper.text()).toContain('No cards')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('opens a card on click, Enter and Space', async () => {
    const wrapper = mount(Board, { props: { columns } })
    const card = wrapper.find('[role="button"]')

    await card.trigger('click')
    await card.trigger('keydown', { key: 'Enter' })
    await card.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('card-click')).toEqual([[columns[0].items[0]], [columns[0].items[0]], [columns[0].items[0]]])
  })

  it('moves a card to another column', async () => {
    const wrapper = mount(Board, { props: { columns } })
    const target = wrapper.findAll('section')[1].find('.bg-sui-sunken.rounded-xl')

    await wrapper.find('[draggable="true"]').trigger('dragstart', { dataTransfer: dataTransfer() })
    await target.trigger('dragover')
    expect(target.classes()).toContain('ring-sui-accent-line')
    await target.trigger('drop')
    expect(wrapper.emitted('move')).toEqual([[1, 'customer', 0]])
    expect(target.classes()).not.toContain('ring-sui-accent-line')
  })

  it('reorders within a column only when sortable', async () => {
    const wrapper = mount(Board, { props: { columns } })
    const cards = () => wrapper.findAll('[draggable="true"]')
    const rect = { top: 0, height: 40 } as DOMRect
    const body = wrapper.find('section .bg-sui-sunken.rounded-xl')

    for (const sortable of [false, true]) {
      await wrapper.setProps({ sortable })
      cards()[2].element.getBoundingClientRect = () => rect
      await cards()[0].trigger('dragstart', { dataTransfer: dataTransfer() })
      // Lower half of the last card: after it.
      await cards()[2].trigger('dragover', { clientY: 30 })
      expect(
        cards()[2]
          .classes()
          .some((c) => c.startsWith('shadow-'))
      ).toBe(false)
      await body.trigger('drop')
    }
    expect(wrapper.emitted('move')).toEqual([[1, 'lead', 2]])
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
