interface UserAddress {
  address: string;
  chain_id: number;
}
export interface GetUserInfoResponse {
  addresses: UserAddress[];
  balance: string;
  email: string;
}
