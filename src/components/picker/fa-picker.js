import React from 'react'

import categories from '../../../data/categories.yml'
import icons from '../../../data/icons.yml'
import NimblePicker from './nimble-picker'

import { PickerPropTypes } from '../../utils/shared-props'
import { PickerDefaultProps } from '../../utils/shared-default-props'

export default class FaPicker extends React.PureComponent {
  render() {
    return <NimblePicker {...this.props} {...this.state} />
  }
}

FaPicker.propTypes /* remove-proptypes */ = PickerPropTypes
FaPicker.defaultProps = { ...PickerDefaultProps, data: { icons, categories } }
