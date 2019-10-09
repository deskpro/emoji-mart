import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/**
 * Renders a group of links as tabs.
 */
export default class Tabs extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(active) {
    if (this.props.allowUnselect || active !== this.props.active) {
      this.props.onChange(active)
    }
  }

  render() {
    let { className, children, active } = this.props

    const tabs = React.Children.map(children, (child) =>
      React.cloneElement(child, {
        onClick: this.handleClick,
        active: child.props.name === active,
      }),
    )

    return <ul className={classNames('dp-tabs', className)}>{tabs}</ul>
  }
}

Tabs.propTypes = {
  /**
   * Name of the active tab.
   */
  active: PropTypes.string.isRequired,
  /**
   * CSS classes to apply to the element.
   */
  className: PropTypes.string,
  /**
   * Children to render.
   */
  children: PropTypes.node.isRequired,
  /**
   * Called when the active tab changes. Receives the name of the tab.
   */
  onChange: PropTypes.func,
  /**
   * Don't filter click when the same tab is clicked again to allow unselecting tabs
   */
  allowUnselect: PropTypes.bool,
}

Tabs.defaultProps = {
  className: '',
  onChange() {},
  allowUnselect: false,
}
