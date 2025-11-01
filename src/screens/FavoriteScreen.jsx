import React, { useState } from 'react';
import { View, Text,TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProductDetail } from '../api/ProductApi';
import ProductList from '../components/ProductList';
import Card from '../components/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FavoriteScreen = ({navigation}) => {
  const [favouriteProducts, setFavouriteProducts] = useState([]);

  const loadFavourites = React.useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('favourite');
      const ids = stored ? JSON.parse(stored) : [];

      if (ids.length === 0) {
        console.log('No favourites found');
        setFavouriteProducts([]);
        return;
      }

      const results = await Promise.all(
        ids.map(async (id) => {
          const product = await fetchProductDetail(id);
          return product || null;
        })
      );

      const validProducts = results.filter((p) => p !== null);
      setFavouriteProducts(validProducts);

      console.log('Favourite Products:', validProducts);
    } catch (error) {
      console.log('Error loading favourite products:', error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavourites();
    }, [loadFavourites])
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
      <Text style={styles.headerText}>
        Favourite Products
      </Text>
      </SafeAreaView>

     
      <ProductList
        data={favouriteProducts}        
        renderitem={({ item }) => <Card {...item} />}  
      />
    </View>
  );
};

export default FavoriteScreen;
const styles=StyleSheet.create({
header:{
  flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
},
headerText:{
   fontWeight: 'bold',
    fontSize: 20,
}
})