import smitter from 'smitter'
import { qsa, on, once } from 'martha'

let index = -1

export default function sqzbx(
  node,
  {
    multiple = false,
    collapsible = false,
    defaultIndex = null,
    resize = true,
  } = {},
) {
  let select = (name) => qsa(`[data-sqzbx-${name}]`, node)
  let uid = ++index
  let emitter = smitter()

  let buttons = select('button')
  let panels = select('panel')
  let items = buttons.map((button, i) => ({
    index: i,
    button,
    panel: panels[i],
    open: i === defaultIndex,
  }))

  function resize() {
    items.map(({ panel }) => {
      panel.style.maxHeight = panel.firstElementChild.clientHeight + 'px'
    })
  }

  function expand(item) {
    let { button, panel } = item

    once(panel, 'transitionend', () => {
      emitter.emit('expanded', item)
    })

    item.open = true

    button.setAttribute('aria-expanded', true)
    panel.removeAttribute('aria-hidden')

    emitter.emit('expand', item)
  }

  function collapse(item, initial) {
    let { button, panel } = item

    !initial &&
      once(panel, 'transitionend', () => {
        emitter.emit('collapsed', item)
      })

    item.open = false

    button.setAttribute('aria-expanded', false)
    panel.setAttribute('aria-hidden', true)

    !initial && emitter.emit('collapse', item)
  }

  function setup(item) {
    let { button, panel, open, index } = item

    button.setAttribute('aria-controls', `sqzbx-panel-${uid}-${index}`)
    button.setAttribute('id', `sqzbx-button-${uid}-${index}`)

    panel.setAttribute('role', 'region')
    panel.setAttribute('aria-labelledby', `sqzbx-button-${uid}-${index}`)
    panel.setAttribute('id', `sqzbx-panel-${uid}-${index}`)

    open ? expand(item) : collapse(item, true)
  }

  return {
    on: emitter.on,
    resize,
    mount() {
      let offResize

      if (resize) {
        offResize = on(window, 'resize', resize)
        resize()
      }

      let offClick = on(buttons, 'click', (_, i) => {
        setup(items[i])

        let otherItems = removeIndexFromArray(items, i)

        if (!item.open) {
          expand(item)
          if (multiple) return
          otherItems.filter((item) => item.open).map(collapse)
        } else {
          collapsible && collapse(item)
        }
      })

      return () => {
        offResize && offResize()
        offClick()
      }
    },
  }
}

function removeIndexFromArray(array, index) {
  const left = array.slice(0, index)
  const right = array.slice(index + 1)
  return left.concat(right)
}
