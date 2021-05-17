# sqzbx

🎹 An accessible accordion in <1kb

## Features

- 🔬 Tiny (<1kb gzipped)
- 💕 Accessible by default
- ✨ Easy to style and animate
- ⚙️ Highly configurable

## Installation

```
npm i sqzbx
```

## Usage

### Markup

Set up your markup and apply `data-sqzbx-button` and `data-sqzbx-panel` attributes as illustrated below. These attributes _can_ be nested. The only rules are as follows:

- [x] There should be an equal number of `data-sqzbx-button` elements and `data-sqzbx-panel` elements
- [x] All `data-sqzbx-panel` elements must contain exactly 1 child element

> 💡 Be sure to use `<button>` for your `data-sqzbx-button` elements

```html
<div class="accordion">
  <button data-sqzbx-button>Button 1</button>
  <div data-sqzbx-panel>
    <p>Panel 1</p>
  </div>
  <button data-sqzbx-button>Button 2</button>
  <div data-sqzbx-panel>
    <p>Panel 2</p>
  </div>
  <button data-sqzbx-button>Button 3</button>
  <div data-sqzbx-panel>
    <p>Panel 3</p>
  </div>
</div>
```

### CSS

Add some CSS. Below are the _minimal recommended styles_, but you can [check out some more advanced examples here](index.html).

```css
[data-sqzbx-panel] {
  overflow: hidden;
  max-height: 0;
}

[data-sqzbx-panel][aria-hidden='true'] {
  max-height: 0 !important;
}
```

### JavaScript

Initialize and mount sqxbx

```js
import sqzbx from 'sqzbx'

const element = document.querySelector('.accordion')
const accordion = sqzbx(element)

accordion.mount()
```
