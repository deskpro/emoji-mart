import icons from '../../../data/icons.yml'
import categories from '../../../data/categories.yml'
import NimbleIconIndex from './nimble-icon-index'

const iconIndex = new NimbleIconIndex({ icons, categories })
const { emoticons } = iconIndex

function search() {
  return iconIndex.search(...arguments)
}

export default { search, emoticons }
