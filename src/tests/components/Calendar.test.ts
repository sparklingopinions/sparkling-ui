import { mount } from '@vue/test-utils'

import { Calendar } from '../../index'
import { addDays, differenceInDays, startOfWeek } from '../../utils/dates'
import { expectAccessible } from '../support/axe'

const days = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('.grid.gap-y-0\\.5 button')

describe('Calendar', () => {
  // Only the clock: axe needs real timers.
  beforeEach(() => vi.useFakeTimers({ now: new Date(2026, 9, 20, 12), toFake: ['Date'] }))
  afterEach(() => vi.useRealTimers())

  it('lays out the month in weeks from Monday, with today marked', async () => {
    const wrapper = mount(Calendar, { props: { locale: 'en-US' }, attachTo: document.body })

    expect(wrapper.text()).toContain('October 2026')
    // 1 October 2026 is a Thursday: the grid starts on Monday 28 September and ends on Sunday 1 November.
    expect(days(wrapper)).toHaveLength(35)
    expect(days(wrapper)[0]!.text()).toBe('28')
    expect(
      days(wrapper)
        .find((d) => d.attributes('aria-current') === 'date')
        ?.text()
    ).toBe('20')
    await expectAccessible(wrapper.element)
    wrapper.unmount()
  })

  it('names the weekdays in its locale', () => {
    const weekdays = (locale: string) =>
      mount(Calendar, { props: { locale } })
        .findAll('[aria-hidden="true"] span')
        .map((day) => day.text())
    expect(weekdays('en-US')).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S'])
    expect(weekdays('fr-FR')).toEqual(['L', 'M', 'M', 'J', 'V', 'S', 'D'])
  })

  it('emits the day picked', async () => {
    const wrapper = mount(Calendar)
    await days(wrapper)[10]!.trigger('click')

    expect(wrapper.emitted('pick')?.[0]?.[0]).toEqual(new Date(2026, 9, 8))
  })

  it('selects a day, or draws a range as a band', () => {
    const day = mount(Calendar, { props: { start: new Date(2026, 9, 9) } })
    expect(
      days(day)
        .filter((d) => d.attributes('aria-pressed') === 'true')
        .map((d) => d.text())
    ).toEqual(['9'])

    const range = mount(Calendar, { props: { start: new Date(2026, 9, 4), end: new Date(2026, 9, 15) } })
    const banded = days(range).filter((d) => d.classes().includes('bg-sui-accent-wash'))
    expect(banded.map((d) => d.text())).toEqual(['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'])
    // Rounded where it starts, where it wraps to a new week, and where it ends.
    expect(banded[0]!.classes()).toContain('rounded-l-lg')
    expect(banded[0]!.classes()).toContain('rounded-r-lg')
    expect(banded[1]!.classes()).toContain('rounded-l-lg')
    expect(banded.at(-1)!.classes()).toContain('rounded-r-lg')
  })

  it('moves between months, and follows the selection', async () => {
    const wrapper = mount(Calendar, { props: { locale: 'en-US' } })
    await wrapper.get('button[aria-label="Next month"]').trigger('click')
    expect(wrapper.text()).toContain('November 2026')

    await wrapper.setProps({ start: new Date(2027, 1, 3) })
    expect(wrapper.text()).toContain('February 2027')
  })
})

describe('date helpers', () => {
  it('count calendar days across a daylight saving change, and find Mondays', () => {
    expect(differenceInDays(new Date(2026, 10, 2), new Date(2026, 9, 20))).toBe(13)
    expect(addDays(new Date(2026, 2, 28), 2).getDate()).toBe(30)
    expect(startOfWeek(new Date(2026, 9, 25)).getDate()).toBe(19)
    expect(startOfWeek(new Date(2026, 9, 19)).getDate()).toBe(19)
  })
})
