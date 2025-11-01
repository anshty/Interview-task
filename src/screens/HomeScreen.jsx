/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';
import ProductList from '../components/ProductList';
import { fetchAllProduct, fetchProductCategories } from '../api/ProductApi';

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [allProduct, setAllproduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerType, setDrawerType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentSkip, setCurrentSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const LIMIT = 10; 
  useEffect(() => {
    getAllProduct(true); 
    getProductCategory();
  }, []);

  const getAllProduct = async (isInitial = false, limit = LIMIT) => {
    if (isInitial) {
      setCurrentSkip(0);
      setHasMore(true);
    }

    const skip = isInitial ? 0 : currentSkip;
    const Products = await fetchAllProduct(limit, skip);
    
    if (Products?.products) {
      if (isInitial) {
        setAllproduct(Products.products);
      } else {
        setAllproduct(prev => [...prev, ...Products.products]);
      }
      
      setFilteredProducts([]);
      setCurrentSkip(skip + limit);
      
      // Check if there are more items to load
      if (Products.products.length < limit || Products.total <= skip + limit) {
        setHasMore(false);
      }
    }
  };

  const getProductCategory = async () => {
    const categoriesData = await fetchProductCategories();
    if (categoriesData) {
      setCategories(categoriesData);
    }
  };

  const fetchProductsByCategory = async categoryUrl => {
    try {
      setCurrentSkip(0);
      setHasMore(false); // Disable pagination for category view
      const response = await fetch(categoryUrl);
      const data = await response.json();
      if (data?.products) {
        setAllproduct(data.products);
        setSelectedCategory(categoryUrl);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.log('Error fetching category products:', error);
    }
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMore || filteredProducts.length > 0 || selectedCategory) {
      return; 
    }

    setLoadingMore(true);
    await getAllProduct(false);
    setLoadingMore(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getAllProduct(true);
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const openDrawer = type => {
    setDrawerType(type);
    setModalVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const renderDrawerContent = () => {
    switch (drawerType) {
      case 'sort':
        return (
          <>
            <Text style={styles.drawerTitle}>Sort By</Text>
            <TouchableOpacity
              style={styles.drawerOption}
              onPress={() => {
                closeDrawer();
                const data = filteredProducts.length ? filteredProducts : allProduct;
                const sorted = [...data].sort((a, b) => a.price - b.price);
                if (filteredProducts.length) {
                  setFilteredProducts(sorted);
                } else {
                  setAllproduct(sorted);
                }
              }}
            >
              <Text style={styles.drawerOptionText}>Price: Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerOption}
              onPress={() => {
                closeDrawer();
                const data = filteredProducts.length ? filteredProducts : allProduct;
                const sorted = [...data].sort((a, b) => b.price - a.price);
                if (filteredProducts.length) {
                  setFilteredProducts(sorted);
                } else {
                  setAllproduct(sorted);
                }
              }}
            >
              <Text style={styles.drawerOptionText}>Price: High to Low</Text>
            </TouchableOpacity>
          </>
        );
      case 'categories':
        return (
          <>
            <Text style={styles.drawerTitle}>Categories</Text>
            <TouchableOpacity
              style={[
                styles.drawerOption,
                !selectedCategory && styles.selectedOption,
              ]}
              onPress={() => {
                getAllProduct(true);
                setSelectedCategory(null);
                closeDrawer();
              }}
            >
              <Text
                style={[
                  styles.drawerOptionText,
                  !selectedCategory && styles.selectedText,
                ]}
              >
                All Products
              </Text>
            </TouchableOpacity>

            {categories.length > 0 ? (
              categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.drawerOption,
                    selectedCategory === category.url && styles.selectedOption,
                  ]}
                  onPress={() => {
                    fetchProductsByCategory(category.url);
                    closeDrawer();
                  }}
                >
                  <Text
                    style={[
                      styles.drawerOptionText,
                      selectedCategory === category.url && styles.selectedText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : null}
          </>
        );
      case 'brands':
        return (
          <>
            <Text style={styles.drawerTitle}>Brands</Text>
            {[...new Set(allProduct.map(p => p.brand))].map((brand, index) => (
              <TouchableOpacity
                key={index}
                style={styles.drawerOption}
                onPress={() => {
                  closeDrawer();
                  setSelectedCategory(null);
                  setFilteredProducts(
                    allProduct.filter(i => i.brand === brand),
                  );
                }}
              >
                <Text style={styles.drawerOptionText}>{brand}</Text>
              </TouchableOpacity>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          margin: 10,
          alignItems: 'center',
        }}
      >
        <Text style={styles.header_Title}>Meesho</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('Favorite');
          }}
        >
          <AntDesign name="hearto" color="#000" size={30} />
        </TouchableOpacity>
      </SafeAreaView>
{/* product list flatlist  */}
      <ProductList
        data={filteredProducts.length ? filteredProducts : allProduct}
        renderitem={({ item }) => <Card {...item} />}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        loadingMore={loadingMore}
        header={
          <>
            <TouchableOpacity
              style={styles.search_Style}
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate('Search');
              }}
            >
              <Ionicons
                name="search"
                size={20}
                color="#666"
                style={styles.icon}
              />
              <Text style={styles.placeholderText}>Search products...</Text>
            </TouchableOpacity>

            <View style={styles.filterRow}>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => openDrawer('sort')}
              >
                <Text style={styles.filterText}>Sort</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => openDrawer('categories')}
              >
                <Text style={styles.filterText}>Categories</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => openDrawer('brands')}
              >
                <Text style={styles.filterText}>Brands</Text>
              </TouchableOpacity>
            </View>
          </>
        }
      />

      {/* Bottom Drawer Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.drawerContainer,
                  {
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <View style={styles.drawerHandle} />
                <View style={styles.contentContainer}>
                  {renderDrawerContent()}
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header_Title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#e91e63',
  },
  search_Style: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginVertical: 20,
  },
  filterBtn: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  filterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.4,
    maxHeight: height * 0.8,
  },
  drawerHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  contentContainer: {
    padding: 20,
  },
  drawerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
    color: '#000',
  },
  drawerOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  drawerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default HomeScreen;
