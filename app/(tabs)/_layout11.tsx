import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React, { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Appearance, DynamicColorIOS } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  console.log(colorScheme);
  useEffect(() => {
    Appearance.setColorScheme("dark"); // FIXME: https://github.com/expo/expo/issues/40389  目前版本问题，需要强制黑暗
  },[])
  return (
    <NativeTabs
      // labelStyle={{
      //   default: {
      //     color: '#ccc',
      //   },
      //   selected: {
      //     color: '#000',
      //   },
      // }}
      tintColor={DynamicColorIOS({
        dark: '#000',
        light: '#000',
      })}
      iconColor={{
        default: '#000',
        selected: '#fff',
      }}
      // shadowColor="#fff"
      // backgroundColor="#000"
    >
      <NativeTabs.Trigger
        name="home"
        options={{
          labelStyle: {
            color: '#fff',
          },
          iconColor: '#000',
          blurEffect: "none",
          backgroundColor: '#000'
        }}
      >
        <Icon sf="house.fill" />
        <Label>首页</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name="mine"
        options={{
          blurEffect: "none",
        }}
      >
        <Icon sf="person.fill" />
        <Label>我的</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //   }}>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="explore"
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
    //     }}
    //   />
    // </Tabs>
  );
}
