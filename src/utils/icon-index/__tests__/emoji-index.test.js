import emojiIndex from '../icon-index.js'

test('should work', () => {
  expect(emojiIndex.search('wheelchair')).toEqual([
    'accessible-icon',
    'crutch',
    'wheelchair',
  ])
})

test('should filter only emojis we care about, exclude pineapple', () => {
  let emojisToShowFilter = (data) => {
    data !== 'deskpro'
  }
  expect(emojiIndex.search('desk', { emojisToShowFilter })).not.toContain(
    'deskpro',
  )
})

test('can search for thinking_face', () => {
  expect(emojiIndex.search('fort awesome')).toEqual([
    'fort-awesome',
    'fort-awesome-alt',
  ])
})

test('can search for smile-beam', () => {
  expect(emojiIndex.search('deskp')).toEqual(['deskpro'])
})
