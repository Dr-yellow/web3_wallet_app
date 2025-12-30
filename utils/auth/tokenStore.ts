import * as SecureStore from 'expo-secure-store';

export const tokenStore = {
  getAccess: () => SecureStore.getItemAsync('access_token'),
  getRefresh: () => SecureStore.getItemAsync('refresh_token'),
  getUserId: () => SecureStore.getItemAsync('user_id'),
  set: async (access: string, refresh: string, userId: string) => {
    try {
      await SecureStore.setItemAsync('access_token', access);
      await SecureStore.setItemAsync('refresh_token', refresh);
      await SecureStore.setItemAsync('user_id', String(userId));
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  },
  clear: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('user_id');
  },
};
