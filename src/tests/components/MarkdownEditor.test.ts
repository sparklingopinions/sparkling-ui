import { nextTick } from 'vue'

import { flushPromises, mount } from '@vue/test-utils'

import { MarkdownEditor, MarkdownOutline } from '../../markdown-editor'
import { expectAccessible } from '../support/axe'

const STRATEGY = `## Who it's for

- Freelancers who send invoices by hand.
- Small studios.

## Voice

Warm and **direct**. Never *pushy*.

> Say what happened, not what it means.

1. One question at a time
2. Then a draft`

const mountEditor = async (props: Record<string, unknown> = {}) => {
  const wrapper = mount(MarkdownEditor, { props: { modelValue: STRATEGY, ...props }, attachTo: document.body })
  await flushPromises()
  await nextTick()
  return wrapper
}

const textbox = (wrapper: Awaited<ReturnType<typeof mountEditor>>) => wrapper.get('[role="textbox"]')

describe('MarkdownEditor', () => {
  it('shows Markdown as formatted text, with a toolbar', async () => {
    const wrapper = await mountEditor({ label: 'Strategy' })

    const doc = textbox(wrapper)
    expect(doc.attributes('aria-label')).toBe('Strategy')
    expect(doc.findAll('h2').map((h) => h.text())).toEqual(["Who it's for", 'Voice'])
    expect(doc.findAll('ul li')).toHaveLength(2)
    expect(doc.findAll('ol li')).toHaveLength(2)
    expect(doc.get('strong').text()).toBe('direct')
    expect(doc.get('em').text()).toBe('pushy')
    expect(doc.get('blockquote').text()).toContain('Say what happened')
    expect(wrapper.get('[role="toolbar"]').attributes('aria-label')).toBe('Formatting')
    expect(wrapper.find('button[aria-label="Heading 2"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Heading 3"]').exists()).toBe(true)
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('emits nothing until someone edits, then the document as Markdown', async () => {
    const wrapper = await mountEditor()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    type Commands = { setTextSelection: (at: number) => boolean; insertContent: (text: string) => boolean }
    const editor = (wrapper.vm.$ as unknown as { setupState: { editor: { commands: Commands } } }).setupState.editor
    editor.commands.setTextSelection(1)
    editor.commands.insertContent('Exactly ')
    await nextTick()

    const markdown = wrapper.emitted('update:modelValue')!.at(-1)![0] as string
    expect(markdown).toContain('## Exactly Who')
    expect(markdown).toContain('- Freelancers who send invoices by hand.')
    expect(markdown).toContain('**direct**')
    expect(markdown).toContain('*pushy*')
    expect(markdown).toContain('> Say what happened')
    expect(markdown).toContain('1. One question at a time')
    wrapper.unmount()
  })

  it('takes a new value from outside without emitting it back', async () => {
    const wrapper = await mountEditor()
    await wrapper.setProps({ modelValue: '## Rhythm\n\nTwice a week.' })
    await nextTick()

    expect(textbox(wrapper).get('h2').text()).toBe('Rhythm')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('lists its headings as an outline', async () => {
    const wrapper = await mountEditor()

    const [headings] = wrapper.emitted('outline')!.at(-1)!
    expect(headings).toEqual([
      { index: 0, level: 2, text: "Who it's for" },
      { index: 1, level: 2, text: 'Voice' }
    ])
    wrapper.unmount()
  })

  it('reads only, without a toolbar', async () => {
    const wrapper = await mountEditor({ readonly: true })

    expect(wrapper.find('[role="toolbar"]').exists()).toBe(false)
    expect(textbox(wrapper).attributes('contenteditable')).toBe('false')
    expect(textbox(wrapper).attributes('aria-readonly')).toBe('true')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('shows the placeholder slot over an empty document', async () => {
    const wrapper = mount(MarkdownEditor, {
      props: { modelValue: '' },
      slots: { placeholder: '<p>Who you write for</p>' },
      attachTo: document.body
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Who you write for')
    await wrapper.setProps({ modelValue: 'Something' })
    await nextTick()
    expect(wrapper.text()).not.toContain('Who you write for')
    wrapper.unmount()
  })
})

describe('MarkdownOutline', () => {
  const headings = [
    { index: 0, level: 2 as const, text: 'Voice' },
    { index: 1, level: 3 as const, text: 'Words to avoid' },
    { index: 2, level: 2 as const, text: 'Rhythm' }
  ]

  it('marks the current heading and picks one', async () => {
    const wrapper = mount(MarkdownOutline, { props: { headings, current: 1 }, attachTo: document.body })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('On this page')
    const buttons = wrapper.findAll('button')
    expect(buttons.map((b) => b.text())).toEqual(['Voice', 'Words to avoid', 'Rhythm'])
    expect(buttons[1]!.attributes('aria-current')).toBe('location')
    expect(buttons[1]!.classes()).toContain('pl-5')
    await buttons[2]!.trigger('click')
    expect(wrapper.emitted('select')).toEqual([[2]])
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('draws nothing without headings', () => {
    const wrapper = mount(MarkdownOutline, { props: { headings: [] } })
    expect(wrapper.find('nav').exists()).toBe(false)
    wrapper.unmount()
  })
})
