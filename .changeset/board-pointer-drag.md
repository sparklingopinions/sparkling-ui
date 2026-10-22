---
'@sparklingopinions/sparkling-ui': minor
---

`Board` drags with pointer events instead of the browser's drag and drop, so cards move with a finger too. A mouse drags once it moves a few pixels, so a click still clicks. A finger drags after a short press, so a swipe still scrolls the page. A copy of the card follows the pointer, a column scrolls near its top and bottom, the board scrolls near its sides, and Escape cancels. `move` is emitted as before.

Cards are buttons only when you listen to `card-click` (Enter and Space open them, as before). Without a listener, the card slot carries its own link or buttons, so a card with a menu no longer nests buttons. `cardFrame: false` drops the card's border, padding and surface, for a slot that draws its own.
