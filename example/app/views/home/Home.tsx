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
      <TouchableOpacity
        style={lineStyles.btn}
        onPress={() => {
          props.navigation?.navigate('Projector')
        }}
      >
        <Text style={lineStyles.btnText}>Projector Demo &gt;</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={lineStyles.btn}
        onPress={() => {
          props.navigation?.navigate('Segmented')
        }}
      >
        <Text style={lineStyles.btnText}>Segmented Demo &gt;</Text>
      </TouchableOpacity>
    </View>
  )
}

const lineStyles = StyleSheet.create({
  container: { flex: 1 },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#aaa',
    marginLeft: 20,
  },
  btnText: {
    fontSize: 18,
    fontWeight: '700',
  },
})

export default PageView
