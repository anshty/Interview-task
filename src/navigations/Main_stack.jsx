import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'
import SearchScreen from '../screens/SearchScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import SearchResult from '../screens/SearchResult';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const Main_stack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Splash'>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="SearchResult" component={SearchResult} />
      <Stack.Screen name="Favorite" component={FavoriteScreen} />
      <Stack.Screen name="Product" component={ProductDetailScreen} />
    </Stack.Navigator>
  )
}

export default Main_stack
