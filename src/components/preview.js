import React from 'react'
import PropTypes from 'prop-types'

import { getData } from '../utils'
import Icon from './icon/icon'
import ColorDot from './color-dot'

export default class Preview extends React.PureComponent {
  constructor(props) {
    super(props)

    this.data = props.data
    this.state = { icon: null }
  }

  render() {
    var { icon } = this.state,
      {
        emojiProps,
        colorsProps,
        showColorPicker,
        title,
        icon: idleEmoji,
        i18n,
        showPreview,
      } = this.props

    if (icon && showPreview) {
      var iconData = getData(icon, null, null, this.data),
        { emoticons = [] } = iconData,
        knownEmoticons = [],
        listedEmoticons = []

      emoticons.forEach((emoticon) => {
        if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
          return
        }

        knownEmoticons.push(emoticon.toLowerCase())
        listedEmoticons.push(emoticon)
      })

      return (
        <div className="emoji-mart-preview">
          <div className="emoji-mart-preview-emoji" aria-hidden="true">
            {Icon({
              key: icon.id,
              icon,
              data: this.data,
              ...emojiProps,
            })}
          </div>

          <div className="emoji-mart-preview-data" aria-hidden="true">
            <div className="emoji-mart-preview-name">{iconData.label}</div>
          </div>
          {showColorPicker && (
            <div
              className={`emoji-mart-preview-color${
                colorsProps.skinEmoji ? ' custom' : ''
              }`}
            >
              <ColorDot
                color={colorsProps.color}
                i18n={i18n}
                onChange={colorsProps.onChange}
              />
            </div>
          )}
        </div>
      )
    } else {
      return (
        <div className="emoji-mart-preview">
          <div className="emoji-mart-preview-emoji" aria-hidden="true">
            {idleEmoji &&
              idleEmoji.length &&
              Icon({ icon: idleEmoji, data: this.data, ...emojiProps })}
          </div>

          <div className="emoji-mart-preview-data" aria-hidden="true">
            <span className="emoji-mart-title-label">{title}</span>
          </div>

          {showColorPicker && (
            <div
              className={`emoji-mart-preview-color${
                colorsProps.skinEmoji ? ' custom' : ''
              }`}
            >
              <ColorDot
                color={colorsProps.color}
                i18n={i18n}
                onChange={colorsProps.onChange}
              />
            </div>
          )}
        </div>
      )
    }
  }
}

Preview.propTypes /* remove-proptypes */ = {
  showColorPicker: PropTypes.bool,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  emojiProps: PropTypes.object.isRequired,
  colorsProps: PropTypes.object.isRequired,
}

Preview.defaultProps = {
  showColorPicker: true,
  onChange: () => {},
}
