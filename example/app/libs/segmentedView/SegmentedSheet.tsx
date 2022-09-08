import React from 'react'
import { View } from 'react-native'

const SegmentedSheet = (props: any) => {
  let { style, title, titleStyle, activeTitleStyle, badge, ...others } = props
  let _style = [{ flexGrow: 1 }].concat(style)
  return <View style={_style} {...others} />
}

export default SegmentedSheet
