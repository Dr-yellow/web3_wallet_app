/**
 * 钱包相关的接口基础层
 */
import { API_CODE, ERROR_CODE_MSG } from '@/constants/auth';
import axios from 'axios';
import { Alert, DeviceEventEmitter } from 'react-native';

const WALLET_BASE_URL = 'https://t.gmwallet.me';

const api = axios.create({  
  baseURL: `${WALLET_BASE_URL}`,
  timeout: 30000,
});

const getMessage = (data: { code: keyof typeof ERROR_CODE_MSG; msg?: string }) => {
  const { code, msg } = data;
  return ERROR_CODE_MSG[code] || msg || '系统繁忙，请稍后再试';
};

// 请求拦截器：自动注入 access_token
api.interceptors.request.use(async (config: any) => {
  if (!config.noLoading) {
    DeviceEventEmitter.emit('api_loading', true);
  }
  // let token = await tokenStore.getAccess();
  
  // if (token && config.headers) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  // 输出请求信息
  console.log('[API Request]', {
    method: config.method,
    url: config.baseURL + config.url,
    headers: config.headers,
    params: config.params,
    data: config.data,
  });
  return config;
}, error => {
  DeviceEventEmitter.emit('api_loading', false);
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

// 响应拦截器：遇 401 自动刷新
api.interceptors.response.use(
  res => {
    if (!(res.config as any).noLoading) {
      DeviceEventEmitter.emit('api_loading', false);
    }
    console.log('[API Response]', {
      url: res.config.url,
      status: res.status,
      data: res.data,
    });
    if (res.data.code === API_CODE.SUCCESS) {
      return res.data.data;
    } else {
      // Alert.alert('请求失败', res.data.msg || '未知错误');
      throw {
        isBusinessError: true,
        code: res.data.code,
        msg: getMessage(res.data),
        data: res.data.data,
      };
    }
  },
  async error => {
    DeviceEventEmitter.emit('api_loading', false);
    if (!error.response) {
      Alert.alert('网络错误', '请检查您的网络连接');
      return Promise.reject(error);
    }

    // 钱包接口未必适用
    // if (error.response.status === 401) {
      // const originalRequest = error.config;
      // if (originalRequest && !originalRequest._retry) {
      //   originalRequest._retry = true;
      //   try {
      //     return api(originalRequest);
      //   } catch {
      //     // 打开登录页？？
      //   }
      // }
    // }

    return Promise.reject(error);
  }
);

export default api;
