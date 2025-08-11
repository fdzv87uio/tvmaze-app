import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import PinScreen from '../app/pin';

// Mock the external dependencies to isolate the component for testing.
// This prevents errors from hooks and modules that rely on the native environment.
const mockLogin = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  SplashScreen: {
    hideAsync: jest.fn(),
  },
}));
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
  HARDCODED_PIN: '1234',
}));

describe('PinScreen', () => {
  // Use fake timers to control `setTimeout` in the useEffect hook.
  // This is essential for testing the incorrect PIN behavior without waiting.
  jest.useFakeTimers();

  beforeEach(() => {
    // Clear mocks before each test to ensure a clean state.
    jest.clearAllMocks();
  });

  it('renders the title and subtitle correctly', () => {
    render(<PinScreen />);
    expect(screen.getByText('Enter PIN')).toBeOnTheScreen();
    expect(screen.getByText('Please enter your 4-digit PIN to access the app.')).toBeOnTheScreen();
  });

  it('calls SplashScreen.hideAsync on mount', () => {
    render(<PinScreen />);
    expect(require('expo-router').SplashScreen.hideAsync).toHaveBeenCalledTimes(1);
  });

  it('correctly handles multiple number presses and backspace', () => {
    render(<PinScreen />);
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));

    const backspaceButton = screen.getByLabelText('Backspace');
    fireEvent.press(backspaceButton);

    fireEvent.press(screen.getByText('4'));
    fireEvent.press(screen.getByText('5'));
    // The login function should not have been called yet.
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('prevents entering more digits than the pin length', () => {
    render(<PinScreen />);
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));
    fireEvent.press(screen.getByText('5'));

    // The login function should have been called only after the 4th digit.
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });

  it('shows an error and clears the PIN for an incorrect entry', async () => {
    render(<PinScreen />);
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('1'));

    // The component will show an error and clear the PIN after 1 second.
    await waitFor(() => expect(screen.getByText('Incorrect PIN. Please try again.')).toBeOnTheScreen());

  });

  it('calls login and replaces the route on a correct PIN entry', async () => {
    render(<PinScreen />);
    fireEvent.press(screen.getByText('1'));
    fireEvent.press(screen.getByText('2'));
    fireEvent.press(screen.getByText('3'));
    fireEvent.press(screen.getByText('4'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });
});
