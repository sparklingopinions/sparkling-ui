// What jsdom lacks, having no layout: scrollIntoView (Reka calls it when it highlights an option) and
// ResizeObserver (Textarea's autoResize watches its size).
Element.prototype.scrollIntoView ??= () => {}

globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
