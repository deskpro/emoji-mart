import React from 'react'
import NotFound from '../not-found'
import renderer from 'react-test-renderer'

import icons from '../../../data/icons.yml'
import categories from '../../../data/categories.yml'

const i18n = {
  notfound: 'No Emoji Found',
}

test('Renders <NotFound> component', () => {
  const emojiProps = {
    native: true,
    skin: 1,
    size: 24,
    set: 'apple',
    sheetSize: 64,
    forceSize: true,
    tooltip: false,
  }
  const component = renderer.create(
    <NotFound
      data={{ icons, categories }}
      notFound={() => {}}
      notFoundEmoji={'sleuth_or_spy'}
      emojiProps={emojiProps}
      i18n={i18n}
    />,
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
