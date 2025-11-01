import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useState, useEffect,memo } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProductSearch } from '../api/ProductApi';

const RECENT_SEARCHES_KEY = '@recent_searches';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState([]);
  // const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const popular = [
    'Electronics',
    'Fashion',
    'Beauty',
    'Sports',
    'Books',
    'Toys',
  ];

  // Load recent searches from AsyncStorage on component mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        setRecent(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // Save recent searches to AsyncStorage
  const saveRecentSearches = async searches => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  // Perform search when user presses enter
  const handleSearch = async (text = query) => {
    const searchText = text.trim();

    if (!searchText) return;

    try {
      setIsLoading(true);

      // Add to recent searches if not already present
      let updatedRecent = [...recent];
      if (!recent.includes(searchText)) {
        updatedRecent = [searchText, ...recent.slice(0, 9)]; // Keep max 10 recent searches
        setRecent(updatedRecent);
        setQuery('');
        await saveRecentSearches(updatedRecent);
      }

      // Perform the actual search
      const searchProduct = await fetchProductSearch(searchText);
      // Navigate to results screen with search data
      navigation.navigate('SearchResult', {
        query: searchText,
        results: searchProduct,
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove individual search item
  const removeItem = async item => {
    const updatedRecent = recent.filter(r => r !== item);
    setRecent(updatedRecent);
    await saveRecentSearches(updatedRecent);
  };

  // Clear all recent searches
  const clearAll = async () => {
    setRecent([]);
    await saveRecentSearches([]);
  };

  // Clear search input
  const clearQuery = () => setQuery('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products..."
            placeholderTextColor="#999"
            style={styles.input}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
            editable={!isLoading}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearQuery}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {/* Recent Searches */}
      {recent.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.title}>Recent Searches</Text>
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clear}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recent}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentItem}
                onPress={() => handleSearch(item)}
              >
                <Ionicons name="time-outline" size={18} color="#666" />
                <Text style={styles.recentText}>{item}</Text>
                <TouchableOpacity onPress={() => removeItem(item)}>
                  <Ionicons name="close" size={18} color="#999" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Popular Searches */}
      <View style={styles.section}>
        <Text style={styles.title}>Popular Searches</Text>
        <View style={styles.chipContainer}>
          {popular.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.chip}
              onPress={() => handleSearch(item)}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default memo(SearchScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
  },
  input: { flex: 1, color: '#000', fontSize: 16, marginLeft: 6 },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#000' },
  clear: { color: '#FF3B30', fontSize: 14, fontWeight: '600' },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentText: { flex: 1, fontSize: 16, color: '#333', marginLeft: 10 },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  chip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipText: { fontSize: 14, color: '#333' },
});
