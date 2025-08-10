import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

// Hardcoded PIN for this example
export const HARDCODED_PIN = '6669';

// Create the authentication context
//@ts-ignore
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth:any = () => useContext(AuthContext);

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check the stored authentication status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to load auth state from storage', e);
      } finally {
        setIsInitializing(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Listen for app state changes to lock the app
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        // Lock the app by setting isAuthenticated to false
        setIsAuthenticated(false);
        AsyncStorage.setItem('isAuthenticated', 'false');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  // Function to log in
  const login = useCallback(() => {
    setIsAuthenticated(true);
    AsyncStorage.setItem('isAuthenticated', 'true');
  }, []);

  // Function to log out
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    AsyncStorage.setItem('isAuthenticated', 'false');
  }, []);

  const value = {
    isAuthenticated,
    isInitializing,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
