import { Href } from 'expo-router';
import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

export type TabItem = {
  href: Href;
  name: string;
  title: string;
  icon: ComponentType<SvgProps>; // 更准确的 React 组件类型
};
