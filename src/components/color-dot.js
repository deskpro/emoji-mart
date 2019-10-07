import React from 'react'
import PropTypes from 'prop-types'
import { ChromePicker } from 'react-color'

export default class ColorDot extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
    }

    this.handleClick = this.handleClick.bind(this)
    this.handleChangeComplete = this.handleChangeComplete.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.setRef = this.setRef.bind(this)
    this.renderColorPicker = this.renderColorPicker.bind(this)
  }

  handleKeyDown(event) {
    // if either enter or space is pressed, then execute
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.handleClick(event)
    }
  }

  handleClick(e) {
    if (e.target === this.section) {
      this.setState({ opened: !this.state.opened })
    }
  }

  handleChangeComplete(color) {
    this.props.onChange(color.hex)
    if (this.timeout) {
      window.clearTimeout(this.timeout)
    }
    var self = this
    this.timeout = window.setTimeout(function() {
      self.setState({ opened: false })
    }, 2000)
  }

  setRef(c) {
    this.section = c
  }

  renderColorPicker() {
    if (!this.state.opened) {
      return null
    }
    const { color, onChange } = this.props
    return (
      <ChromePicker
        onChange={this.handleChange}
        onChangeComplete={this.handleChangeComplete}
        color={color}
        alpha={false}
      />
    )
  }

  render() {
    const { color, i18n } = this.props
    const { opened } = this.state
    return (
      <section
        className={`emoji-mart-skin-swatches${opened ? ' opened' : ''}`}
        aria-label={i18n.colortext}
        onClick={this.handleClick}
        ref={this.setRef}
        style={{ backgroundColor: color }}
      >
        {this.renderColorPicker()}
      </section>
    )
  }
}

ColorDot.propTypes /* remove-proptypes */ = {
  onChange: PropTypes.func,
  color: PropTypes.number.isRequired,
  i18n: PropTypes.object,
}

ColorDot.defaultProps = {
  onChange: () => {},
}
