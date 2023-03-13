import React from 'react'
import { View, Text } from 'react-native'

export interface BadgeProps {
  [p: string]: any;
  refInstance?: any;
  type: string;
  count: string | number;
  countStyle: any;
  maxCount: number;
}
/** Define the widget for Badge */
const Badge = (props: any) => {
  let { style, children, type, count, countStyle, maxCount, ...others } = props

  // build style
  const buildStyle = () => {
    let width, height, minWidth, borderRadius, borderWidth, padding
    switch (type) {
      case 'capsule':
        height = 18
        minWidth = 18
        borderRadius = 18 / 2
        borderWidth = 0
        padding = (count + '').length === 1 ? 0 : 5
        break
      case 'square':
        height = 18
        minWidth = 18
        borderRadius = 2
        borderWidth = 0
        padding = (count + '').length === 1 ? 0 : 5
        break
      case 'dot':
        width = 6
        height = 6
        borderRadius = 6 / 2
        borderWidth = 0
        padding = 0
        break
    }

    let _style = [{
      backgroundColor: '#f00',
      width: width,
      height: height,
      minWidth: minWidth,
      borderRadius: borderRadius,
      borderColor: '#f8f8f8',
      borderWidth: borderWidth,
      paddingLeft: padding,
      paddingRight: padding,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    }].concat(style)

    return _style
  }
  // render inner
  const renderInner = () => {
    if (type === 'dot') return null
    else if (count || count === 0) {
      countStyle = [{
        color: '#fff',
        fontSize: 11,
      }].concat(countStyle)
      return (
        <Text style={countStyle} allowFontScaling={false} numberOfLines={1}>
          {count > maxCount ? maxCount + '+' : count}
        </Text>
      )
    } else {
      return children
    }
  }
  // Rendering the UI
  return (
    <View style={buildStyle()} {...others}>
      {renderInner()}
    </View>
  )
}
// default Badge props
Badge.defaultProps = {
  type: 'capsule',
  maxCount: 99,
}
// Export the Badge
export default Badge
