import React from 'react'
import { View, StatusBar, StyleProp, ViewStyle, StatusBarProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIsFocused } from '@react-navigation/native'

export interface CmStatusBarProps extends StatusBarProps {
  backgroundColor?: string;
  styleBar?: StyleProp<ViewStyle>;
  hidden?: boolean;
}

/** Define the widget for CmStatusBar */
function CmStatusBar (props: CmStatusBarProps) {
  const isFocused = useIsFocused()
  const _insets = useSafeAreaInsets()
  const { backgroundColor, styleBar, hidden } = props

  // Rendering the UI
  return (
    <View
      style={[
        { height: _insets.top },
        { backgroundColor },
        styleBar,
        hidden ? { height: 0 } : null,
      ]}
    >
      {
        isFocused ? (
          <StatusBar translucent barStyle='dark-content' {...props} />
        ) : null
      }
    </View>
  )
}

// Export the CmStatusBar
export default CmStatusBar
