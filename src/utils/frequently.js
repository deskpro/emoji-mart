import store from './store'

const DEFAULTS = []

let frequently, initialized
let defaults = {}

function init() {
  initialized = true
  frequently = store.get('frequently')
}

function add(icon) {
  if (!initialized) init()

  frequently || (frequently = defaults)
  frequently[icon] || (frequently[icon] = 0)
  frequently[icon] += 1

  store.set('last', icon)
  store.set('frequently', frequently)
}

function get(perLine) {
  if (!initialized) init()
  if (!frequently) {
    defaults = {}

    const result = []

    for (let i = 0; i < perLine; i++) {
      if (DEFAULTS[i]) {
        defaults[DEFAULTS[i]] = perLine - i
        result.push(DEFAULTS[i])
      }
    }

    return result
  }

  const quantity = perLine * 4
  const frequentlyKeys = []

  for (let key in frequently) {
    if (frequently.hasOwnProperty(key)) {
      frequentlyKeys.push(key)
    }
  }

  const sorted = frequentlyKeys
    .sort((a, b) => frequently[a] - frequently[b])
    .reverse()
  const sliced = sorted.slice(0, quantity)

  const last = store.get('last')

  if (last && sliced.indexOf(last) == -1) {
    sliced.pop()
    sliced.push(last)
  }

  return sliced
}

export default { add, get }
