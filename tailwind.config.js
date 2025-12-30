/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 通过 class 控制黑暗模式，适合 iOS 深色模式切换
  theme: {
    extend: {
      colors: {
        // 浅色模式颜色（默认）
        light: {
          pureWhite: '#FFFFFF',
          silverLight: '#F6F6F6',
          silver: '#F0F0F2',
          silverGrey: '#DCDCDC',
          alarmFont: '#FF3535',
          alarmButton: '#F6F6F6',
          okGreen: '#F0F0F2',
          stuckYellow: '#FFA007',
          downRed: '#E31212',
          absoluteBlack: '#000000',
          leadDark: '#161616',
          lead: '#202020',
          leadGrey: '#292929',
        },

        // 深色模式颜色
        dark: {
          pureWhite: '#FFFFFF', // 纯白通常黑暗模式也可用
          silverLight: '#292929', // 适当调整深色模式下的银色系
          silver: '#202020',
          silverGrey: '#161616',
          alarmFont: '#FF3535',  // 红色警告字体在暗色模式保持一致
          alarmButton: '#292929', // 按钮背景变暗
          okGreen: '#202020',    // 绿色对应深色背景
          stuckYellow: '#FFA007',
          downRed: '#E31212',
          absoluteBlack: '#000000',
          leadDark: '#000000',
          lead: '#161616',
          leadGrey: '#292929',
        },
      },
    },
  },
  plugins: [],
}
