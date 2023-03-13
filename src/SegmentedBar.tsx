import React, { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { View, ScrollView, TouchableOpacity, Animated } from 'react-native'
import { useSingleInstanceVar, useUpdate } from 'react-native-orzhtml-usecom'

import { makeArray, isEqualLayout } from './Common'

export interface SegmentedBarHandles {
  scrollTo: (options: { x?: number | undefined; y?: number | undefined; animated?: boolean | undefined }) => void;
}

export interface SegmentedBarProps {
    [p: string]: any;
}

export interface SegmentedBarInterProps extends SegmentedBarProps {
  refInstance: React.ForwardedRef<any>;
}

interface InstanceProps {
    [p: string]: any;
}

const SegmentedBar: FC<SegmentedBarInterProps> = (props) => {
  const forceUpdate = useUpdate()
  const instVal = useSingleInstanceVar<InstanceProps>({
    activeIndex: props.activeIndex ? props.activeIndex : 0,
    buttonsLayout: makeArray([], props.children),
    itemsLayout: makeArray([], props.children),
    itemsAddWidth: makeArray([], props.children, 0),
    indicatorX: null,
    indicatorWidth: null,
    scrollViewWidth: 0,
  })
  const _scrollViewRef = useRef<ScrollView>(null)

  useImperativeHandle(props.refInstance, () => ({
    scrollTo: scrollTo,
  }))

  useEffect(() => {
    let nextItemsLayout = makeArray(instVal.itemsLayout, props.children)
    if (nextItemsLayout.length !== instVal.itemsLayout.length) {
      instVal.buttonsLayout = makeArray(instVal.buttonsLayout, props.children)
      instVal.itemsLayout = nextItemsLayout
      instVal.itemsAddWidth = makeArray(instVal.itemsAddWidth, props.children, 0)
    }
    if (props.activeIndex || props.activeIndex === 0) {
      instVal.activeIndex = props.activeIndex
    }
    if (instVal.activeIndex >= nextItemsLayout.length) {
      instVal.activeIndex = nextItemsLayout.length - 1
    }
    updateIndicator()
  }, [props])

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

  const onScrollViewLayout = (e: any) => {
    instVal.scrollViewWidth = e.nativeEvent.layout.width
    props.onLayout && props.onLayout(e)
  }

  const onButtonPress = (index: React.Key) => {
    setActiveIndex(index)
  }

  const scrollTo = (options: { x?: number | undefined; y?: number | undefined; animated?: boolean | undefined }) => {
    _scrollViewRef.current && _scrollViewRef.current.scrollTo(options)
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

  const renderScrollable = () => {
    let {
      style, justifyItem, indicatorType, indicatorPosition, indicatorLineColor,
      indicatorPositionPadding, animated, activeIndex, onChange, onLayout, children, ...others
    } = props
    if (!children) {
      children = []
    } else if (!(children instanceof Array)) {
      children = [children]
    }

    return (
      <View style={[{ backgroundColor: 'transparent' }, style]}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollsToTop={false}
          removeClippedSubviews={false}
          onLayout={e => onScrollViewLayout(e)}
          ref={_scrollViewRef}
          {...others}
        >
          {children.map((item: any, index: React.Key) => {
            return (
              <TouchableOpacity
                style={{ alignItems: 'center', justifyContent: 'center' }}
                key={index}
                onPress={() => onButtonPress(index)}
                onLayout={e => onButtonLayout(index, e)}
              >
                {renderItem(item, index)}
              </TouchableOpacity>
            )
          })}
          {renderIndicator()}
        </ScrollView>
      </View>
    )
  }

  // Rendering the UI
  if (props.justifyItem === 'scrollable') return renderScrollable()
  else return renderFixed()
}

const Component = SegmentedBar
// 注意：这里不要在 Component 上使用 ref, 换个属性名字比如 refInstance 不然会导致覆盖
export default forwardRef<SegmentedBarHandles, SegmentedBarProps>((props, ref) => {
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
