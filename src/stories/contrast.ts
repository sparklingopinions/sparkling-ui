// For a story that shows one of MustLoop's text pairs below WCAG AA, kept until a fix is agreed: turns off only
// axe's contrast rule. Name the pair where it's used; Foundations/Contrast gaps lists them all.
export const contrastGap = { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } }
