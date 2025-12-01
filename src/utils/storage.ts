import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  TOKEN: 'auth_token',
  THEME: 'theme_mode',
  USER: 'user_data',
};

class Storage {
  private isWeb = Platform.OS === 'web';

  async setItem(key: string, value: string): Promise<void> {
    if (this.isWeb) {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (this.isWeb) {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.isWeb) {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  async setToken(token: string): Promise<void> {
    await this.setItem(KEYS.TOKEN, token);
  }

  async getToken(): Promise<string | null> {
    return await this.getItem(KEYS.TOKEN);
  }

  async removeToken(): Promise<void> {
    await this.removeItem(KEYS.TOKEN);
  }

  async setThemeMode(mode: string): Promise<void> {
    await this.setItem(KEYS.THEME, mode);
  }

  async getThemeMode(): Promise<string | null> {
    return await this.getItem(KEYS.THEME);
  }

  async setUserData(data: any): Promise<void> {
    await this.setItem(KEYS.USER, JSON.stringify(data));
  }

  async getUserData(): Promise<any | null> {
    const data = await this.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  async clearAll(): Promise<void> {
    await this.removeToken();
    await this.removeItem(KEYS.THEME);
    await this.removeItem(KEYS.USER);
  }
}

export const storage = new Storage();