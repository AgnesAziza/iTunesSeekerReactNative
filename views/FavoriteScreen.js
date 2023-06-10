import React, { useState, useEffect } from 'react';
// import'AsyncStorage' pour le stockage de données, et 'StarRating' et 'Icon' pour l'interface utilisateur
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/FontAwesome';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  removeButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
    marginLeft: 5,
  },
  artistName: {
    flex: 1,
  },
  trackName: {
    flex: 1,
  },
});

const FavoriteScreen = ({ style }) => {
    // Utilisation de l'hook 'useState' pour gérer l'état local des favoris
  const [favorites, setFavorites] = useState([]);

    // L'hook 'useEffect' est utilisé pour exécuter la fonction fetchFavorites lors du montage du composant
  useEffect(() => {
    fetchFavorites();
  }, []);

    // Définition de la fonction pour récupérer les favoris depuis le stockage local
  const fetchFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favorites');
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

    // Définition de la fonction pour supprimer un élément favori
  const removeFavoriteItem = async (itemToRemove) => {
    const updatedFavorites = favorites.filter((item) => item.trackId !== itemToRemove.trackId);
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };
  // Définition de la fonction pour mettre à jour la notation d'un élément favori
  const updateRating = async (itemToUpdate, newRating) => {
    const updatedFavorites = favorites.map((item) => {
      if (item.trackId === itemToUpdate.trackId) {
        return { ...item, rating: newRating };
      }
      return item;
    });

  // Définition de la fonction pour rendre chaque élément de la liste
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.artistName} numberOfLines={2}>{item.artistName}</Text>
        <Text style={styles.trackName} numberOfLines={2}>{item.trackName}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={item.rating || 0}
          starSize={20}
          fullStarColor="gold"
          selectedStar={(rating) => updateRating(item, rating)}
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFavoriteItem(item)}
        >
          <Icon name="trash-o" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[{ flex: 1 }, style]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => `${item.artistName}-${item.trackName}-${item.timestamp}`}
        renderItem={renderItem}
      />
    </View>
  );
};

FavoriteScreen.propTypes = {
  style: PropTypes.object,
};

export default FavoriteScreen;
