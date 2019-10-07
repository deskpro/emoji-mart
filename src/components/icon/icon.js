import React from 'react'

const _handleClick = (e, props) => {
  if (!props.onClick) {
    return
  }
  var { onClick } = props

  onClick(props.icon, e)
}

const _handleOver = (e, props) => {
  if (!props.onOver) {
    return
  }
  var { onOver } = props

  onOver(props.icon, e)
}

const _handleLeave = (e, props) => {
  if (!props.onLeave) {
    return
  }
  var { onLeave } = props

  onLeave(props.icon, e)
}

const Icon = (props) => {
  let style = {
      color: props.color,
    },
    children = props.children,
    className = '',
    title = null

  const meta = props.data.icons[props.icon]
  if (!meta) {
    return null;
  }
  title = meta.label
  const iconStyle = meta.styles[0]
  className = `fa${iconStyle[0]} fa-${props.icon}`

  var Tag = {
    name: 'span',
    props: {},
  }

  if (props.onClick) {
    Tag.name = 'button'
    Tag.props = {
      type: 'button',
    }
  }
  return (
    <Tag.name
      onClick={(e) => _handleClick(e, props)}
      onMouseEnter={(e) => _handleOver(e, props)}
      onMouseLeave={(e) => _handleLeave(e, props)}
      title={title}
      className="emoji-mart-emoji"
      {...Tag.props}
    >
      <i className={className} style={style}>
        {children}
      </i>
    </Tag.name>
  )
}

export default Icon
