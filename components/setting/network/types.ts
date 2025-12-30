export enum NetworkTabId {
  Line = "line",
  Rpc = "rpc",
}

export type NetworkTabChildren = {
  id: string;
  label: string;
}

export type NetworkTabItem = {
  id: NetworkTabId;
  label: string;
  children?: NetworkTabChildren[];
};
