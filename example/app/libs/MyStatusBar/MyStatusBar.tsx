import React from 'react'
import { View, StatusBar, useColorScheme } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const statusBarHeight = getStatusBarHeight()
function MyStatusBar (props: any) {
  const isFocused = useIsFocused()
  const isDarkMode = useColorScheme() === 'dark'
  const { backgroundColor, styleBar, hidden } = props

  return (
    <View
      style={[
        { height: statusBarHeight },
        { backgroundColor },
        styleBar || null, hidden ? { height: 0 } : null,
      ]}
    >
      {
        isFocused ? (
          <StatusBar translucent barStyle={isDarkMode ? 'light-content' : 'dark-content'} {...props} />
        ) : null
      }
    </View>
  )
}

export default MyStatusBar
