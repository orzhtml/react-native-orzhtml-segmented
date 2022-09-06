import React, { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { View, ScrollView, ScrollViewProps } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSingleState, useSingleInstanceVar } from 'react-native-orzhtml-usecom'

import { CarouselInterProps, CarouselProps, InstanceProps } from './types'
import CarouselControl from './CarouselControl'

const Carousel: FC<CarouselInterProps> = (props) => {
  const [state, setState] = useSingleState({
    width: 0,
    height: 0,
    pageIndex: props.startIndex,
    pageCount: 0,
  })
  const instVal = useSingleInstanceVar<InstanceProps>({
    timer: null,
    cardIndex: null,
    carousel: null,
    step: null,
    pageCount: 0,
    cycle: false,
    forward: true,
    cardCount: 0,
  })

  const _scrollViewRef = useRef<ScrollView>(null)
  const _insets = useSafeAreaInsets()

  useImperativeHandle(props.refInstance, () => ({
    scrollToPage: scrollToPage,
    scrollToNextPage: scrollToNextPage,
  }))

  useEffect(() => {
    initByProps()
    setupTimer()
  }, [props.children])

  useEffect(() => {
    console.log('instVal.cardIndex:', instVal.cardIndex)
    setTimeout(() => scrollToCard(instVal.cardIndex, false), 50)
    return () => {
      removeTimer()
    }
  }, [])
  // 初始化轮播参数
  const initByProps = () => {
    let { children, carousel, direction, startIndex, cycle } = props
    // 页数
    instVal.pageCount = children ? children instanceof Array ? children.length : 1 : 0
    let multiPage = instVal.pageCount > 1
    // 是否轮播
    instVal.carousel = carousel && multiPage
    // 是否循环
    instVal.cycle = cycle && multiPage
    // 是否正向轮播（从左往右顺序轮播，卡片从右往左滚动）
    instVal.forward = direction === 'forward'
    // 卡片数量，card定义：轮播中的页面序列，如为循环播放则首尾各多一页，如页面为0-1-2，则cards为2-0-1-2-0
    instVal.cardCount = multiPage && instVal.cycle ? instVal.pageCount + 2 : instVal.pageCount

    if (instVal.cardIndex === null || instVal.cardIndex >= instVal.cardCount) {
      instVal.cardIndex = multiPage && instVal.cycle ? startIndex + 1 : startIndex
    }
    // 下一页卡片步进
    instVal.step = instVal.forward ? 1 : -1
    setState({
      pageCount: instVal.pageCount,
    })
    console.log('instVal:', instVal)
  }
  // 设置定时器，开启轮播时在interval毫秒之后滚动到下一卡片
  const setupTimer = () => {
    removeTimer()
    if (!instVal.carousel) return
    instVal.timer = setTimeout(() => {
      instVal.timer = null
      scrollToNextCard()
    }, props.interval)
  }
  // 删除定时器
  const removeTimer = () => {
    if (instVal.timer) {
      clearTimeout(instVal.timer)
      instVal.timer = null
    }
  }
  // 滚动到指定页
  const scrollToPage = (index: number | null, animated = true) => {
    console.log('scrollToPage index:', index)
    scrollToCard(instVal.cycle ? (index || 0) + 1 : index, animated)
  }
  // 滚动到下一页
  const scrollToNextPage = (animated = true) => {
    scrollToNextCard(animated)
  }
  // 滚动到下一张卡片
  const scrollToNextCard = (animated = true) => {
    console.log('scrollToNextCard')
    let i = 0
    if (instVal?.cardIndex && instVal?.step) {
      i = instVal.cardIndex + instVal.step
    }
    scrollToCard(i, animated)
  }
  // 滚动到指定卡片
  const scrollToCard = (cardIndex: number | null, animated = true) => {
    let { width, height } = state
    if (cardIndex && cardIndex < 0) {
      cardIndex = 0
    } else if (cardIndex && (cardIndex >= instVal.cardCount)) {
      cardIndex = instVal.cardCount - 1
    }
    console.log('scrollToCard cardIndex:', cardIndex, props.horizontal, width * (cardIndex || 0))
    if (_scrollViewRef.current) {
      if (props.horizontal) {
        _scrollViewRef.current.scrollTo({
          x: width * (cardIndex || 0),
          y: 0,
          animated: animated,
        })
      } else {
        _scrollViewRef.current.scrollTo({
          x: 0,
          y: height * (cardIndex || 0),
          animated: animated,
        })
      }
    }
  }
  // 页面滚动事件
  const onScroll = (e: any) => {
    if (state.width === 0 || state.height === 0) return
    props.horizontal ? onHorizontalScroll(e) : onVerticalScroll(e)
    props.onScroll && props.onScroll(e)
  }
  // 布局变更时修改页面宽度、高度，刷新显示
  const onLayout = (e: any) => {
    setState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    })
    props.onLayout && props.onLayout(e)
  }
  // 横向滚动事件
  const onHorizontalScroll = (e: any) => {
    console.log('onHorizontalScroll')
    let { width } = state
    let { x } = e.nativeEvent.contentOffset
    let cardIndex = Math.round(x / width)

    if (instVal.cycle) {
      if (cardIndex <= 0 && x <= 0) {
        cardIndex = instVal.cardCount - 2
        scrollToCard(cardIndex, false)
      } else if (
        cardIndex >= instVal.cardCount - 1 &&
        x >= (instVal.cardCount - 1) * width
      ) {
        cardIndex = 1
        scrollToCard(cardIndex, false)
      }
    }

    changeCardIndex(cardIndex)
    setupTimer()
  }
  // 纵向滚动事件
  const onVerticalScroll = (e: any) => {
    console.log('onVerticalScroll')
    let { height } = state
    let { y } = e.nativeEvent.contentOffset
    let cardIndex = Math.round(y / height)

    if (instVal.cycle) {
      if (cardIndex <= 0 && y <= 0) {
        cardIndex = instVal.cardCount - 2
        scrollToCard(cardIndex, false)
      } else if (
        cardIndex >= instVal.cardCount - 1 &&
        y >= (instVal.cardCount - 1) * height
      ) {
        cardIndex = 1
        scrollToCard(cardIndex, false)
      }
    }

    changeCardIndex(cardIndex)
    setupTimer()
  }
  // 修改当前卡片编号
  const changeCardIndex = (cardIndex: number) => {
    console.log('changeCardIndex:', cardIndex)
    if (cardIndex === instVal.cardIndex) return
    instVal.cardIndex = cardIndex
    let total = instVal.pageCount
    let pageIndex = instVal.cycle ? cardIndex - 1 : cardIndex
    if (pageIndex < 0) pageIndex = total - 1
    else if (pageIndex >= total) pageIndex = 0
    setState({ pageIndex })
    props.onChange && props.onChange(pageIndex, total)
  }
  // 渲染卡片列表
  const renderCards = () => {
    console.log('renderCards:', props.children)
    let { width, height } = state
    let _children: any = props.children
    if (width <= 0 || height <= 0 || !_children) {
      return null
    }
    if (!(_children instanceof Array)) {
      _children = [_children]
    }
    let cards = []
    let cardStyle: any = { width: width, height: height, overflow: 'hidden' }
    instVal.cycle &&
      cards.push(
        <View style={cardStyle} key={'card-head'}>
          {_children[_children.length - 1]}
        </View>,
      )
    _children.map((item: any, index: number) =>
      cards.push(
        <View key={'card' + index} style={cardStyle}>
          {item}
        </View>,
      ),
    )
    instVal.cycle &&
      cards.push(
        <View key={'card-tail'} style={cardStyle}>
          {_children[0]}
        </View>,
      )
    console.log('cards:', cards)
    return cards
  }

  let {
    style,
    children,
    horizontal,
    contentContainerStyle,
    control,
    onChange,
    direction,
    ...others
  } = props

  let fixStyle = {}

  if (state.width > 0 && state.height > 0) {
    if (horizontal) {
      fixStyle = {
        width: state.width * instVal.cardCount,
        height: state.height,
      }
    } else {
      fixStyle = { width: state.width, height: state.height * instVal.cardCount }
    }
  }

  let _controlView = null
  if (React.isValidElement(control)) {
    _controlView = React.cloneElement(control, {
      index: state.pageIndex,
      total: state.pageCount,
      carousel: _scrollViewRef.current,
      style: { bottom: props.insets ? _insets.bottom : 0 },
      scrollToPage: scrollToPage,
      ...(control.props || {}),
    })
  } else if (control) {
    _controlView = (
      <CarouselControl
        index={state.pageIndex}
        total={state.pageCount}
        style={{ bottom: props.insets ? _insets.bottom : 0 }}
        scrollToPage={scrollToPage}
      />
    )
  }

  return (
    <View style={[
      { backgroundColor: 'red', alignItems: 'stretch', flex: 1 },
      style,
    ]}>
      <ScrollView
        style={{ flex: 1 }}
        horizontal={horizontal}
        contentContainerStyle={[contentContainerStyle, fixStyle]}
        {...others}
        ref={_scrollViewRef}
        onScroll={onScroll}
        onLayout={onLayout}
      >
        {renderCards()}
      </ScrollView>
      {_controlView}
    </View>
  )
}

const Component = Carousel
// 注意：这里不要在 Component 上使用 ref, 换个属性名字比如 refInstance 不然会导致覆盖
export default forwardRef((props: CarouselProps, ref) => {
  const defaultProps = {
    horizontal: true, // 修改为false是纵向滚动
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    alwaysBounceHorizontal: false,
    alwaysBounceVertical: false,
    bounces: false,
    automaticallyAdjustContentInsets: false,
    scrollEventThrottle: 200,
    scrollsToTop: false,

    carousel: false,
    interval: 3000,
    direction: 'forward',
    startIndex: 0,
    cycle: true,
    control: false,
    insets: false,
  }
  return (
    <Component {...defaultProps} {...props} refInstance={ref} />
  )
})
