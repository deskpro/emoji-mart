import React from 'react'
import PropTypes from 'prop-types'

import Icon from './icon/icon'

export default class NotFound extends React.PureComponent {
  render() {
    const { data, iconProps, i18n, notFound, notFoundEmoji } = this.props

    const component = (notFound && notFound()) || (
      <div className="emoji-mart-no-results">
        {Icon({
          data: data,
          ...iconProps,
          size: 38,
          emoji: notFoundEmoji,
          onOver: null,
          onLeave: null,
          onClick: null,
        })}
        <div className="emoji-mart-no-results-label">{i18n.notfound}</div>
      </div>
    )

    return component
  }
}

NotFound.propTypes /* remove-proptypes */ = {
  notFound: PropTypes.func.isRequired,
  iconProps: PropTypes.object.isRequired,
}
