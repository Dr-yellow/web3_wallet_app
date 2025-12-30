// import { refreshToken as refreshTokenApi } from '@/api/app/auth';
import axios from 'axios';
import { router } from 'expo-router';
import { tokenStore } from './tokenStore';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

function addSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

export async function refreshToken(): Promise<string> {
  if (isRefreshing) {
    return new Promise(resolve => addSubscriber(resolve));
  }
  isRefreshing = true;

  try {
    const refreshToken = await tokenStore.getRefresh();
    if (!refreshToken) {
    // refreshToken 不存在  去登录
    router.dismissAll()
    router.push("/login/mail");
    throw new Error('Refresh token expired');
  }

    const res = await axios.post("/auth/refresh", { refresh_token: refreshToken });

    const { access_token, refresh_token, user_id } = res.data;

    await tokenStore.set(access_token, refresh_token, user_id);
    onRefreshed(access_token);

    return access_token;
  } finally {
    isRefreshing = false;
  }
}
