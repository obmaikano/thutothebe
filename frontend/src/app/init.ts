import { store } from './store';
import { setCredentials, logout } from '../features/auth/authSlice';
import { getToken, isTokenValid } from '../features/auth/authUtils';

export async function initializeApp() {
  const token = getToken();
  
  if (token) {
    try {
      // First validate token format and expiration locally
      if (!isTokenValid(token)) {
        // Token is invalid or expired, clear it
        store.dispatch(logout());
        return;
      }
      
      // Verify token with backend and get user data
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        try {
          const responseText = await response.text();
          
          // Check if the response is empty
          if (!responseText) {
            console.error('Empty response from /api/auth/me');
            store.dispatch(logout());
            return;
          }
          
          try {
            // Try to parse the response as JSON
            const responseData = JSON.parse(responseText);
            
            // Check if response follows OhmaApiResponse structure
            let userData;
            if (responseData.status === 'SUCCESS' && responseData.data) {
              userData = responseData.data;
            } else {
              userData = responseData;
            }
            
            if (userData) {
              store.dispatch(setCredentials({ user: userData, token }));
            } else {
              console.error('Invalid user data format:', responseData);
              store.dispatch(logout());
            }
          } catch (jsonError) {
            console.error('Error parsing user data JSON in init:', jsonError);
            console.log('Raw response:', responseText);
            store.dispatch(logout());
          }
        } catch (parseError) {
          console.error('Error reading response text in init:', parseError);
          store.dispatch(logout());
        }
      } else {
        console.error(`Error response from /api/auth/me: ${response.status} ${response.statusText}`);
        store.dispatch(logout());
      }
    } catch (error) {
      console.error('Error verifying token in init:', error);
      store.dispatch(logout());
    }
  }
} 