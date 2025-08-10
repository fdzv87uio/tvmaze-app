// app/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../api/tvmaze';
import { Show } from '../types/api';
import ShowCard from '../components/ShowCard';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const [shows, setShows] = useState<Show[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // We no longer need to check `isAuthenticated` here to redirect.
  // The RootLayout now handles that logic.
  const { isAuthenticated } = useAuth();
  
  const fetchShows = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await apiClient.get<Show[]>(`/shows?page=${page}`);
      setShows((prevShows) => [...prevShows, ...response.data]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);
  
  const searchShows = async (query: string) => {
    if (!query) {
      setPage(0);
      setShows([]);
      // fetch initial shows when search is cleared
      fetchShows();
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get<{show: Show}[]>(`/search/shows?q=${query}`);
      const searchResults = response.data.map(item => item.show);
      setShows(searchResults);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // We only fetch shows if the user is authenticated and not searching.
    // The redirect logic has been moved to _layout.tsx.
    if (isAuthenticated && searchQuery === '') {
      fetchShows();
    }
  }, [fetchShows, searchQuery, isAuthenticated]);

  return (
    <View style={styles.container}>
      <FlatList
        data={shows}
        renderItem={({ item }) => (
          <Link href={`/show/${item.id}`} asChild>
            <ShowCard show={item} />
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => !searchQuery && fetchShows()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="#FFF" /> : null}
        numColumns={2}
      />
      <SafeAreaView edges={['bottom']} style={styles.safeAreaFooter}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for a series..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => searchShows(searchQuery)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchBar: {
    backgroundColor: '#1C1C1E',
    color: '#FFF',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    marginTop:10,
  },
  safeAreaFooter: {
    backgroundColor: '#000',
  },
});
