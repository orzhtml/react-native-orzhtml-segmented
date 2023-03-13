import React from 'react'
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native'

interface SegmentedSheetProps extends ViewProps {
  title?: string | React.ReactNode,
  titleStyle?: StyleProp<ViewStyle>,
  activeTitleStyle?: StyleProp<ViewStyle>,
  badge: any,
}

const SegmentedSheet = (props: SegmentedSheetProps) => {
  let { style, title, titleStyle, activeTitleStyle, badge, ...others } = props
  return <View style={[{ flexGrow: 1 }, style]} {...others} />
}

export default SegmentedSheet
