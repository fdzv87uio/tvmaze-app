// components/EpisodeModal.tsx
import React from 'react';
import { Modal, View, Text, Image, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Episode } from '../types/api';
import { FontAwesome } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';

interface EpisodeModalProps {
  episode: Episode | null;
  visible: boolean;
  onClose: () => void;
}

const EpisodeModal = ({ episode, visible, onClose }: EpisodeModalProps) => {
  const { width } = useWindowDimensions();

  if (!episode) return null;
  
  const placeholderImage = 'https://static.tvmaze.com/images/no-img/no-img-landscape-text.png';

  // Define styles for specific HTML tags
  const tagsStyles = {
    p: {
      color: '#FFF',
      fontSize: 16,
      lineHeight: 22,
      // The default <p> tag has margins, we can remove them if needed
      marginTop: 0,
      marginBottom: 0,
    },
  };

  // The source for RenderHTML needs to be an object with an `html` key.
  // We also ensure the fallback text is wrapped in a <p> tag for consistent rendering.
  const summarySource = {
    html: episode.summary || '<p>No summary available.</p>'
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="close" size={24} color="#FFF" />
          </Pressable>
          <ScrollView>
            <Image source={{ uri: episode.image?.original || placeholderImage }} style={styles.image} />
            <Text style={styles.title}>{episode.name}</Text>
            <Text style={styles.subtitle}>Season {episode.season}, Episode {episode.number}</Text>
            
            {/* Replace the problematic Text component with RenderHTML.
              - `contentWidth` is used for responsive images and other elements within the HTML.
              - `source` takes an object with the HTML string.
              - `tagsStyles` allows you to apply custom styles to specific HTML tags.
            */}
            <RenderHTML
              contentWidth={width}
              source={summarySource}
              tagsStyles={tagsStyles}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%', // Use maxHeight to ensure the modal doesn't get too tall
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 16,
    marginBottom: 15,
  },
  // The summary style is now applied via `tagsStyles` in RenderHTML, 
  // but we can keep it for reference or other uses.
  summary: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 22,
  },
});

export default EpisodeModal;
