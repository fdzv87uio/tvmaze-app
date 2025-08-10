// app/show/[id].tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Show, Episode, Season } from '../../types/api';
import apiClient from '../../api/tvmaze';
import { useFavorites } from '../../context/FavoritesContext';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';
import EpisodeModal from '../../components/EpisodeModal';
import RenderHTML from 'react-native-render-html';

export default function ShowDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [showRes, episodesRes] = await Promise.all([
          apiClient.get<Show>(`/shows/${id}`),
          apiClient.get<Episode[]>(`/shows/${id}/episodes`),
        ]);
        setShow(showRes.data);
        setEpisodes(episodesRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);
  
  // Group episodes by season
  const seasons = useMemo(() => {
    return episodes.reduce((acc: Season[], episode) => {
      let season = acc.find(s => s.season === episode.season);
      if (!season) {
        season = { season: episode.season, episodes: [] };
        acc.push(season);
      }
      season.episodes.push(episode);
      return acc;
    }, []);
  }, [episodes]);

  const handleFavoriteToggle = () => {
    if (!show) return;
    if (isFavorite(show.id)) {
      removeFavorite(show.id);
      Toast.show({ type: 'error', text1: 'Removed from Favorites' });
    } else {
      addFavorite(show);
      Toast.show({ type: 'success', text1: 'Added to Favorites' });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FFF" style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  if (!show) {
    return <Text style={styles.errorText}>Show not found.</Text>;
  }

  // Define styles for specific HTML tags in the summary
  // We add 'as const' to ensure TypeScript infers the most specific type for fontWeight.
  const summaryTagsStyles = {
    p: {
      color: '#FFF',
      fontSize: 16,
      lineHeight: 22,
      marginTop: 0,
      marginBottom: 0,
    },
    b: {
        color: '#FFF',
        fontWeight: 'bold',
    }
  } as const;

  const summarySource = {
      html: show.summary || '<p>No summary available.</p>'
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: show.image?.original }} style={styles.poster} />
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
            <Text style={styles.title}>{show.name}</Text>
            <Pressable onPress={handleFavoriteToggle} accessibilityLabel="Toggle Favorite">
                <FontAwesome name={isFavorite(show.id) ? "heart" : "heart-o"} size={28} color="#E50914" />
            </Pressable>
        </View>
        <Text style={styles.genres}>{show.genres.join(' • ')}</Text>
        <Text style={styles.schedule}>Airs on {show.schedule.days.join(', ')} at {show.schedule.time}</Text>
        
        {/* Replace the Text component with RenderHTML for the summary */}
        <View style={styles.summaryContainer}>
            <RenderHTML
                contentWidth={width - 30} // container padding (15*2)
                source={summarySource}
                tagsStyles={summaryTagsStyles}
            />
        </View>

        <Text style={styles.sectionTitle}>Episodes</Text>
        {seasons.map((season) => (
          <View key={season.season}>
            <Text style={styles.seasonHeader}>Season {season.season}</Text>
            {season.episodes.map(episode => (
                <Pressable key={episode.id} style={styles.episodeItem} onPress={() => setSelectedEpisode(episode)}>
                    <Text style={styles.episodeText}>{episode.number}. {episode.name}</Text>
                </Pressable>
            ))}
          </View>
        ))}
      </View>
      {selectedEpisode && (
          <EpisodeModal
            episode={selectedEpisode}
            visible={!!selectedEpisode}
            onClose={() => setSelectedEpisode(null)}
          />
      )}
    </ScrollView>
  );
}

// Add extensive styling for a premium look
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  poster: { width: '100%', height: 500, resizeMode: 'cover' },
  detailsContainer: { padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', flex: 1, marginRight: 10 },
  genres: { color: '#8E8E93', fontSize: 16, marginTop: 5 },
  schedule: { color: '#8E8E93', fontSize: 16, marginTop: 5 },
  summaryContainer: { marginTop: 15 },
  summary: { color: '#FFF', fontSize: 16, lineHeight: 22 },
  sectionTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  seasonHeader: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 5, paddingLeft: 5, borderLeftWidth: 3, borderLeftColor: '#E50914' },
  episodeItem: { backgroundColor: '#1C1C1E', padding: 12, borderRadius: 5, marginVertical: 4 },
  episodeText: { color: '#FFF', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 50 },
});
