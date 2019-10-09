import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class TabLink extends React.PureComponent {
  render() {
    const classes = classNames('dp-tabs__tab', this.props.className, {
      'dp-tabs__tab--active': this.props.active,
    })

    return (
      <li className={classes}>
        <div
          onClick={() => {
            this.props.onClick(this.props.name)
          }}
        >
          {this.props.children}
        </div>
      </li>
    )
  }
}

TabLink.propTypes = {
  /**
   * The name of the tab.
   */
  name: PropTypes.string.isRequired,
  /**
   * Whether or not the tab is active.
   */
  active: PropTypes.bool,
  /**
   * CSS classes to apply to the element.
   */
  className: PropTypes.string,
  /**
   * Children to render.
   */
  children: PropTypes.node,
  /**
   * Called when the link is clicked. Receives the name of the tab.
   */
  onClick: PropTypes.func,
}

TabLink.defaultProps = {
  active: false,
  onClick() {},
  className: '',
  children: '',
}

export default TabLink
