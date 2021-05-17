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

Apply `data-sqzbx-button` and `data-sqzbx-panel` attributes as illustrated below. `sqzbx` doesn't care about the structure of your markup as long as the following are true:

- There are an equal number of `data-sqzbx-button` elements and `data-sqzbx-panel` elements
- All `data-sqzbx-button` elements are actually [buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- All `data-sqzbx-panel` elements contain exactly 1 child element

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

Add some CSS. Below are the _minimal recommended styles_, but [here is a more advanced example](index.html)

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

## Options

`sqzbx` takes an options object as its second parameter

```js
sqzbx(element, options)
```

<!--
multiple = false,
collapsible = false,
defaultIndex = null,
resize = true, -->

### `multiple`

> default: `false`

When `multiple` is set to `true`, any number of panels may be open at the same time. By default, when a user opens a new accordion item, the previously open item will collapse.

### `collapsible`

> default: `false`

When `collapsible` is set to `true`, panels that are already open may be collapsed. By default, open panels only collapse when a user opens a different one.

### `defaultIndex`

> default: `null`

Sets the initially expanded accordion item.

### `resize`

> default: `true`

In order to make animation easy, `sqzbx` measures the height of the `firstElementChild` for each panel and automatically updates these values on window resize. Set `resize` to `false` to remove this automatic resize behavior and call the `.resize()` method manually.

## Events

### expand

Fired immediately after a user selects a new accordion item.

```js
accordion.on('expand', ({ index, button, panel, expanded }) => {})
```

### collapse

Fired immediately after an accordion item is collapsed.

```js
accordion.on('collapse', ({ index, button, panel, expanded }) => {})
```

### expanded

Fired on expanding panel `transitionend` (which means that this event only fires if the panel has a CSS transition).

```js
accordion.on('expanded', ({ index, button, panel, expanded }) => {})
```

### collapsed

Fired on collapsing panel `transitionend` (which means that this event only fires if the panel has a CSS transition).

```js
accordion.on('collapsed', ({ index, button, panel, expanded }) => {})
```

## Event Order

When a user opens a new panel…

A. With default options:

1. `expand`
2. `collapse`

B. With default options and CSS transitions applied to panels:

1. `expand`
2. `collapse`
3. `collapsed`
4. `expanded`
