import { NetworkTabId, NetworkTabItem } from "./types";


// 标签页 配置
export const TABS_CONFIG: NetworkTabItem[] = [
  {
    id: NetworkTabId.Line,
    label: "线路管理",
    children: [
      { id: "default", label: "默认" },
      { id: "smart", label: "智能线路" },
    ],
  },
  {
    id: NetworkTabId.Rpc,
    label: "RPC管理",
    children: [
      { id: "default", label: "默认" },
      { id: "custom", label: "自定义" },
    ],
  },
];
