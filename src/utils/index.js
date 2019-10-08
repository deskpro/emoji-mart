import stringFromCodePoint from '../polyfills/stringFromCodePoint'

const _JSON = JSON

const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/
const SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF']

function unifiedToNative(unified) {
  var unicodes = unified.split('-'),
    codePoints = unicodes.map((u) => `0x${u}`)

  return stringFromCodePoint.apply(null, codePoints)
}

function sanitize(emoji) {
  var {
      name,
      short_names,
      skin_tone,
      skin_variations,
      emoticons,
      unified,
      custom,
      imageUrl,
    } = emoji,
    id = emoji.id || short_names[0],
    colons = `:${id}:`

  if (custom) {
    return {
      id,
      name,
      short_names,
      colons,
      emoticons,
      custom,
      imageUrl,
    }
  }

  if (skin_tone) {
    colons += `:skin-tone-${skin_tone}:`
  }

  return {
    id,
    name,
    short_names,
    colons,
    emoticons,
    unified: unified.toLowerCase(),
    skin: skin_tone || (skin_variations ? 1 : null),
    native: unifiedToNative(unified),
  }
}

function getSanitizedData() {
  return sanitize(getData(...arguments))
}

function getIcon() {}

function getData(icon, skin, set, data) {
  var iconData = {}

  if (!icon) {
    return null
  }

  if (typeof icon == 'string') {
    let matches = icon.match(COLONS_REGEX)

    if (matches) {
      icon = matches[1]

      if (matches[2]) {
        skin = parseInt(matches[2], 10)
      }
    }

    if (data.icons.hasOwnProperty(icon)) {
      iconData = data.icons[icon]
    } else {
      return null
    }
  } else if (icon.id) {
    if (data.icons.hasOwnProperty(icon.id)) {
      iconData = data.icons[icon.id]
      skin || (skin = icon.skin)
    }
  }

  if (!Object.keys(iconData).length) {
    iconData = icon
    iconData.custom = true
  }

  if (iconData.skin_variations && skin > 1) {
    iconData = JSON.parse(_JSON.stringify(iconData))

    var skinKey = SKINS[skin - 1],
      variationData = iconData.skin_variations[skinKey]

    if (!variationData.variations && iconData.variations) {
      delete iconData.variations
    }

    if (
      (set &&
        (variationData[`has_img_${set}`] == undefined ||
          variationData[`has_img_${set}`])) ||
      !set
    ) {
      iconData.skin_tone = skin

      for (let k in variationData) {
        let v = variationData[k]
        iconData[k] = v
      }
    }
  }

  if (iconData.variations && iconData.variations.length) {
    iconData = JSON.parse(_JSON.stringify(iconData))
    iconData.unified = iconData.variations.shift()
  }

  return iconData
}

function getEmojiDataFromNative(nativeString, set, data) {
  const skinTones = ['🏻', '🏼', '🏽', '🏾', '🏿']
  const skinCodes = ['1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF']

  let skin
  let skinCode
  let baseNativeString = nativeString

  skinTones.forEach((skinTone, skinToneIndex) => {
    if (nativeString.indexOf(skinTone) > 0) {
      skin = skinToneIndex + 2
      skinCode = skinCodes[skinToneIndex]
    }
  })

  let emojiData

  for (let id in data.emojis) {
    let emoji = data.emojis[id]

    let emojiUnified = emoji.unified

    if (emoji.variations && emoji.variations.length) {
      emojiUnified = emoji.variations.shift()
    }

    if (skin && emoji.skin_variations && emoji.skin_variations[skinCode]) {
      emojiUnified = emoji.skin_variations[skinCode].unified
    }

    if (unifiedToNative(emojiUnified) === baseNativeString) emojiData = emoji
  }

  if (!emojiData) {
    return null
  }

  emojiData.id = emojiData.short_names[0]

  return getSanitizedData(emojiData, skin, set, data)
}

function uniq(arr) {
  return arr.reduce((acc, item) => {
    if (acc.indexOf(item) === -1) {
      acc.push(item)
    }
    return acc
  }, [])
}

function intersect(a, b) {
  const uniqA = uniq(a)
  const uniqB = uniq(b)

  return uniqA.filter((item) => uniqB.indexOf(item) >= 0)
}

function deepMerge(a, b) {
  var o = {}

  for (let key in a) {
    let originalValue = a[key],
      value = originalValue

    if (b.hasOwnProperty(key)) {
      value = b[key]
    }

    if (typeof value === 'object') {
      value = deepMerge(originalValue, value)
    }

    o[key] = value
  }

  return o
}

// https://github.com/sonicdoe/measure-scrollbar
function measureScrollbar() {
  if (typeof document == 'undefined') return 0
  const div = document.createElement('div')

  div.style.width = '100px'
  div.style.height = '100px'
  div.style.overflow = 'scroll'
  div.style.position = 'absolute'
  div.style.top = '-9999px'

  document.body.appendChild(div)
  const scrollbarWidth = div.offsetWidth - div.clientWidth
  document.body.removeChild(div)

  return scrollbarWidth
}

// Use requestIdleCallback() if available, else fall back to setTimeout().
// Throttle so as not to run too frequently.
function throttleIdleTask(func) {
  const doIdleTask =
    typeof requestIdleCallback === 'function' ? requestIdleCallback : setTimeout

  let running = false

  return function throttled() {
    if (running) {
      return
    }
    running = true
    doIdleTask(() => {
      running = false
      func()
    })
  }
}

export {
  getData,
  getEmojiDataFromNative,
  getSanitizedData,
  uniq,
  intersect,
  deepMerge,
  unifiedToNative,
  measureScrollbar,
  throttleIdleTask,
}
