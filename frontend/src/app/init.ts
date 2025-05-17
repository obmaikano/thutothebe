import { store } from './store';
import { setCredentials } from '../features/auth/authSlice';

export async function initializeApp() {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // Verify token and get user data
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const userData = await response.json();
        store.dispatch(setCredentials({ user: userData, token }));
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verifying token in init:', error);
      localStorage.removeItem('token');
    }
  }
} 