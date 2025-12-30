import { API_CODE } from "@/constants/auth";
import { tokenStore } from "@/utils/auth/tokenStore";
import axios from 'axios';
import api from "../app_axios";
import {
  AuthLoginVerifyResponse,
  AuthWalletLoginStartResponse,
  AuthWalletLoginVerifyRequest,
} from "../type/login";

/**
 * 获取用户账户身份信息，包括脱敏之后的邮箱和钱包地址
 */
export async function getAccountIdentity() {
  const userId = await tokenStore.getUserId();
  return api.get("/auth/account-identity", { params: { user_id: userId } });
}

/**
 * 刷新 access_token
 */
export function refreshToken(refresh_token: string) {
  return axios.post("/auth/refresh", { refresh_token });
}

/**
 * 发送邮箱验证码
 */
export function sendEmailCode(email: string) {
  return api.post("/auth/send-code", {
    email,
  });
}

/**
 * 通过邮箱登录
 */
export function loginByEmail(data: { code: string; email: string }) {
  return api.post("/auth/email-login", {
    ...data,
  });
}

/**
 * 通过钱包地址登录
 */
export function loginByStartWallet(data: {
  address: string;
  chain_id: string;
}): Promise<{ code: API_CODE; data: AuthWalletLoginStartResponse }> {
  const { address, chain_id } = data;
  return api.get("/auth/wallet-login/start", { params: { address, chain_id } });
}
/**
 * 通过钱包地址登录
 */
export function verifyWalletLogin(
  data: AuthWalletLoginVerifyRequest
): Promise<{ code: API_CODE; data: AuthLoginVerifyResponse }> {
  return api.post("/auth/wallet-login/verify", {
    ...data,
  });
}
