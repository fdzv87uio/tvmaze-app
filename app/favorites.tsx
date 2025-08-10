// app/favorites.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import ShowCard from '../components/ShowCard';
import { Link, SplashScreen } from 'expo-router';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>You haven't added any favorites yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <Link href={`/show/${item.id}`} asChild>
              <ShowCard show={item} />
            </Link>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ padding: 5 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});