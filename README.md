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
| **icon** | | `department_store` | The icon shown when no icons are hovered, set to an empty string to show nothing |
| **include** | | `[]` | Only load included categories. Accepts [I18n categories keys](#i18n). Order will be respected, except for the `recent` category which will always be the first. |
| **exclude** | | `[]` | Don't load excluded categories. Accepts [I18n categories keys](#i18n). |
| **custom** | | `[]` | [Custom icons](#custom-icons) |
| **recent** | | | Pass your own frequently used icons as array of string IDs |
| **iconSize** | | `24` | The icon width and height |
| **onClick** | | | Params: `(icon, event) => {}`. Not called when icon is selected with `enter` |
| **onSelect** | | | Params: `(icon) => {}`  |
| **onSkinChange** | | | Params: `(skin) => {}` |
| **perLine** | | `9` | Number of icons per line. While there’s no minimum or maximum, this will affect the picker’s width. This will set *Frequently Used* length as well (`perLine * 4`) |
| **i18n** | | [`{…}`](#i18n) | [An object](#i18n) containing localized strings |
| **native** | | `false` | Renders the native unicode icon |
| **backgroundImageFn** | | ```((set, sheetSize) => …)``` | A Fn that returns that image sheet to use for icons. Useful for avoiding a request if you have the sheet locally. |
| **iconsToShowFilter** | | ```((icon) => true)``` | A Fn to choose whether an icon should be displayed or not |
| **showPreview** | | `true` | Display preview section |
| **showSkinTones** | | `true` | Display skin tones picker. Disable both this and `showPreview` to remove the footer entirely. |
| **iconTooltip** | | `false` | Show icons short name when hovering (title) |
| **style** | | | Inline styles applied to the root element. Useful for positioning |
| **title** | | `Icon Mart™` | The title shown when no icons are hovered |
| **notFoundIcon** | | `sleuth_or_spy` | The icon shown when there are no search results |
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
