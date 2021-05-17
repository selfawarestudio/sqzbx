import smitter from 'smitter'
import { noop, qsa, on, once } from 'martha'

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

  let offResize = noop
  let uid = ++index

  let emitter = smitter()
  let events = []

  let buttons = select('button')
  let panels = select('panel')

  let items = buttons.map((button, i) => ({
    index: i,
    button,
    panel: panels[i],
    expanded: i === defaultIndex,
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

    item.expanded = true

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

    item.expanded = false

    button.setAttribute('aria-expanded', false)
    panel.setAttribute('aria-hidden', true)

    !initial && emitter.emit('collapse', item)
  }

  function setup(item) {
    let { button, panel, expanded, index } = item

    button.setAttribute('aria-controls', `sqzbx-panel-${uid}-${index}`)
    button.setAttribute('id', `sqzbx-button-${uid}-${index}`)

    panel.setAttribute('role', 'region')
    panel.setAttribute('aria-labelledby', `sqzbx-button-${uid}-${index}`)
    panel.setAttribute('id', `sqzbx-panel-${uid}-${index}`)

    expanded ? expand(item) : collapse(item, true)
  }

  return {
    on: emitter.on,
    resize,
    mount() {
      if (resize) {
        offResize = on(window, 'resize', resize)
        resize()
      }

      events.concat(
        items.map((item, i) => {
          setup(item)
          return on(item.button, 'click', () => {
            let otherItems = removeIndexFromArray(items, i)

            if (!item.expanded) {
              expand(item)
              if (multiple) return
              otherItems.filter((item) => item.expanded).map(collapse)
            } else {
              collapsible && collapse(item)
            }
          })
        }),
      )
    },
    unmount() {
      offResize()
      events.map((off) => off())
    },
  }
}

function removeIndexFromArray(array, index) {
  const left = array.slice(0, index)
  const right = array.slice(index + 1)
  return left.concat(right)
}
