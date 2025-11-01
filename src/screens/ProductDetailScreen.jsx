import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, memo } from 'react';
import { fetchProductDetail } from '../api/ProductApi';
import Carousal from '../components/Carousal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Rating } from 'react-native-ratings';
import ReviewCard from '../components/ReviewCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailScreen = ({ route, navigation }) => {
  const id = route.params;
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFavourite, setFavourite] = useState(false);

  useEffect(() => {
    getProductDetail(id);
    checkIfFavourite(id);
  }, [id]);

  const getProductDetail = async productID => {
    setLoading(true);
    try {
      const productDetail = await fetchProductDetail(productID);
      if (productDetail) {
        setProductData(productDetail);
      }
    } catch (error) {
      console.log('Error fetching product detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if item is already in favourites
  const checkIfFavourite = async itemID => {
    try {
      const token = await AsyncStorage.getItem('favourite');
      if (token !== null) {
        const res = JSON.parse(token);
        const item_Data = res.find(val => val === itemID);
        setFavourite(item_Data != null);
      } else {
        setFavourite(false);
      }
    } catch (error) {
      console.log('Error checking favourite:', error);
    }
  };

  // Add item to favourites
  const saveItem = async itemID => {
    try {
      const token = await AsyncStorage.getItem('favourite');
      const res = token ? JSON.parse(token) : [];

      const data = res.find(val => val === itemID);
      if (data == null) {
        res.push(itemID);
        await AsyncStorage.setItem('favourite', JSON.stringify(res));
        setFavourite(true);
        alert('Product added to wishlist!');
      }
    } catch (error) {
      console.log('Error saving item:', error);
    }
  };

  // Remove item from favourites
  const removeItem = async itemID => {
    try {
      const token = await AsyncStorage.getItem('favourite');
      if (token !== null) {
        const res = JSON.parse(token);
        const itemMark = res.filter(id => id !== itemID);
        await AsyncStorage.setItem('favourite', JSON.stringify(itemMark));
        setFavourite(false);
        alert('Product removed from wishlist');
      }
    } catch (error) {
      console.log('Error removing item:', error);
    }
  };

  const reviews = productData.reviews || [];

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Product Detail</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
          onPress={()=>{
            navigation.navigate('Search')
          }}>
            <Ionicons name="search" color="#000" size={28} />
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={()=>{
            navigation.navigate('Favorite')
          }}>
            <Ionicons 
              name="heart-outline"
              color= "#000" 
              size={28} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Single FlatList for all content */}
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ReviewCard reviewData={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Carousel */}
            {productData.images && productData.images.length > 0 && (
              <Carousal images={productData.images} />
            )}

            {/* Product Details */}
            <View style={styles.detailContainer}>
              <Text style={styles.title}>{productData.title}</Text>
              <Text style={styles.price}>$ {productData.price}</Text>
              <Text style={styles.brand}>Brand: {productData.brand}</Text>
              <Text style={styles.category}>
                Category: {productData.category}
              </Text>
              <Text style={styles.stock}>Stock: {productData.stock}</Text>

              <View style={styles.ratingWapper}>
                <Rating
                  readonly
                  startingValue={productData.rating}
                  imageSize={18}
                  ratingColor="#FFD700"
                />
                <Text style={styles.rating}>{productData.rating} / 5</Text>
              </View>

              <Text style={styles.description}>{productData.description}</Text>
              <Text style={styles.reviewTitle}>Customer Reviews</Text>
            </View>
          </>
        }
        ListFooterComponent={
          <TouchableOpacity
            style={[
              styles.addToWishList,
              isFavourite && styles.addToWishListActive,
            ]}
            onPress={() => (isFavourite ? removeItem(id) : saveItem(id))}
          >
           
            <Text style={styles.wishList_text}>
              {isFavourite ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Text>
          </TouchableOpacity>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  detailContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
  },
  brand: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  stock: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  ratingWapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rating: {
    fontSize: 18,
    color: '#FFA500',
    marginBottom: 1,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 30,
  },
  addToWishList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#2196F3',
    padding: 15,
    marginHorizontal: 30,
    borderRadius: 10,
  },
  addToWishListActive: {
    backgroundColor: '#e91e63',
  },
  wishList_text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
});

export default memo(ProductDetailScreen);