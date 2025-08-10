// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// You'll need a logo image in your assets folder
const logo = require('../assets/logo.png'); // Add a 40x40px logo.png to assets

export const AppHeader = () => {
  return (
    // We wrap the entire header in SafeAreaView and specify 'top'
    // to ensure the content is pushed below the status bar.
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>TV Series</Text>
        <Pressable style={styles.menuButton}>
          <Link href="/favorites">
            <FontAwesome name="heart" size={24} color="#FFF" />
          </Link>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // The style for the SafeAreaView, which will cover the entire top area.
  safeArea: {
    backgroundColor: '#1C1C1E', // Dark background for contrast
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  // The header content itself, now nested inside the SafeAreaView
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 5,
  },
});
