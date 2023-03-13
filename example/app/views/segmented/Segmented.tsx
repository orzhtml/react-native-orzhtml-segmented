import React, { useRef } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View, Dimensions, Button } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'

import MyStatusBar from '../../libs/MyStatusBar/MyStatusBar'
import { SegmentedHandlesRef, SegmentedSheet, SegmentedView } from '../../libs/segmentedView'

const topTitleHeight = Platform.select({ android: 50, ios: 44 })

const sw = Dimensions.get('screen').width

const PageView = (props: any) => {
  const [state, setState] = useSingleState({
    tabs: [
      { id: 0, name: '第一页', color: 'blue' },
      { id: 1, name: '第二页', color: 'green' },
      { id: 2, name: '第三页', color: 'pink' },
    ],
    activeIndex: 0,
    number: 0,
  })
  const _segmentedViewRef = useRef<SegmentedHandlesRef>(null)

  const _renderTitle = (item: any, index: any) => {
    const isActive = index === state.activeIndex
    let tintColor = '#888'
    if (isActive) {
      tintColor = '#212121'
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: 78,
          height: 25,
        }}
      >
        <Text
          style={{ color: tintColor, fontSize: 16, fontWeight: isActive ? '700' : '400' }}
        >{item.name}</Text>
      </View>
    )
  }

  const _onSegmentedBarChange = (index: number) => {
    setState({ activeIndex: index })
  }

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
      <Button onPress={() => {
        let _index = state.activeIndex + 1
        if (_index >= state.tabs.length) {
          _index = 0
        }
        setState({
          activeIndex: _index,
        })
      }} title="切换" />
      <SegmentedView
        style={{
          flex: 1,
        }}
        activeIndex={state.activeIndex}
        indicatorLineColor="#FFAC00"
        type="carousel"
        barStyle={{ backgroundColor: 'transparency' }}
        ref={_segmentedViewRef}
        onChange={(index: number) => _onSegmentedBarChange(index)}
      >
        {
          state.tabs.map((item, index) => {
            return (
              <SegmentedSheet
                key={index}
                title={_renderTitle(item, index)}
              >
                <View style={{ backgroundColor: item.color, flex: 1 }} />
              </SegmentedSheet>
            )
          })
        }
      </SegmentedView>
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
