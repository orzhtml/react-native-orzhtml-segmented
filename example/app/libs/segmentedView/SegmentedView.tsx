import React, { FC, forwardRef } from 'react'
import { View } from 'react-native'

export interface SegmentedViewProps {
    [p: string]: any;
    type: string;
    barPosition: string;
    // SegmentedBar props
    barStyle: any;
    barItemStyle: any;
    justifyItem: string;
    indicatorType: string;
    indicatorPosition: string;
    indicatorLineColor: string;
    indicatorLineWidth: number;
    indicatorPositionPadding: number;
    animated: boolean;
    autoScroll: boolean;
    activeIndex: number;
    onChange: (index: number) => void; // (index)
    renderView: any;
    readerViewOptions: object;
}

export interface SegmentedViewInterProps {
    [p: string]: any;
    refInstance: any;
    type: string;
    barPosition: string;
    // SegmentedBar props
    barStyle: any;
    barItemStyle: any;
    justifyItem: string;
    indicatorType: string;
    indicatorPosition: string;
    indicatorLineColor: string;
    indicatorLineWidth: number;
    indicatorPositionPadding: number;
    animated: boolean;
    autoScroll: boolean;
    activeIndex: number;
    onChange: (index: number) => void; // (index)
    renderView: any;
    readerViewOptions: object;
}

const SegmentedView: FC<SegmentedViewProps> = (props) => {
  return (
    <View />
  )
}

const Component = SegmentedView
// 注意：这里不要在 Component 上使用 ref, 换个属性名字比如 refInstance 不然会导致覆盖
export default forwardRef((props: SegmentedViewProps, ref) => {
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
