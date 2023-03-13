import React, { FC } from 'react'
import { StyleSheet, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'

export interface CarouselControlProps {
  dot?: React.ReactNode,
  activeDot?: React.ReactNode,
  index?: number,
  total?: number,
  scrollToPage?: (index: number, animated?: boolean) => void,
  style?: StyleProp<ViewStyle>,
}

const CarouselControl: FC<CarouselControlProps> = (props) => {
  const renderDot = (dotIndex: number) => {
    let { dot, scrollToPage } = props

    if (React.isValidElement(dot)) {
      dot = React.cloneElement<any>(dot, {
        key: dotIndex,
        onPress: () => {
          scrollToPage && scrollToPage(dotIndex)
        },
      })
      return dot
    }
    return (
      <TouchableOpacity
        key={'dot' + dotIndex}
        activeOpacity={1}
        style={{
          width: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          scrollToPage && scrollToPage(dotIndex)
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            width: 9,
            height: 9,
            borderRadius: 9 / 2,
          }}
        />
      </TouchableOpacity>
    )
  }

  const renderActiveDot = (dotIndex: React.Key | null | undefined) => {
    let { activeDot } = props
    if (React.isValidElement(activeDot)) {
      activeDot = React.cloneElement(activeDot, { key: dotIndex })
      return activeDot
    }
    return (
      <View
        key={dotIndex}
        style={{
          width: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            width: 9,
            height: 9,
            borderRadius: 9 / 2,
          }}
        />
      </View>
    )
  }

  const renderDots = () => {
    let { index, total = 0 } = props
    let dots = []
    for (let i = 0; i < total; ++i) {
      if (i === index) dots.push(renderActiveDot(i))
      else dots.push(renderDot(i))
    }
    return dots
  }

  return React.useMemo(() => {
    return (
      <View style={[lineStyles.container, props.style]} pointerEvents='box-none'>
        <View style={{ flexDirection: 'row' }}>
          {renderDots()}
        </View>
      </View>
    )
  }, [props.index, props.total])
}

const lineStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padding: 4,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})

export default CarouselControl
