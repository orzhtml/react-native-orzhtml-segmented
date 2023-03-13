import React, { FC, forwardRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export interface ProjectorProps {
  style?: StyleProp<ViewStyle>,
  index: number,
  slideStyle?: StyleProp<ViewStyle>,
  children?: React.ReactNode | React.ReactNode[],
}

export interface ProjectorInterProps extends ProjectorProps {
  refInstance: React.ForwardedRef<any>;
}

/**
 *
 * @param props 通过 props 传入的 index 切换
 * 只有 index 和 children 变更，才重新渲染，否则其他 props 变更不渲染
 * @returns
 */
const Projector: FC<ProjectorInterProps> = (props) => {
  return React.useMemo(() => {
    let { index, style, slideStyle, children, ...others } = props
    let _children: React.ReactNode[] = []
    if (!(children instanceof Array)) {
      if (children) _children = [children]
      else _children = []
    } else {
      _children = children
    }
    let slideShowns: any = null
    if (!slideShowns || slideShowns.length !== _children.length) {
      slideShowns = _children.map(() => false)
    }

    return (
      <View style={[{ flex: 1, position: 'relative' }, style]} {...others}>
        {_children.map((item: any, i: React.Key) => {
          let active = (i === index)
          if (active) slideShowns[i] = true
          let renderSlideStyle = [
            slideStyle,
            lineStyles.slide,
            { opacity: active ? 1 : 0, zIndex: active ? 1 : 0 },
          ]

          return (
            <View key={i} style={renderSlideStyle} pointerEvents={active ? 'auto' : 'none'}>
              {slideShowns[i] ? item : null}
            </View>
          )
        })}
      </View>
    )
  }, [props.index, props.children])
}

Projector.defaultProps = {
  index: 0,
}

const lineStyles = StyleSheet.create({
  slide: {
    backgroundColor: 'red',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
})

const Component = Projector
// 注意：这里不要在 Component 上使用 ref, 换个属性名字比如 refInstance 不然会导致覆盖
export default forwardRef((props: ProjectorProps, ref) => (
  <Component {...props} refInstance={ref} />
))
