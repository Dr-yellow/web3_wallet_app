import { TLocale } from "../types";

// 页面级 + 通用
export default {
  settings: {
    title: "设置",
    network: "网络与节点管理",
    preference: "偏好",
    about: "关于",
  },
  preference: {
    title: "偏好",
    language: "中文",
    currency: "货币单位",
    notifications: "通知管理",
    display_language: "显示语言",
  },
  network: {
    title: "网络与节点管理",
    line_management: "线路管理",
    rpc_management: "RPC管理",
    add_evm: "添加EVM网络",
    add_custom_node: "添加自定义节点",
    auto_select: "自动选择",
    current_line: "当前线路：",
    smart_line: "智能线路",
  },
  unit: {
    title: "货币单位",
  },
  home: {
    transfer: "转账",
    receive: "收款",
    scan: "扫一扫",
    history: "交易记录",
    coins: "币种",
  },
  mine: {
    connected_apps: "已连接的应用",
    address_book: "地址簿",
    help_feedback: "帮助与反馈",
    security_privacy: "安全与隐私",
    logout: "退出登录",
    invite_friends: "邀请好友",
    welcome: "欢迎来到",
    login_register: "登录/注册",
    network_fee_balance: "网络费用余额",
    one_account: "一个账户，全链畅游",
    invite_code: "邀请码",
    auto_gas_enabled: "网络费用自动代付 已开通",
  },
  notification: {
    title: "通知推送",
    enable: "允许通知",
    send: "发送代币",
    receive: "接收代币",
    other: "其他互动",
  },
  common: {
    confirm: "确认",
    cancel: "取消",
    back: "返回",
    save: "保存",
    default: "默认",
    custom: "自定义",
  },
  navigation: {
    home: "首页",
    mine: "我的",
  },
} as TLocale
