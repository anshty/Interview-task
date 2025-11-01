import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Rating } from 'react-native-ratings';


const {width}=Dimensions.get('screen')
const ReviewCard = ({reviewData}) => {
//   const reviewData = {
//     comment: 'Excellent quality!',
//     date: '2025-04-30T09:41:02.053Z',
//     rating: 4,
//     reviewerEmail: 'aaliyah.hanson@x.dummyjson.com',
//     reviewerName: 'Aaliyah Hanson',
//   };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{reviewData.reviewerName}</Text>
        <Text style={styles.date}>
          {new Date(reviewData.date).toLocaleDateString()}
        </Text>
      </View>

      {/* Star Rating */}
      <View style={styles.ratingContainer}>
        <Rating
          readonly
          startingValue={reviewData.rating}
          imageSize={18}
          ratingColor="#FFD700"
        />
        <Text style={styles.ratingText}>{reviewData.rating}/5</Text>
      </View>

      <Text style={styles.comment}>{reviewData.comment}</Text>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    width:width/1.5,
    marginHorizontal:10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  comment: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
});
