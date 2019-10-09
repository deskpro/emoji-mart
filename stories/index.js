import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
} from '@storybook/addon-knobs'

import { Picker, Icon, iconIndex, NimbleIconIndex } from '../dist'
import '@fortawesome/fontawesome-free/css/all.css';
import '../css/icon-mart.css'

const CUSTOM_ICONS = [
  {
    name: 'Octocat',
    short_names: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
  },
  {
    name: 'Squirrel',
    short_names: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://github.githubassets.com/images/icons/emoji/shipit.png',
  },
]

storiesOf('Picker', module)
  .addDecorator(withKnobs)
  .add('Default', () => (
    <Picker
      onClick={action('clicked')}
      onSelect={action('selected')}
      onSkinChange={action('skin changed')}
      native={boolean('Unicode', true)}
      iconSize={number('Icon size', 24)}
      perLine={number('Per line', 9)}
      title={text('Idle text', 'Your Title Here')}
      icon={text('Idle icon', 'department_store')}
      notFoundIcon={text('Not found icon', 'sleuth_or_spy')}
      color={color('Icon color', '#495057')}
      showPreview={boolean('Show preview', true)}
      showSkinTones={boolean('Show skin tones', true)}
      custom={CUSTOM_ICONS}
    />
  ))

  .add('Custom “Not found” component', () => (
    <Picker
      notFound={() => (
        <img src="https://github.githubassets.com/images/icons/emoji/octocat.png" />
      )}
    />
  ))

  .add('Custom category icons', () => (
    <Picker
      custom={CUSTOM_ICONS}
    />
  ))

  .add('Custom skin icon', () => (
    <Picker
      native={boolean('Unicode', true)}
      iconSize={24}
      skinIcon={text('Skin Preview Icon', 'v')}
    />
  ))

storiesOf('Icon', module)
  .addDecorator(withKnobs)
  .add('Default', () => (
    <Icon
      native={boolean('Unicode', true)}
      icon={text('Icon', '+1')}
      size={number('Icon size', 64)}
      skin={number('Skin tone', 1)}
      html={boolean('HTML', false)}
      fallback={(icon, props) => {
        return icon ? `:${icon.short_names[0]}:` : props.icon
      }}
    />
  ))

storiesOf('Headless Search', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    let results = iconIndex.search(text('Search', 'christmas'), {
      custom: CUSTOM_ICONS,
    })
    if (!results) {
      return null
    }

    return (
      <div>
        {results.map((icon) => {
          return (
            <span key={icon.id} style={{ marginLeft: '1.4em' }}>
              <Icon native={true} icon={icon} size={48} />
            </span>
          )
        })}
      </div>
    )
  })

  .add('With skin tone from store', () => {
    const nimbleIconIndex = new NimbleIconIndex(data)
    let results = nimbleIconIndex.search(text('Search', 'thumbs'), {
      custom: CUSTOM_ICONS,
    })
    if (!results) {
      return null
    }

    return (
      <div>
        {results.map((icon) => {
          return (
            <span key={icon.id} style={{ marginLeft: '1.4em' }}>
              <Icon
                native={true}
                icon={icon}
                skin={icon.skin || 1}
                size={48}
              />
            </span>
          )
        })}
      </div>
    )
  })

