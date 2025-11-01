import { View, FlatList, StyleSheet, Text } from 'react-native';
import React from 'react';
import ReviewCard from './ReviewCard';

const Reviews = ({ reviews = [],header }) => {
    // console.log('review data here',reviews)
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Customer Reviews</Text> */}

      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ReviewCard reviewData={item} />}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={header}
          
        />
      ) : (
        <Text style={styles.noReviews}>No reviews yet.</Text>
      )}
    </View>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
    
    
  },
  noReviews: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
});
