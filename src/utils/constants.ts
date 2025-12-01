import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export const APP_CONFIG = {
  NAME: extra.APP_NAME || Constants.expoConfig?.name || 'Default App',
  BASE_URL: extra.BASE_URL,
  MOCK_API: !["staging", "production"].includes(extra.ENV)
};

export const API_CONFIG = {
  BASE_URL: APP_CONFIG.BASE_URL,
  TIMEOUT: 10000,
  MOCK_API: APP_CONFIG.MOCK_API
};

export const ROUTES = {
  AUTH: {
    LOGIN: '/(auth)/login',
    REGISTER: '/(auth)/register',
  },
  TABS: {
    HOME: '/(protected)',
    SETTINGS: '/(protected)/settings',
  },
  REPORT_CREATE:{
    CREATE: '/report/create',
  },
  ADMIN: {
    USERS: '/(admin)/user-management',
    PROFILE: '/(admin)/profile',
  },
};

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input.',
};