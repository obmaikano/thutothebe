// Token storage keys
const TOKEN_KEY = 'thutothebe_token';
const USER_KEY = 'thutothebe_user';

/**
 * Store authentication token in local storage
 * @param token JWT token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token from local storage
 * @returns JWT token or null if not found
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token from local storage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
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