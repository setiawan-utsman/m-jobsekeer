import { VALIDATION } from './constants';

export const validation = {
  email: (email: string): string | null => {
    if (!email) {
      return 'Email is required';
    }
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      return 'Invalid email format';
    }
    return null;
  },

  password: (password: string): string | null => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
    }
    return null;
  },

  name: (name: string): string | null => {
    if (!name) {
      return 'Name is required';
    }
    if (name.length < VALIDATION.NAME_MIN_LENGTH) {
      return `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
    }
    return null;
  },

  required: (value: any, fieldName: string): string | null => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value: string, minLength: number, fieldName: string): string | null => {
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
  },

  maxLength: (value: string, maxLength: number, fieldName: string): string | null => {
    if (value.length > maxLength) {
      return `${fieldName} must be at most ${maxLength} characters`;
    }
    return null;
  },
};