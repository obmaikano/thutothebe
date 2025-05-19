import { config } from '../../app/config';
import { jwtDecode } from 'jwt-decode';

// Token storage keys - use the key defined in config
const TOKEN_KEY = config.auth.tokenKey;
const USER_KEY = 'thutothebe_user';

/**
 * Store authentication token in local storage
 * @param token JWT token
 */
export const setToken = (token: string): void => {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Safely get the token from localStorage with error handling
 */
export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    // Simple validation: check if it's a string that could be a JWT
    // JWTs are typically base64 strings with two dots
    if (typeof token === 'string' && token.split('.').length === 3) {
      return token;
    }
    
    // If the token doesn't look like a JWT, clear it and return null
    localStorage.removeItem(TOKEN_KEY);
    return null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
};

/**
 * Clear token from localStorage
 */
export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if the current token is valid and not expired
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const decoded: any = jwtDecode(token);
    
    if (!decoded) return false;
    
    // Check if token has expiration time
    if (decoded.exp) {
      // exp is in seconds, Date.now() is in milliseconds
      return decoded.exp * 1000 > Date.now();
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Store user data in local storage
 * @param user User data
 */
export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from local storage
 * @returns User data or null if not found
 */
export const getUser = (): any | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

/**
 * Remove user data from local storage
 */
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Clear all authentication data from local storage
 */
export const clearAuth = (): void => {
  removeToken();
  removeUser();
};

/**
 * For backward compatibility with existing code that uses removeToken
 */
export const removeToken = clearToken; 