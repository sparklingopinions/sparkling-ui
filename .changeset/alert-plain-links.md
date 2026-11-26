---
'@sparklingopinions/sparkling-ui': minor
---

Alert: the icon sits on the text's first line in the tone's colour, without the tile around it, and an inset Alert has more room (18px across, 16px down). Its text is 20px a line, so a title, text and actions below line up with the icon.

Button: new `link` and `link-muted` variants, a button that reads as a link (no box; underlined on hover) for a light next step. Use `link` for the main action and `link-muted` for a second one. In a success, warning or danger Alert, a `link` takes the tone's ink, which keeps 4.5:1 on its ground.

The rule of thumb for an Alert's actions: links when the notice is advice that can be ignored, a button when it blocks the way forward (see Alert's "Link or button" story).
