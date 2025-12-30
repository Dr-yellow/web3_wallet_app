import { API_CODE } from "@/constants/auth";
import api from "../app_axios";
import { GetUserInfoResponse } from "../type/user";
/**
 * 获取用户账户信息，包括用户的邮箱、钱包地址、资产信息等。
 */

export async function getUserInfo(): Promise<{
  code: API_CODE;
  data: GetUserInfoResponse;
}> {
  return api.get("/user/info");
}
