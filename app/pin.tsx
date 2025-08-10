import React, { useState, useEffect, FC, JSX } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth, HARDCODED_PIN } from '../context/AuthContext';
import { useRouter, SplashScreen } from 'expo-router'; // Import SplashScreen

// PIN entry screen with a numerical keypad
export default function PinScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const pinLength: number = 4;

  // *** THE FIX IS HERE ***
  // This useEffect will run once the PinScreen has mounted.
  // Hiding the splash screen here ensures the user sees a seamless
  // transition from the splash screen directly to the PIN input.
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Handles number button presses
  const handleNumberPress = (number: string): void => {
    if (pin.length < pinLength) {
      setPin(pin + number);
      if (error) setError('');
    }
  };

  // Handles backspace button press
  const handleBackspacePress = (): void => {
    setPin(pin.slice(0, -1));
  };

  // Check the PIN when it reaches the required length
  useEffect(() => {
    if (pin.length === pinLength) {
      if (pin === HARDCODED_PIN) {
        login();
        // IMPORTANT: Use replace so the user can't go "back" to the PIN screen.
        router.replace('/');
      } else {
        setError('Incorrect PIN. Please try again.');
        setTimeout(() => setPin(''), 1000);
      }
    }
  }, [pin, login, router]); // Added router and changed push to replace

  const renderPinDots = (): JSX.Element[] => {
    const dots: JSX.Element[] = [];
    for (let i = 0; i < pinLength; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.pinDot, i < pin.length && styles.pinDotFilled]}
        />
      );
    }
    return dots;
  };

  const renderKeypad = (): JSX.Element[] => {
    const keypadButtons: (string | null)[][] = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      [null, '0', 'backspace'],
    ];

    return keypadButtons.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.keypadRow}>
        {row.map((buttonValue, buttonIndex) => (
          <TouchableOpacity
            key={buttonIndex}
            style={[
              styles.keypadButton,
              buttonValue === null && styles.keypadButtonInvisible,
            ]}
            onPress={() => {
              if (buttonValue === 'backspace') {
                handleBackspacePress();
              } else if (buttonValue !== null) {
                handleNumberPress(buttonValue);
              }
            }}
            disabled={buttonValue === null}
            accessibilityLabel={
              buttonValue === 'backspace' ? 'Backspace' : `Enter number ${buttonValue}`
            }
          >
            {buttonValue === 'backspace' ? (
              <Text style={styles.backspaceIcon}>⌫</Text>
            ) : buttonValue !== null ? (
              <Text style={styles.keypadButtonText}>{buttonValue}</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Enter PIN</Text>
      <Text style={styles.subtitle}>Please enter your 4-digit PIN to access the app.</Text>
      
      <View style={styles.pinDisplay}>{renderPinDots()}</View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={styles.keypadContainer}>{renderKeypad()}</View>
    </View>
  );
};

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#c9d1d9',
  },
  subtitle: {
    fontSize: 18,
    color: '#8b949e',
    marginBottom: 40,
    textAlign: 'center',
  },
  pinDisplay: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#c9d1d9',
    marginHorizontal: 10,
    opacity: 0.3,
  },
  pinDotFilled: {
    opacity: 1,
  },
  errorText: {
    color: '#f85149',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: '600',
  },
  keypadContainer: {
    width: '80%',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  keypadButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#238636',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  keypadButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  keypadButtonInvisible: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  backspaceIcon: {
    fontSize: 28,
    color: '#c9d1d9',
  },
});
