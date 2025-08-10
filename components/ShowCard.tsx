// components/ShowCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Show } from '../types/api';

interface ShowCardProps {
  show: Show;
}

const ShowCard = React.forwardRef<View, ShowCardProps & { onPress?: () => void }>(({ show, onPress, ...props }, ref) => {
  const placeholderImage = 'https://static.tvmaze.com/images/no-img/no-img-portrait-text.png';

  return (
    <Pressable onPress={onPress} {...props} style={styles.card} ref={ref}>
      <Image
        source={{ uri: show.image?.medium || placeholderImage }}
        style={styles.image}
        accessibilityLabel={`Poster for ${show.name}`}
      />
      <Text style={styles.title}>{show.name}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
});

export default ShowCard;