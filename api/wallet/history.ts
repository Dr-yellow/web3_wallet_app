import { API_CODE } from "@/constants/auth";
import api from "../wallet_axios";

export interface historyResponse {
  history_list: {
    tx_hash: string;
    chain: string;
    timestamp: number;
    is_scam: boolean;
    other_address: string;
    receives?: {
      token_id: string;
      amount: number | string;
      from_address: string;
      to_address: string;
    }[]; // 多笔可能是有存在空投奖励？？
    sends?: {
      token_id: string;
      amount: number | string;
      from_address: string;
      to_address: string;
    }[];
    tx: {
      tx_hash: string;
      from_address: string;
      to_address: string;
      value: number | string;
      fee: number | string;
      fee_type: string;
      name: string; // Tansfer 普通交易   "Swap", "Deposit", "Mint",  "Staking" 合约交互（兑换，质押）？
      status: number;
    };
  }[];
}

/**
 * 查询指定钱包地址的完整交易历史记录，支持通过 start_time 分页
 */

export interface historyResponseType {
  tx_hash: string;
  chain: string;
  timestamp: number;
  is_scam: boolean;
  other_address: string;
  receives: {
    token_id: string;
    amount: number;
    from_address: string;
    to_address: string;
  }[];
  tx: {
    tx_hash: string;
    from_address: string;
    to_address: string;
    value: number;
    fee: number;
    fee_type: string;
    name: string;
    status: number;
  };
}
interface HistoryResponse {
  code: API_CODE;
  data: {
    history_list: historyResponseType[];
  };
}

interface HistoryRequest {
  chain_ids?: string;
  limit?: number;
  start_time?: number;
}

export async function getHistory({
  address,
  params,
  config,
}: {
  address: string;
  params?: Partial<HistoryRequest>;
  config?: any;
}): Promise<HistoryResponse['data']> {
  console.log("getHistory", address, params, config);
  let url = "/api/history/" + address;
  return api.get(url, { params, ...config });
}
