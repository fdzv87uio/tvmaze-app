// app/_layout.tsx
import { Stack, useRouter, SplashScreen } from 'expo-router';
import { FavoritesProvider } from '../context/FavoritesContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { AppHeader } from '../components/Header';
import Toast from 'react-native-toast-message';
import React, { useEffect, useState } from 'react';

// This is correct. It prevents the splash screen from hiding prematurely.
SplashScreen.preventAutoHideAsync();

function Layout() {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();
  // NEW: State to track if the layout has mounted, to prevent navigation race conditions.
  const [isLayoutReady, setLayoutReady] = useState(false);

  // This effect runs once after the component mounts to signal it's ready.
  useEffect(() => {
    setLayoutReady(true);
  }, []);

  useEffect(() => {
    // We wait for three conditions to be met before navigating:
    // 1. The authentication state is no longer loading.
    // 2. The layout component has mounted at least once.
    // 3. The router is implicitly ready because we've waited for the layout.
    if (isInitializing || !isLayoutReady) {
      return;
    }

    // Once all conditions are met, we can safely hide the splash screen.
    SplashScreen.hideAsync();

    // And now, we can safely navigate without race conditions.
    if (!isAuthenticated) {
      router.replace('/pin');
    } else {
      router.replace('/');
    }
  }, [isInitializing, isAuthenticated, isLayoutReady]); // The effect now depends on our new state.

  // THE KEY REMAINS: We ALWAYS render the Stack navigator.
  // The native splash screen covers the UI, and our useEffect logic prevents premature navigation.
  // This combination should robustly solve the race condition.
  return (
    <>
      <Stack
        screenOptions={{
          // The header is conditionally rendered based on authentication status.
          header: () => (isAuthenticated ? <AppHeader /> : null),
        }}
      >
        {/* It's good practice to hide the header on the PIN screen */}
        <Stack.Screen name="pin" options={{ headerShown: false }} />
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
    // The providers wrap the layout, ensuring context is available.
    <AuthProvider>
      <FavoritesProvider>
        <Layout />
      </FavoritesProvider>
    </AuthProvider>
  );
}
