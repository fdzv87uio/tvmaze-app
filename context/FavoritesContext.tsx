// context/FavoritesContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Show } from '../types/api';

interface FavoritesContextType {
  favorites: Show[];
  addFavorite: (show: Show) => void;
  removeFavorite: (showId: number) => void;
  isFavorite: (showId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Show[]>([]);

  useEffect(() => {
    // Load favorites from storage on initial app load
    const loadFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };
    loadFavorites();
  }, []);

  const updateStorage = async (updatedFavorites: Show[]) => {
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const addFavorite = (show: Show) => {
    const updatedFavorites = [...favorites, show];
    setFavorites(updatedFavorites);
    updateStorage(updatedFavorites);
  };

  const removeFavorite = (showId: number) => {
    const updatedFavorites = favorites.filter((show) => show.id !== showId);
    setFavorites(updatedFavorites);
    updateStorage(updatedFavorites);
  };

  const isFavorite = (showId: number) => {
    return favorites.some((show) => show.id === showId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};