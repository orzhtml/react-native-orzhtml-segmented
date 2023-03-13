import React, { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { useSingleState } from 'react-native-orzhtml-usecom'

import Carousel, { CarouselHandles } from './Carousel'
import Projector from './Projector'
import SegmentedBar, { SegmentedBarHandles } from './SegmentedBar'
import SegmentedItem from './SegmentedItem'

export interface SegmentedHandles {
  scrollTo: (options: { x?: number | undefined; y?: number | undefined; animated?: boolean | undefined }) => void;
}

export interface SegmentedViewProps {
    [p: string]: any;
    type?: string;
    barPosition?: string;
    // SegmentedBar props
    barStyle?: StyleProp<ViewStyle>;
    barItemStyle?: StyleProp<ViewStyle>;
    justifyItem?: string;
    indicatorType?: string;
    indicatorPosition?: string;
    indicatorLineColor?: string;
    indicatorLineWidth?: number;
    indicatorPositionPadding?: number;
    animated?: boolean;
    autoScroll?: boolean;
    activeIndex: number;
    onChange: (index: number) => void;
    renderView?: any;
    readerViewOptions?: object;
}

export interface SegmentedViewInterProps extends SegmentedViewProps {
  refInstance: React.ForwardedRef<any>;
}

const SegmentedView: FC<SegmentedViewInterProps> = (props) => {
  /* Local state management */
  const [state, setState] = useSingleState({
    activeIndex: props.activeIndex ? props.activeIndex : 0,
  })
  // Define the local Component
  const _carouselRef = useRef<CarouselHandles>(null)
  const _segmentedBar = useRef<SegmentedBarHandles>(null)

  useImperativeHandle(props.refInstance, () => ({
    scrollTo: scrollTo,
  }))

  useEffect(() => {
    if (props.activeIndex === null) {
      return
    }
    _carouselRef.current && _carouselRef.current.scrollToPage(props.activeIndex)
  }, [props.activeIndex])

  const getSheets = () => {
    let { children } = props
    if (!(children instanceof Array)) {
      if (children) children = [children]
      else children = []
    }
    children = children.filter((item: any) => item) // remove empty item
    return children
  }

  const getActiveIndex = () => {
    let activeIndex = props.activeIndex
    if (activeIndex || activeIndex === 0) return activeIndex
    else return state.activeIndex
  }

  const scrollTo = (options: any) => {
    _segmentedBar.current && _segmentedBar.current.scrollTo(options)
  }

  const onSegmentedBarChange = (index: number) => {
    if (index === getActiveIndex()) {
      props.onChange && props.onChange(index)
    } else {
      setState({ activeIndex: index }, () => {
        if (_carouselRef.current) {
          _carouselRef.current.scrollToPage(index, false)
        }
        props.onChange && props.onChange(index)
      })
    }
  }

  const onCarouselChange = (index: number) => {
    if (index === state.activeIndex) return
    setState({ activeIndex: index }, () => {
      props.onChange && props.onChange(index)
    })
  }

  const renderBar = () => {
    let {
      barPosition, barStyle, barItemStyle, justifyItem, indicatorType,
      indicatorPosition, indicatorLineColor, indicatorLineWidth, indicatorPositionPadding, indicatorWidth, indicatorMinWidth,
      animated, autoScroll,
    } = props

    if (!indicatorPosition && barPosition === 'bottom') {
      indicatorPosition = 'top'
    }
    return (
      <SegmentedBar
        ref={_segmentedBar}
        style={barStyle}
        itemStyle={barItemStyle}
        justifyItem={justifyItem}
        indicatorType={indicatorType}
        indicatorPosition={indicatorPosition}
        indicatorLineColor={indicatorLineColor}
        indicatorLineWidth={indicatorLineWidth}
        indicatorWidth={indicatorWidth}
        indicatorMinWidth={indicatorMinWidth}
        indicatorPositionPadding={indicatorPositionPadding}
        animated={animated}
        autoScroll={autoScroll}
        activeIndex={getActiveIndex()}
        onChange={(index: number) => onSegmentedBarChange(index)}
      >
        {getSheets().map((item: any, index: React.Key) => (
          <SegmentedItem
            key={index}
            title={item.props.title}
            titleStyle={item.props.titleStyle}
            activeTitleStyle={item.props.activeTitleStyle}
            badge={item.props.badge}
          />
        ))}
      </SegmentedBar>
    )
  }

  const renderProjector = () => {
    return (
      <Projector style={{ flex: 1 }} index={getActiveIndex()}>
        {getSheets()}
      </Projector>
    )
  }

  const renderCarousel = () => {
    return (
      <Carousel
        style={{ flex: 1 }}
        contentContainerStyle={props.contentContainerStyle}
        carousel={false}
        startIndex={getActiveIndex()}
        cycle={false}
        ref={_carouselRef}
        onChange={(index: number) => onCarouselChange(index)}
      >
        {getSheets()}
      </Carousel>
    )
  }

  let {
    style, children, type, barPosition, barStyle, justifyItem,
    indicatorType, indicatorPosition, indicatorLineColor, indicatorLineWidth, indicatorPositionPadding,
    animated, autoScroll, activeIndex, onChange,
    renderView, readerViewOptions, ...others
  } = props
  const RenderView = renderView || View

  // Rendering the UI
  return (
    <View
      style={[{
        flexDirection: 'column',
        alignItems: 'stretch',
      }, style]}
      {...others}
    >
      {barPosition === 'top' ? renderBar() : null}
      <RenderView {...readerViewOptions}>
        {type === 'carousel' ? renderCarousel() : renderProjector()}
      </RenderView>
      {barPosition === 'bottom' ? renderBar() : null}
    </View>
  )
}

const Component = SegmentedView
// 注意：这里不要在 Component 上使用 ref, 换个属性名字比如 refInstance 不然会导致覆盖
export default forwardRef<SegmentedHandles, SegmentedViewProps>((props, ref) => {
  const defaultProps = {
    type: 'projector',
    barPosition: 'top',
    readerViewOptions: {
      style: { flex: 1 },
    },
  }

  return (
    <Component {...defaultProps} {...props} refInstance={ref} />
  )
})
