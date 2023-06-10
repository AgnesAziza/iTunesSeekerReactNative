import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  itemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  favoriteIcon: {
    marginRight: 10,
  },
  backButton: {
    alignSelf: 'flex-end',
  },
  favoritesButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#800080',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoritesButtonText: {
    fontSize: 16,
    color: '#FFF',
    marginLeft: 10,
  },
});

const DetailsScreen = ({ navigation, route }) => {
  const { itemSelected } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const addToFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favorites');
      let favorites = [];
      if (favoritesData) {
        favorites = JSON.parse(favoritesData);
      }

      // Vérifie si l'élément est déjà présent dans les favoris
      const isDuplicate = favorites.some((item) => {
        if (itemSelected.trackId) {
          // Vérifie si c'est un track
          return item.trackId === itemSelected.trackId;
        } else if (itemSelected.artistId) {
          // Vérifie si c'est un artiste
          return item.artistId === itemSelected.artistId;
        }
        return false;
      });

      if (!isDuplicate) {
        // Ajoute l'élément aux favoris
        favorites.push(itemSelected);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        setIsFavorite(true);
      } else {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem('favorites');
      let favorites = [];
      if (favoritesData) {
        favorites = JSON.parse(favoritesData);
      }

      // Recherche l'élément à supprimer dans les favoris
      const updatedFavorites = favorites.filter((item) => {
        if (itemSelected.trackId) {
          // Vérifie si c'est un track
          return item.trackId !== itemSelected.trackId;
        } else if (itemSelected.artistId) {
          // Vérifie si c'est un artiste
          return item.artistId !== itemSelected.artistId;
        }
        return true;
      });

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } catch (error) {
    }
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToFavorites = () => {
    navigation.navigate('Favorites');
  };

  const confirmRemoval = () => {
    Alert.alert(
      'Supprimer des favoris',
      'Êtes-vous sûr de vouloir supprimer cet élément des favoris ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: removeFromFavorites },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const checkIsFavorite = async () => {
      try {
        const favoritesData = await AsyncStorage.getItem('favorites');
        let favorites = [];
        if (favoritesData) {
          favorites = JSON.parse(favoritesData);
        }

        // Vérifie si l'élément est déjà présent dans les favoris
        const isFavorite = favorites.some((item) => {
          if (itemSelected.trackId) {
            // Vérifie si c'est un track
            return item.trackId === itemSelected.trackId;
          } else if (itemSelected.artistId) {
            // Vérifie si c'est un artiste
            return item.artistId === itemSelected.artistId;
          }
          return false;
        });

        setIsFavorite(isFavorite);
      } catch (error) {
        console.error("Erreur lors de la vérification des favoris:", error);
      }
    };

    checkIsFavorite();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.itemTextContainer}>
          <Icon name="music" size={24} color="#333" />
          <Text style={styles.itemText}>{itemSelected.trackName}</Text>
        </View>
        <View style={styles.itemTextContainer}>
          <Icon name="user" size={24} color="#333" />
          <Text style={styles.itemText}>{itemSelected.artistName}</Text>
        </View>
        {isFavorite ? (
          <TouchableOpacity style={styles.favoriteButton} onPress={confirmRemoval}>
            <Icon name="heart" size={24} color="#FF1493" style={styles.favoriteIcon} />
            <Text style={{ color: '#FF1493' }}>Retirer des favoris</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.favoriteButton} onPress={addToFavorites}>
            <Icon name="heart-o" size={24} color="#666" style={styles.favoriteIcon} />
            <Text>Ajouter aux favoris</Text>
          </TouchableOpacity>
        )}
      </View>
      <Button title="Retour" onPress={navigateBack} style={styles.backButton} />

      <TouchableOpacity style={styles.favoritesButton} onPress={navigateToFavorites}>
        <Icon name="heart" size={20} color="#FFF" />
        <Text style={styles.favoritesButtonText}>Mes favoris</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailsScreen;
