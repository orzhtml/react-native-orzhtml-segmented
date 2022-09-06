import React from 'react'
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Router from './app/router'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Router />
    </SafeAreaProvider>
  )
}

const lineStyles = StyleSheet.create({
})

export default App
