
import React from 'react'
import { ScrollViewProps } from 'react-native'

export interface CarouselProps extends ScrollViewProps {
    [p: string]: any;
    children: React.ReactNode;
    carousel?: boolean; // 是否开启轮播
    interval?: number; // 每页停留时间
    direction?: string; // 轮播方向
    startIndex?: number; // 起始页面编号，从 0 开始
    cycle?: boolean; // 是否循环
    control?: boolean | React.ReactElement;
    insets?: boolean;
    onChange: (index: number, total: number) => void; // (index, total) 页面改变时调用
}

export interface CarouselControlProps {
    dot?: React.ReactElement,
    activeDot?: React.ReactElement,
    index: number;
    total: number;
    scrollToPage: (index: number | null, animated?: boolean) => void;
    style: any;
}

export interface CarouselInterProps extends ScrollViewProps {
    [p: string]: any;
    children: React.ReactNode;
    refInstance: any;
    carousel: boolean; // 是否开启轮播
    interval: number; // 每页停留时间
    direction: string; // 轮播方向
    startIndex: number; // 起始页面编号，从 0 开始
    cycle: boolean; // 是否循环
    control: boolean | React.ReactElement;
    insets: boolean;
    onChange: (index: number, total: number) => void; // (index, total) 页面改变时调用
}

export interface InstanceProps {
    cardIndex: null | number;
    timer: null | NodeJS.Timeout;
    carousel: null | boolean;
    step: null | number;
    pageCount: number;
    cycle: boolean;
    forward: boolean;
    cardCount: number;
}
