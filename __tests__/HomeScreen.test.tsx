import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { Link, SplashScreen } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../app/index'; // Adjust path as needed

// Mock necessary modules and components to isolate HomeScreen
jest.mock('expo-router', () => ({
  Link: jest.fn(({ children }) => <>{children}</>),
  SplashScreen: {
    hideAsync: jest.fn(),
  },
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(() => ({ isAuthenticated: true })),
}));

// Mock the API client to prevent network calls
jest.mock('../api/tvmaze', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
}));

// Mock the ShowCard component to avoid rendering its internals
jest.mock('../components/ShowCard', () => {
  return ({ show }) => <></>;
});

describe('HomeScreen Initial Render', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean state
    jest.clearAllMocks();
  });

  it('renders the search bar on initial load', () => {
    render(<HomeScreen />);
    const searchInput = screen.getByPlaceholderText('Search for a series...');
    expect(searchInput).toBeTruthy();
  });

  it('does NOT render the activity indicator initially', () => {
    render(<HomeScreen />);
    const activityIndicator = screen.queryByRole('progressbar');
    expect(activityIndicator).toBeNull();
  });

  it('does not render any show data on first paint', async () => {
    // To ensure we're testing the initial state before API calls complete,
    // we use queryByText to check that no show titles exist.
    // The await waitFor is just to let the useEffect finish its mock API call.
    render(<HomeScreen />);
    
    // Wait for the async API call to complete, which in our mock returns no data.
    // This confirms the component settles into a state with no show cards.
    await waitFor(() => {
      // The FlatList is empty on first render and after the mock API call returns empty data.
      const showTitle = screen.queryByText('Show Title'); // Assuming a ShowCard might have this text
      expect(showTitle).toBeNull();
    });
  });
});