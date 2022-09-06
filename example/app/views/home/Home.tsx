import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import MyStatusBar from '../../libs/MyStatusBar/MyStatusBar'

const PageView = (props: any) => {
  return (
    <View style={lineStyles.container}>
      <MyStatusBar />
      <TouchableOpacity
        style={lineStyles.btn}
        onPress={() => {
          props.navigation?.navigate('Carousel')
        }}
      >
        <Text style={lineStyles.btnText}>Carousel Demo &gt;</Text>
      </TouchableOpacity>
    </View>
  )
}

const lineStyles = StyleSheet.create({
  container: { flex: 1 },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#aaa',
    marginLeft: 20,
  },
  btnText: {
    fontSize: 18,
  },
})

export default PageView
