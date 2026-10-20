import { mount } from '@vue/test-utils'

import { ImageUpload } from '../../index'
import { expectAccessible } from '../support/axe'

const file = (type = 'image/png') => new File(['x'], 'logo.png', { type })

function pickFile(wrapper: ReturnType<typeof mount>, picked: File) {
  const input = wrapper.get('input[type="file"]').element as HTMLInputElement
  Object.defineProperty(input, 'files', { value: [picked], configurable: true })
  input.dispatchEvent(new Event('change'))
}

describe('ImageUpload', () => {
  let made = 0
  beforeEach(() => {
    made = 0
    URL.createObjectURL = vi.fn(() => `blob:preview-${++made}`)
    URL.revokeObjectURL = vi.fn()
  })

  it('is a named drop zone and an upload button, with a hint', async () => {
    const wrapper = mount(ImageUpload, { attachTo: document.body })

    expect(wrapper.get('[role="button"]').attributes('aria-label')).toBe('Choose an image')
    expect(wrapper.findAll('button').map((b) => b.text())).toEqual(['Upload'])
    expect(wrapper.text()).toContain('PNG or JPG, at least 512×512.')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('takes a picked PNG or JPG, previews it, and ignores other files', async () => {
    const wrapper = mount(ImageUpload)
    pickFile(wrapper, file('image/gif'))
    expect(wrapper.emitted('change')).toBeUndefined()

    const png = file()
    pickFile(wrapper, png)
    expect(wrapper.emitted('change')?.[0]).toEqual([png])
    expect(wrapper.emitted('update:image')?.[0]).toEqual([png])
    expect(wrapper.emitted('update:imageUrl')?.[0]).toEqual(['blob:preview-1'])
  })

  it('takes a dropped file', async () => {
    const wrapper = mount(ImageUpload)
    const zone = wrapper.get('[role="button"]')
    await zone.trigger('dragover')
    expect(zone.classes()).toContain('border-sui-accent-solid')

    const jpg = file('image/jpeg')
    await zone.trigger('drop', { dataTransfer: { files: [jpg] } })
    expect(wrapper.emitted('change')?.[0]).toEqual([jpg])
    expect(zone.classes()).not.toContain('border-sui-accent-solid')
  })

  it('replaces and removes a preview, revoking the URL it made', async () => {
    const wrapper = mount(ImageUpload, {
      props: { 'onUpdate:imageUrl': (url: string | null) => wrapper.setProps({ imageUrl: url }) }
    })
    pickFile(wrapper, file())
    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').attributes('src')).toBe('blob:preview-1')
    expect(wrapper.findAll('button').map((b) => b.text())).toEqual(['Replace', 'Remove'])

    await wrapper.findAll('button')[1]!.trigger('click')
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview-1')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
