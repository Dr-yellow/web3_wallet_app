export interface AuthWalletLoginStartResponse {
  domain: string;
  address: string;
  statement: string;
  uri: string;
  version: string;
  chain_id: number;
  nonce: string;
  issued_at: string;
  expiration_time: string;
}
export interface AuthLoginVerifyResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
}

export interface AuthWalletLoginVerifyRequest {
  message: string;
  signature: string;
  public_key: string;
  raw_message: AuthWalletLoginStartResponse;
}
