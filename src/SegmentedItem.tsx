import React from 'react'
import { View, Text } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'

import Badge from './Badge'

const SegmentedItem = (props: any) => {
  const [state, setState] = useSingleState({
    badgeWidth: 0,
  })
  let { style, children, title, titleStyle, activeTitleStyle, active, badge, onAddWidth, ...others } = props

  const buildStyle = () => {
    let _style = [{
      overflow: 'visible',
      alignItems: 'center',
      justifyContent: 'center',
    }].concat(style)
    return _style
  }

  const renderTitle = () => {
    if (title === null || title === undefined) return null
    else if (React.isValidElement(title)) return title

    let textStyle
    if (active) {
      textStyle = [{
        color: '#337ab7',
        fontSize: 13,
      }].concat(activeTitleStyle)
    } else {
      textStyle = [{
        color: '#989898',
        fontSize: 13,
      }].concat(titleStyle)
    }
    return <Text key='title' style={textStyle} numberOfLines={1}>{title}</Text>
  }

  const renderBadge = () => {
    if (!badge) return null
    else if (React.isValidElement(badge)) return badge

    let badgeStyle = {
      position: 'absolute',
      right: 0,
      top: 0,
    }
    return (
      <Badge
        style={badgeStyle}
        count={badge}
        onLayout={(e: any) => {
          let { width } = e.nativeEvent.layout
          if (width !== state.badgeWidth) {
            setState({ badgeWidth: width })
            onAddWidth && onAddWidth(width)
          }
        }}/>
    )
  }

  return (
    <View style={buildStyle()} {...others}>
      {renderTitle()}
      {renderBadge()}
    </View>
  )
}

export default SegmentedItem
