import React from 'react';
// Importation des différentes vues de l'application
import SearchScreen from './views/SearchScreen';
import HomeScreen from './views/HomeScreen';
import DetailsScreen from './views/DetailsScreen';
import FavoriteScreen from './views/FavoriteScreen';
// Importation de NavigationContainer, un composant qui gère l'état de navigation 
// et du module pour créer une pile de navigation (stack) pour la navigation native
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Création d'une nouvelle pile de navigation
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // Début de la pile de navigation
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{title: 'Welcome'}} />
        <Stack.Screen
        name="Search"
        component={SearchScreen} />
        <Stack.Screen
        name="Details"
        component={DetailsScreen}/>
        <Stack.Screen
        name="Favorites"
        component={FavoriteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
