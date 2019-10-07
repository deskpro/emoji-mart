<div align="center">
  <br><b>Fa Picker</b> is a Slack-like customizable<br>font awesome icon picker component for React
  <br><a href="https://deskpro.github.io/fa-picker">Demo</a> • <a href="https://github.com/deskpro/fa-picker/blob/master/CHANGELOG.md">Changelog</a>
  <br><br><a href="https://travis-ci.org/deskpro/fa-picker"><img src="https://travis-ci.org/deskpro/fa-picker.svg?branch=master" alt="Build Status"></a>
  <br><br><img width="338" alt="picker" src="docs/images/FaIcon.png">
  <br>Brought to you by the <a title="Team email, team chat, team tasks, one app" href="https://deskpro.com">Deskpro</a> team
  
  <br><br>Heavy thanks to <a title="Team email, team chat, team tasks, one app" href="https://missiveapp.com">Missive</a> team for <a href="https://github.com/missive/emoji-mart">Emoji-mart</a>

</div>

## Installation

`npm install --save emoji-mart`

## Components
### Picker
```jsx
import 'icon-mart/css/icon-mart.css'
import { Picker } from 'emoji-mart'

<Picker set='emojione' />
<Picker onSelect={this.addIcon} />
<Picker title='Pick your icon…' icon='hand-point-up' />
<Picker style={{ position: 'absolute', bottom: '20px', right: '20px' }} />
<Picker i18n={{ search: 'Recherche', categories: { search: 'Résultats de recherche', recent: 'Récents' } }} />
```

| Prop | Required | Default | Description |
| ---- | :------: | ------- | ----------- |
| **autoFocus** | | `false` | Auto focus the search input when mounted |
| **color** | | `#ae65c5` | The icon color |
| **icon** | | `department_store` | The emoji shown when no emojis are hovered, set to an empty string to show nothing |
| **include** | | `[]` | Only load included categories. Accepts [I18n categories keys](#i18n). Order will be respected, except for the `recent` category which will always be the first. |
| **exclude** | | `[]` | Don't load excluded categories. Accepts [I18n categories keys](#i18n). |
| **custom** | | `[]` | [Custom emojis](#custom-emojis) |
| **recent** | | | Pass your own frequently used emojis as array of string IDs |
| **iconSize** | | `24` | The emoji width and height |
| **onClick** | | | Params: `(emoji, event) => {}`. Not called when emoji is selected with `enter` |
| **onSelect** | | | Params: `(emoji) => {}`  |
| **onSkinChange** | | | Params: `(skin) => {}` |
| **perLine** | | `9` | Number of emojis per line. While there’s no minimum or maximum, this will affect the picker’s width. This will set *Frequently Used* length as well (`perLine * 4`) |
| **i18n** | | [`{…}`](#i18n) | [An object](#i18n) containing localized strings |
| **native** | | `false` | Renders the native unicode emoji |
| **set** | | `apple` | The emoji set: `'apple', 'google', 'twitter', 'emojione', 'messenger', 'facebook'` |
| **sheetSize** | | `64` | The emoji [sheet size](#sheet-sizes): `16, 20, 32, 64` |
| **backgroundImageFn** | | ```((set, sheetSize) => …)``` | A Fn that returns that image sheet to use for emojis. Useful for avoiding a request if you have the sheet locally. |
| **emojisToShowFilter** | | ```((emoji) => true)``` | A Fn to choose whether an emoji should be displayed or not |
| **showPreview** | | `true` | Display preview section |
| **showSkinTones** | | `true` | Display skin tones picker. Disable both this and `showPreview` to remove the footer entirely. |
| **emojiTooltip** | | `false` | Show emojis short name when hovering (title) |
| **style** | | | Inline styles applied to the root element. Useful for positioning |
| **title** | | `Emoji Mart™` | The title shown when no emojis are hovered |
| **notFoundEmoji** | | `sleuth_or_spy` | The emoji shown when there are no search results |
| **notFound** | | | [Not Found](#not-found) |
| **icons** | | `{}` | [Custom icons](#custom-icons) |

#### I18n
```js
search: 'Search',
clear: 'Clear', // Accessible label on "clear" button
notfound: 'No Icon Found',
colortext: 'Choose your color',
categories: {
  search: 'Search Results',
  recent: 'Frequently Used',
  custom: 'Custom',
},
```

**Tip:** You usually do not need to translate the categories and skin tones by youself, because this data and their translations [should be included in the Unicode CLDR](http://cldr.unicode.org/) (the ["Common Locale Data Repository"](https://en.wikipedia.org/wiki/Common_Locale_Data_Repository)). You can look them up and just take them from there.

#### Examples of `emoji` object:
```js
{
  id: 'smiley',
  name: 'Smiling Face with Open Mouth',
  colons: ':smiley:',
  text: ':)',
  emoticons: [
    '=)',
    '=-)'
  ],
  skin: null,
  native: '😃'
}

{
  id: 'santa',
  name: 'Father Christmas',
  colons: ':santa::skin-tone-3:',
  text: '',
  emoticons: [],
  skin: 3,
  native: '🎅🏼'
}

{
  id: 'octocat',
  name: 'Octocat',
  colons: ':octocat:',
  text: '',
  emoticons: [],
  custom: true,
  imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png'
}

```
