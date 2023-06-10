import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  itemArtist: {
    fontSize: 16,
    marginRight: 10,
    flexShrink: 1,
  },
  itemTrack: {
    fontSize: 16,
    flexShrink: 1,
  },
  loadMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#DDA0DD',
  },
  loadMoreButtonIcon: {
    color: '#000',
    marginLeft: 10,
  },
  loadMoreButtonText: {
    fontSize: 16,
    color: '#000',
  },
  containerDropdown: {
    marginBottom: 20,
    width: '100%',
  },
});

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState(''); // État pour stocker le texte de recherche
  const [searchType, setSearchType] = useState('musicArtist'); // État pour stocker le type de recherche (artiste ou track)
  const [searchResults, setSearchResults] = useState([]); // État pour stocker les résultats de recherche
  const [loading, setLoading] = useState(false); // État pour indiquer si la recherche est en cours
  const [offset, setOffset] = useState(0); // État pour gérer la pagination des résultats
  const [hasMoreResults, setHasMoreResults] = useState(false); // État pour indiquer s'il y a plus de résultats à charger

  const handleSearchTextChange = (newSearch) => {
    setSearchText(newSearch); // Met à jour le texte de recherche lors de la modification de l'entrée
  };

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + 25); // Incrémente la valeur de l'offset pour charger plus de résultats
  };

  const searchMusic = async (newSearch = false) => {
    setLoading(true); // Définit le chargement en cours sur true pour afficher le spinner
    if (newSearch) {
      setOffset(0); // Réinitialise l'offset à 0 pour une nouvelle recherche
      setSearchResults([]); // Réinitialise les résultats de recherche
    }
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchText)}&media=music&entity=${searchType}&limit=25&offset=${offset}`
      ); // Effectue une requête API pour récupérer les résultats de recherche
      const data = await response.json(); // Convertit la réponse en format JSON
      const results = data.results || []; // Récupère les résultats de la recherche ou un tableau vide s'il n'y a pas de résultats
      setSearchResults((prevResults) => {
        if (newSearch) {
          return results; // Retourne les nouveaux résultats s'il s'agit d'une nouvelle recherche
        } else {
          return [...prevResults, ...results]; // Ajoute les résultats supplémentaires aux résultats existants
        }
      });
      setLoading(false); // Définit le chargement en cours sur false pour arrêter l'affichage du spinner
      setHasMoreResults(results.length > 0); // Définit l'état des résultats supplémentaires en fonction de la longueur des résultats obtenus
    } catch (error) {
      console.error("Erreur lors de la recherche de musique :", error);
      // Afficher un message d'erreur approprié à l'utilisateur ou prendre d'autres mesures nécessaires
    }
  };

  const navigateToDetails = (itemSelected) => {
    navigation.navigate('Details', { itemSelected }); // Navigue vers l'écran "Details" en passant l'élément sélectionné en tant que paramètre
  };

  useEffect(() => {
    if (searchText !== '') searchMusic(); // Effectue la recherche uniquement si le texte de recherche n'est pas vide
  }, [offset]); // Se déclenche lorsque l'offset change (pour charger plus de résultats)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSearchText(''); // Réinitialise le texte de recherche lorsque l'écran redevient en focus
      setSearchResults([]); // Réinitialise les résultats de recherche
    });

    return unsubscribe; // Désabonne le listener lorsque le composant est démonté
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (searchText !== '' || searchResults.length > 0) {
        // Empêche la navigation si une recherche est en cours ou s'il y a des résultats affichés
        e.preventDefault();
      }
    });

    return unsubscribe; // Désabonne le listener lorsque le composant est démonté
  }, [navigation, searchText, searchResults]);

  return (
    <View style={styles.container}>
      <View style={styles.containerDropdown}>
        <Picker
          selectedValue={searchType}
          onValueChange={(itemValue, itemIndex) => setSearchType(itemValue)}
        >
          <Picker.Item label="Recherche par Artiste" value="musicArtist" />
          <Picker.Item label="Recherche par Track" value="musicTrack" />
        </Picker>
      </View>
      <TextInput
        placeholder="Tappes ta recherche ici"
        onChangeText={handleSearchTextChange}
        defaultValue={searchText}
      />
      <Button title="Rechercher" onPress={() => searchMusic(true)} />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetails(item)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemArtist}>{item.artistName}</Text>
              <Text style={styles.itemTrack}>{item.trackName}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `item-${index}`}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="small" color="#000" style={{ marginVertical: 10 }} />
          ) : (
            hasMoreResults && searchResults.length > 0 && (
              <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                <Text style={styles.loadMoreButtonText}>Afficher plus</Text>
                <Icon name="plus" size={20} style={styles.loadMoreButtonIcon} />
              </TouchableOpacity>
            )
          )
        }
      />
    </View>
  );
};

export default SearchScreen;
