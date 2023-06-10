import React from 'react';
import { TouchableHighlight, StyleSheet, Text, View, Button, TouchableOpacity, ViewPropTypes } from 'react-native';
import FavoriteReactSvg from '../assets/favoriteReactSvg';
import MusicNotesSvg from '../assets/musicNotesvg';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  buttonGoToSearch: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FA7F72',
    backgroundColor: '#FFBFCB',
  },
  buttonGoToSearchText: {
    fontSize: 20,
    color: '#000'
  },
  textBienvenue: {
    fontSize: 20,
  },
  favoriteSvg: {
    width: 100,
    marginBottom: 60,
  },
  favoriteContainer : {
    flexDirection: 'row',
  },
  musicSvg: {
    width: 200,
    height: 200,
  }
});

const HomeScreen = ({ navigation, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.textBienvenue}>Welcome to ItunesSeeker</Text>
      <View style={styles.favoriteContainer}>
        <TouchableOpacity
          title="Mes favoris"
          onPress={() => navigation.navigate('Favorites')}
        >
          <Text>Go to mes favoris</Text>
        </TouchableOpacity>
        <FavoriteReactSvg />
      </View>
      <Text style={styles.textBienvenue}>Recherche tes artistes et ta musique !</Text>
      <View style={styles.musicSvg}>
        <MusicNotesSvg />
      </View>

      <TouchableHighlight
        style={styles.buttonGoToSearch}
        underlayColor='#FFD4CC'
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.buttonGoToSearchText}>Go to Search</Text>
      </TouchableHighlight>
    </View>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  style: ViewPropTypes.style,
};

export default HomeScreen;
