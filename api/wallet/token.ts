import api from "../wallet_axios";

interface TokenRes {
  address: string;
  chain_ids?: string;
}

export interface TokenItem {
  chain: string;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance: number;
  unit_price_usd: number;
  total_value_usd: number;
  logo_url: string;
  is_verified: boolean;
  token_type: string;
}
// 拦截器已经处理过响应，成功时返回的是 data 对象
export interface TokenResponse {
  total_usd_value: number;
  tokens: TokenItem[];
}

export async function GetToken({
  address,
  chain_ids,
}: TokenRes): Promise<TokenResponse> {
  let url = "/api/tokens/" + address;
  if (chain_ids) {
    url += "?chain_ids=" + chain_ids;
  }
  return api.get(url);
}
