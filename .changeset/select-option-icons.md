---
'@sparklingopinions/sparkling-ui': minor
---

`Select` options take an `icon` and `iconColor`, like a `Board` column, for a status or a stage shown by its icon:

```ts
{ value: 'follow_up', label: 'Follow-up', icon: 'bell-ring', iconColor: 'warning' }
```

- The icon sits before the label in the list and in the trigger, 16px, in `ink-subtle` unless `iconColor` says otherwise. It's decorative: the label still names the option.
- A coloured option's Tag, the tags of a `multiple` select and the outline Tag a `PropertyList` select field shows all carry it too.
- `Tag` takes `icon` and `iconColor` itself: a 14px icon before the name, on soft and outline tags, in place of the hue dot.
