// jsdom has no layout, so no scrollIntoView; Reka calls it when it highlights an option.
Element.prototype.scrollIntoView ??= () => {}
