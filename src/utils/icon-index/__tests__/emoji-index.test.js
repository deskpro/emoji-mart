import iconIndex from '../icon-index.js'

test('should work', () => {
  expect(iconIndex.search('wheelchair')).toEqual([
    'accessible-icon',
    'crutch',
    'wheelchair',
  ])
})

test('should filter only icons we care about, exclude pineapple', () => {
  let iconsToShowFilter = (data) => {
    data !== 'deskpro'
  }
  expect(iconIndex.search('desk', { iconsToShowFilter })).not.toContain(
    'deskpro',
  )
})

test('can search for thinking_face', () => {
  expect(iconIndex.search('fort awesome')).toEqual([
    'fort-awesome',
    'fort-awesome-alt',
  ])
})

test('can search for smile-beam', () => {
  expect(iconIndex.search('deskp')).toEqual(['deskpro'])
})
