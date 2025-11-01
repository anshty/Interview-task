import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React from 'react';

const ProductList = ({ 
  data, 
  renderitem, 
  header, 
  refreshing, 
  handleRefresh,
  onEndReached,
  onEndReachedThreshold,
  loadingMore
}) => {
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#e91e63" />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderitem}
       keyExtractor={(item, index) => `${item.id}-${index}`}
      // keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      ListHeaderComponent={header}
      ListFooterComponent={renderFooter}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        paddingHorizontal: 1,
      }}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
    />
  );
};

export default ProductList;