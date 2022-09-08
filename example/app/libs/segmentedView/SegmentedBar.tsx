import React, { FC, forwardRef, useRef } from 'react'
import { View, ScrollView, TouchableOpacity, Animated } from 'react-native'
import { useSingleState, useSingleInstanceVar, useUpdate } from 'react-native-orzhtml-usecom'

import { makeArray, isEqualLayout } from './Common'

export interface SegmentedBarProps {
    [p: string]: any;
}

export interface SegmentedBarInterProps {
    [p: string]: any;
    refInstance: any;
}

interface instanceProps {
    [p: string]: any;
}

const SegmentedBar: FC<SegmentedBarInterProps> = (props) => {
  const forceUpdate = useUpdate()
  const instVal = useSingleInstanceVar<instanceProps>({
    activeIndex: props.activeIndex ? props.activeIndex : 0,
    buttonsLayout: makeArray([], props.children),
    itemsLayout: makeArray([], props.children),
    itemsAddWidth: makeArray([], props.children, 0),
    indicatorX: null,
    indicatorWidth: null,
    scrollViewWidth: 0,
  })
  const _scrollViewRef = useRef<ScrollView>(null)

  const setActiveIndex = (value: any) => {
    if (instVal.activeIndex !== value) {
      instVal.activeIndex = value
      updateIndicator()
      forceUpdate()
    }
    props.onChange && props.onChange(value)
  }

  const getIndicatorXValue = () => {
    let isMoreThanDefault = false
    switch (props.indicatorType) {
      case 'boxWidth':
        return instVal.buttonsLayout[instVal.activeIndex].x
      case 'itemWidth':
        return instVal.buttonsLayout[instVal.activeIndex].x + instVal.itemsLayout[instVal.activeIndex].x + instVal.itemsAddWidth[instVal.activeIndex] / 2
      case 'customWidth':
        isMoreThanDefault = props.indicatorWidth > instVal.itemsLayout[instVal.activeIndex].width
        return isMoreThanDefault ? instVal.buttonsLayout[instVal.activeIndex].x + instVal.itemsLayout[instVal.activeIndex].x : instVal.buttonsLayout[instVal.activeIndex].x + (instVal.buttonsLayout[instVal.activeIndex].width - props.indicatorWidth) / 2
    }
    return 0
  }

  const getIndicatorWidthValue = () => {
    let isMoreThanDefault = false
    switch (props.indicatorType) {
      case 'boxWidth':
        return instVal.buttonsLayout[instVal.activeIndex].width
      case 'itemWidth':
        return instVal.itemsLayout[instVal.activeIndex].width - instVal.itemsAddWidth[instVal.activeIndex]
      case 'customWidth':
        isMoreThanDefault = props.indicatorWidth > instVal.itemsLayout[instVal.activeIndex].width
        return isMoreThanDefault ? instVal.itemsLayout[instVal.activeIndex].width : props.indicatorWidth
    }
    return 0
  }

  const updateIndicator = () => {
    if (!instVal.indicatorX || !instVal.indicatorWidth) return

    let _indicatorXValue = getIndicatorXValue()
    let _indicatorWidthValue = getIndicatorWidthValue()
    if (_indicatorXValue === instVal.saveIndicatorXValue &&
        _indicatorWidthValue === instVal.saveIndicatorWidthValue) {
      return
    }

    instVal.saveIndicatorXValue = _indicatorXValue
    instVal.saveIndicatorWidthValue = _indicatorWidthValue
    if (props.animated) {
      Animated.parallel([
        Animated.spring(instVal.indicatorX, { toValue: _indicatorXValue, friction: 9, useNativeDriver: false }),
        Animated.spring(instVal.indicatorWidth, { toValue: _indicatorWidthValue, friction: 9, useNativeDriver: false }),
      ]).start()
    } else {
      instVal.indicatorX.setValue(_indicatorXValue)
      instVal.indicatorWidth.setValue(_indicatorWidthValue)
    }

    if (props.autoScroll && _scrollViewRef.current) {
      let contextWidth = 0
      instVal.buttonsLayout.map((item: any) => contextWidth += item.width)
      let x = _indicatorXValue + _indicatorWidthValue / 2 - instVal.scrollViewWidth / 2
      if (x < 0) {
        x = 0
      } else if (x > contextWidth - instVal.scrollViewWidth) {
        x = contextWidth - instVal.scrollViewWidth
      }
      if (x < 0) {
        x = 0
      }
      _scrollViewRef.current.scrollTo({ x: x, y: 0, animated: props.animated })
    }
  }

  const onButtonPress = (index: React.Key) => {
    setActiveIndex(index)
  }

  const checkInitIndicator = () => {
    if (instVal.indicatorX && instVal.indicatorWidth) {
      instVal.indicatorX.setValue(getIndicatorXValue())
      instVal.indicatorWidth.setValue(getIndicatorWidthValue())
    } else {
      instVal.indicatorX = new Animated.Value(getIndicatorXValue())
      instVal.indicatorWidth = new Animated.Value(getIndicatorWidthValue())
    }
    forceUpdate()
  }

  const onButtonLayout = (index: React.Key, e: { nativeEvent: { layout: any } }) => {
    let { layout } = e.nativeEvent
    if (!isEqualLayout(layout, instVal.buttonsLayout[index])) {
      instVal.buttonsLayout[index] = layout
      checkInitIndicator()
    }
  }

  const onItemLayout = (index: React.Key, e: { nativeEvent: { layout: any } }) => {
    let { layout } = e.nativeEvent
    if (!isEqualLayout(layout, instVal.itemsLayout[index])) {
      instVal.itemsLayout[index] = layout
      checkInitIndicator()
    }
  }

  const renderItem = (item: any, index: React.Key) => {
    let saveOnLayout = item.props.onLayout
    let newItem = React.cloneElement(item, {
      active: index === instVal.activeIndex,
      onLayout: (e: any) => {
        onItemLayout(index, e)
        saveOnLayout && saveOnLayout(e)
      },
      onAddWidth: (width: any) => {
        if (width !== instVal.itemsAddWidth[index]) {
          instVal.itemsAddWidth[index] = width
          forceUpdate()
        }
      },
    })
    return newItem
  }

  const renderIndicator = () => {
    let { indicatorLineColor, indicatorPosition, indicatorLineWidth, indicatorPositionPadding, indicatorMinWidth } = props
    let style: any = {
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: instVal.indicatorX,
      width: instVal.indicatorWidth,
      height: indicatorLineWidth || indicatorLineWidth === 0 ? indicatorLineWidth : 2,
    }
    if (indicatorPosition === 'top') {
      style.top = indicatorPositionPadding || indicatorPositionPadding === 0 ? indicatorPositionPadding : 0
    } else {
      style.bottom = indicatorPositionPadding || indicatorPositionPadding === 0 ? indicatorPositionPadding : 0
    }
    return (
      <Animated.View style={style}>
        <View style={{
          backgroundColor: indicatorLineColor || '#337ab7',
          width: indicatorMinWidth,
          borderRadius: 1.5,
          height: indicatorLineWidth || indicatorLineWidth === 0 ? indicatorLineWidth : 2,
        }} />
      </Animated.View>
    )
  }

  const renderFixed = () => {
    let {
      style, itemStyle, justifyItem, indicatorType, indicatorPosition, indicatorLineColor,
      indicatorPositionPadding, animated, activeIndex, onChange, children, ...others
    } = props
    if (!children) {
      children = []
    } else if (!(children instanceof Array)) {
      children = [children]
    }

    return (
      <View style={[{
        backgroundColor: '#fff',
        flexDirection: 'row',
      }, style]} {...others}>
        {children.map((item: any, index: React.Key) => (
          <TouchableOpacity
            key={index}
            style={[{
              flex: 1,
            }, itemStyle]}
            activeOpacity={1}
            onPress={() => onButtonPress(index)}
            onLayout={e => onButtonLayout(index, e)}
          >
            {renderItem(item, index)}
          </TouchableOpacity>
        ))}
        {indicatorType !== 'none' ? renderIndicator() : null}
      </View>
    )
  }

  //   if (props.justifyItem === 'scrollable') return renderScrollable()
  //   else
  return renderFixed()
}

const Component = SegmentedBar
// 注意：这里不要在 Component 上使用 ref, 换个属性名字比如 refInstance 不然会导致覆盖
export default forwardRef((props: SegmentedBarProps, ref) => {
  const defaultProps = {
    justifyItem: 'fixed',
    indicatorType: 'itemWidth',
    indicatorWidth: 20,
    indicatorMinWidth: 50,
    indicatorPosition: 'bottom',
    animated: true,
    autoScroll: true,
  }

  return (
    <Component {...defaultProps} {...props} refInstance={ref} />
  )
})
