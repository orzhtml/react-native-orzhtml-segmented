import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions, Button } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MyStatusBar from '../../libs/MyStatusBar/MyStatusBar'
import { Carousel } from '../../libs/segmentedView'

const topTitleHeight = Platform.select({ android: 50, ios: 44 })

const sw = Dimensions.get('screen').width

const PageView = (props: any) => {
  const _insets = useSafeAreaInsets()
  const [state, setState] = useSingleState({
    tabs: [
      { id: 0, name: '第一页', color: 'blue' },
      { id: 1, name: '第二页', color: 'green' },
      { id: 2, name: '第三页', color: 'pink' },
    ],
    number: 0,
  })

  return (
    <View style={lineStyles.container}>
      <MyStatusBar />
      <View style={lineStyles.btnBar}>
        <TouchableOpacity
          style={lineStyles.btn}
          onPress={() => {
            props.navigation?.goBack()
          }}
        >
          <Text style={lineStyles.btnText}>&lt; 返回</Text>
        </TouchableOpacity>
      </View>
      <Carousel control={true} startIndex={2} insets={true}>
        {
          state.tabs.map((item, index) => {
            return (
              <View key={`${item.id}-${index}`} style={[
                lineStyles.pageItem, {
                  backgroundColor: item.color,
                }]
              }>
                <Button
                  title='添加'
                  color='#fff'
                  onPress={() => {
                    let _tabs = [...state.tabs]
                    _tabs.push({
                      id: 2, name: '第四页', color: 'brown',
                    })
                    setState({
                      tabs: _tabs,
                    })
                  }}
                />
                <Button
                  title='添加 number'
                  color='#fff'
                  onPress={() => {
                    setState({
                      number: state.number + 1,
                    })
                  }}
                />
                <Text>{item.name}</Text>
              </View>
            )
          })
        }
      </Carousel>
      {/* <View style={{ height: _insets.bottom }} /> */}
    </View>
  )
}

const lineStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBar: {
    justifyContent: 'center',
    height: topTitleHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#aaa',
  },
  btn: {
    marginLeft: 10,
    width: 60,
  },
  btnText: {
    fontSize: 16,
  },
  pageItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: sw,
  },
})

export default PageView
