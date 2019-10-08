import React from 'react'
import PropTypes from 'prop-types'

import frequently from '../utils/frequently'
import { getData } from '../utils'
import Icon from './icon/icon'
import NotFound from './not-found'

export default class Category extends React.Component {
  constructor(props) {
    super(props)

    this.data = props.data
    this.setContainerRef = this.setContainerRef.bind(this)
    this.setLabelRef = this.setLabelRef.bind(this)
  }

  componentDidMount() {
    this.margin = 0
    this.minMargin = 0

    this.memoizeSize()
  }

  shouldComponentUpdate(nextProps, nextState) {
    var {
        name,
        perLine,
        native,
        hasStickyPosition,
        icons,
        iconProps,
      } = this.props,
      { color, size, set } = iconProps,
      {
        perLine: nextPerLine,
        native: nextNative,
        hasStickyPosition: nextHasStickyPosition,
        icons: nextIcons,
        iconProps: nextIconProps,
      } = nextProps,
      { color: nextColor, size: nextSize, set: nextSet } = nextIconProps,
      shouldUpdate = false

    if (name == 'Recent' && perLine != nextPerLine) {
      shouldUpdate = true
    }

    if (name == 'Search') {
      shouldUpdate = !(icons == nextIcons)
    }

    if (
      color != nextColor ||
      size != nextSize ||
      native != nextNative ||
      set != nextSet ||
      hasStickyPosition != nextHasStickyPosition
    ) {
      shouldUpdate = true
    }

    return shouldUpdate
  }

  memoizeSize() {
    if (!this.container) {
      // probably this is a test environment, e.g. jest
      this.top = 0
      this.maxMargin = 0
      return
    }
    var parent = this.container.parentElement
    var { top, height } = this.container.getBoundingClientRect()
    var { top: parentTop } = parent.getBoundingClientRect()
    var { height: labelHeight } = this.label.getBoundingClientRect()

    this.top = top - parentTop + parent.scrollTop

    if (height == 0) {
      this.maxMargin = 0
    } else {
      this.maxMargin = height - labelHeight
    }
  }

  handleScroll(scrollTop) {
    var margin = scrollTop - this.top
    margin = margin < this.minMargin ? this.minMargin : margin
    margin = margin > this.maxMargin ? this.maxMargin : margin

    if (margin == this.margin) return

    if (!this.props.hasStickyPosition) {
      this.label.style.top = `${margin}px`
    }

    this.margin = margin
    return true
  }

  getIcons() {
    var { name, icons, recent, perLine } = this.props

    if (name == 'Recent') {
      let { custom } = this.props
      let frequentlyUsed = recent || frequently.get(perLine)

      if (frequentlyUsed.length) {
        icons = frequentlyUsed
          .map((id) => {
            const icon = custom.filter((e) => e.id === id)[0]
            if (icon) {
              return icon
            }

            return id
          })
          .filter((id) => !!getData(id, null, null, this.data))
      } else {
        return null
      }

      if (icons.length === 0 && frequentlyUsed.length > 0) {
        return null
      }
    }

    if (icons) {
      icons = icons.slice(0)
    }

    return icons
  }

  updateDisplay(display) {
    var emojis = this.getIcons()

    if (!emojis || !this.container) {
      return
    }

    this.container.style.display = display
  }

  setContainerRef(c) {
    this.container = c
  }

  setLabelRef(c) {
    this.label = c
  }

  render() {
    var {
        id,
        name,
        hasStickyPosition,
        iconProps,
        i18n,
        notFound,
        notFoundEmoji,
      } = this.props,
      icons = this.getIcons(),
      labelStyles = {},
      labelSpanStyles = {},
      containerStyles = {}

    if (!icons) {
      containerStyles = {
        display: 'none',
      }
    }

    if (!hasStickyPosition) {
      labelStyles = {
        height: 28,
      }

      labelSpanStyles = {
        position: 'absolute',
      }
    }

    return (
      <section
        ref={this.setContainerRef}
        className="emoji-mart-category"
        aria-label={i18n.categories[id]}
        style={containerStyles}
      >
        <div
          style={labelStyles}
          data-name={name}
          className="emoji-mart-category-label"
        >
          <span
            style={labelSpanStyles}
            ref={this.setLabelRef}
            aria-hidden={true /* already labeled by the section aria-label */}
          >
            {name}
          </span>
        </div>

        <ul className="emoji-mart-category-list">
          {icons &&
            icons.map((icon) => (
              <li
                key={(icon.short_names && icon.short_names.join('_')) || icon}
              >
                {Icon({ icon, data: this.data, ...iconProps })}
              </li>
            ))}
        </ul>

        {icons && !icons.length && (
          <NotFound
            i18n={i18n}
            notFound={notFound}
            notFoundEmoji={notFoundEmoji}
            data={this.data}
            iconProps={iconProps}
          />
        )}
      </section>
    )
  }
}

Category.propTypes /* remove-proptypes */ = {
  icons: PropTypes.array,
  hasStickyPosition: PropTypes.bool,
  name: PropTypes.string.isRequired,
  native: PropTypes.bool.isRequired,
  perLine: PropTypes.number.isRequired,
  iconProps: PropTypes.object.isRequired,
  recent: PropTypes.arrayOf(PropTypes.string),
  notFound: PropTypes.func,
  notFoundEmoji: PropTypes.string.isRequired,
}

Category.defaultProps = {
  icons: [],
  hasStickyPosition: true,
}
