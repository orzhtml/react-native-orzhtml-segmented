import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'

import Home from '../views/home/Home'
import Carousel from '../views/carousel/Carousel'

const RootStack = createStackNavigator()
// 渐变屏幕的配置
const forFade = ({ current }: any) => ({
  cardStyle: {
    opacity: current.progress,
  },
})

function Router () {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={'Home'} screenOptions={{ headerShown: false }}>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ cardStyleInterpolator: forFade }}
        />
        <RootStack.Screen
          name={'Carousel'}
          component={Carousel}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default Router
