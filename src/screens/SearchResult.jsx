import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React,{memo} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductList from '../components/ProductList';
import Card from '../components/Card';

const SearchResult = ({ route, navigation }) => {
  const { query = '', results = {} } = route.params || {};

  console.log('Search query:', query);
  console.log('Data result product:', results.products);
  console.log('Products length:', results.products?.length);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{query}</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="heart-outline" color="#000" size={28} />
        </TouchableOpacity>
      </View>

      {/* Show loading or empty state if needed */}
      {!results.products || results.products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found for "{query}"</Text>
        </View>
      ) : (
        <ProductList
          data={results.products}
          renderitem={({ item }) => <Card {...item} />}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(SearchResult);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 10,
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
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
