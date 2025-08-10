// app/_layout.tsx
import { Stack, useRouter, SplashScreen } from 'expo-router';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppHeader } from '../components/Header';
import Toast from 'react-native-toast-message';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Prevent the splash screen from auto-hiding until auth state is checked.
SplashScreen.preventAutoHideAsync();

function Layout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // This useEffect handles the redirection based on auth state.
  useEffect(() => {
    // We wait until the loading state is false before we do anything.
    if (!isLoading) {
      // Hide the splash screen when we are done checking auth status.
      SplashScreen.hideAsync();
      
      // If the user is not authenticated, redirect them to the pin screen.
      if (!isAuthenticated) {
        router.replace('/pin');
      } 
      // If the user is authenticated, redirect them to the home screen.
      else {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isLoading]);

  // While loading, we display a full-screen loading indicator.
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  // The Stack now contains ALL possible screens. We let the useEffect handle
  // the initial navigation. This prevents the "unmatched route" error.
  return (
    <>
      <Stack
        screenOptions={{
          header: () => (isAuthenticated ? <AppHeader /> : null),
        }}
      >
        <Stack.Screen name="pin" />
        <Stack.Screen name="index" />
        <Stack.Screen name="show/[id]" />
        <Stack.Screen name="favorites" />
      </Stack>
      <Toast />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Layout />
      </FavoritesProvider>
    </AuthProvider>
  );
}
