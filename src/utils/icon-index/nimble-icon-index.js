import { getData, getSanitizedData, intersect } from '..'

export default class NimbleIconIndex {
  constructor(data, set) {
    this.data = data || {}
    this.set = set || null
    this.originalPool = {}
    this.index = {}
    this.icons = {}
    this.customEmojisList = []

    this.buildIndex()
  }

  buildIndex() {
    for (let icon in this.data.icons) {
      let iconData = this.data.icons[icon],
        { short_names, search, label } = iconData,
        id = icon

      this.icons[id] = id

      this.originalPool[id] = iconData
    }
  }

  clearCustomEmojis(pool) {
    this.customEmojisList.forEach((emoji) => {
      let emojiId = emoji.id || emoji.short_names[0]

      delete pool[emojiId]
      delete this.icons[emojiId]
    })
  }

  addCustomToPool(custom, pool) {
    if (this.customEmojisList.length) this.clearCustomEmojis(pool)

    custom.forEach((emoji) => {
      let emojiId = emoji.id || emoji.short_names[0]

      if (emojiId && !pool[emojiId]) {
        pool[emojiId] = getData(emoji, null, null, this.data)
        this.icons[emojiId] = getSanitizedData(emoji, null, null, this.data)
      }
    })

    this.customEmojisList = custom
    this.index = {}
  }

  search(
    value,
    { iconsToShowFilter, maxResults, include, exclude, custom = [] } = {},
  ) {
    maxResults || (maxResults = 75)
    include || (include = [])
    exclude || (exclude = [])

    var results = null,
      pool = this.originalPool

    if (value.length) {
      var values = value.toLowerCase().split(/[\s|,|\-|_]+/),
        allResults = []

      if (values.length > 2) {
        values = [values[0], values[1]]
      }

      if (include.length || exclude.length) {
        pool = {}

        this.data.categories.forEach((category) => {
          let isIncluded =
            include && include.length ? include.indexOf(category.id) > -1 : true
          let isExcluded =
            exclude && exclude.length
              ? exclude.indexOf(category.id) > -1
              : false
          if (!isIncluded || isExcluded) {
            return
          }

          category.icons.forEach(
            (iconId) => (pool[iconId] = this.data.icons[iconId]),
          )
        })

        if (custom.length) {
          let customIsIncluded =
            include && include.length ? include.indexOf('custom') > -1 : true
          let customIsExcluded =
            exclude && exclude.length ? exclude.indexOf('custom') > -1 : false
          if (customIsIncluded && !customIsExcluded) {
            this.addCustomToPool(custom, pool)
          }
        }
      }

      allResults = values
        .map((value) => {
          var aPool = pool,
            aIndex = this.index,
            length = 0

          for (let charIndex = 0; charIndex < value.length; charIndex++) {
            const char = value[charIndex]
            length++

            aIndex[char] || (aIndex[char] = {})
            aIndex = aIndex[char]

            if (!aIndex.results) {
              let scores = {}

              aIndex.results = []
              aIndex.pool = {}

              for (let id in aPool) {
                let emoji = aPool[id],
                  { search } = emoji,
                  sub = value.substr(0, length),
                  subIndex = -1
                let term = search.terms.find((term) => term.indexOf(sub) != -1)
                if (term) {
                  subIndex = term.indexOf(sub)
                } else {
                  subIndex = id.indexOf(sub)
                }

                if (subIndex != -1) {
                  let score = subIndex + 1
                  if (sub == id) score = 0

                  aIndex.results.push(this.icons[id])
                  aIndex.pool[id] = emoji

                  scores[id] = score
                }
              }

              aIndex.results.sort((a, b) => {
                var aScore = scores[a.id],
                  bScore = scores[b.id]

                if (aScore == bScore) {
                  return a.localeCompare(b)
                } else {
                  return aScore - bScore
                }
              })
            }

            aPool = aIndex.pool
          }

          return aIndex.results
        })
        .filter((a) => a)

      if (allResults.length > 1) {
        results = intersect.apply(null, allResults)
      } else if (allResults.length) {
        results = allResults[0]
      } else {
        results = []
      }
    }

    if (results) {
      if (iconsToShowFilter) {
        results = results.filter((result) =>
          iconsToShowFilter(pool[result.id]),
        )
      }

      if (results && results.length > maxResults) {
        results = results.slice(0, maxResults)
      }
    }

    return results
  }
}
