import React, { FC } from 'react'
import { View, Text } from 'react-native'

export interface BadgeProps {
  [p: string]: any;
  type: string;
  count: string | number;
  style: any;
  countStyle: any;
  maxCount: number;
}

const Badge: FC<BadgeProps> = (props) => {
  let { style, children, type, count, countStyle, maxCount, ...others } = props

  const buildStyle = (): any => {
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

    let _style = [
      {
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
      },
    ].concat(style)

    return _style
  }

  const renderInner = () => {
    if (type === 'dot') {
      return null
    } else if (count || count === 0) {
      countStyle = [
        {
          color: '#fff',
          fontSize: 11,
        },
      ].concat(countStyle)
      return (
        <Text style={countStyle} allowFontScaling={false} numberOfLines={1}>
          {count > maxCount ? maxCount + '+' : count}
        </Text>
      )
    } else {
      return children
    }
  }

  return (
    <View style={buildStyle()} {...others}>
      {renderInner()}
    </View>
  )
}

Badge.defaultProps = {
  type: 'capsule',
  maxCount: 99,
}

export default Badge
