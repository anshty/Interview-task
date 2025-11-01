import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Rating } from 'react-native-ratings';
import { useNavigation } from '@react-navigation/native';

const Card = ({id,thumbnail,price,discountPercentage,title,rating}) => {
 const navigation=useNavigation()

  const getOriginalPrice = (discountedPrice, discount_Percentage) => {
    if (!discountedPrice || !discount_Percentage) return 0;
    const realPrice = discountedPrice / (1 - discount_Percentage / 100);
    return Math.round(realPrice);
  };

  return (
    <TouchableOpacity style={styles.card_style} activeOpacity={0.8}
    onPress={()=>{navigation.navigate('Product',id)}}>
      {/* image and add favorite */}
      <View style={styles.image_container}>
        <Image
          source={{
            uri: thumbnail,
          }}
          width={200}
          height={200}
        />
        
      </View>
      {/* text  */}
      <View style={styles.bottomDetails}>
        <Text style={styles.titleText}>
          {title?.length > 18 ? title.slice(0, 18) + '...' : title}
        </Text>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:10}}>
          <Text style={styles.real_price}>
            ${getOriginalPrice(price, discountPercentage)}
          </Text>
          <Rating
            readonly
            startingValue={rating}
            imageSize={18}
            tintColor="#CED4DA" // matches your card bg
            ratingColor="#FFD700"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}
        >
          <View>
            <Text style={styles.discount_price}>${price} </Text>
          </View>
          <View style={styles.dicount_per}>
            <Text style={styles.discountText}>{discountPercentage}% OFF </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card_style: {
    backgroundColor: '#CED4DA',
    width: '200',
    height: '250',
    margin: 10,
    alignItems: 'center',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    marginBottom: 50,
  },
  image_container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
 
  bottomDetails: {
    width: '200',
    height: '80',
    backgroundColor: '#CED4DA',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.3,
    marginBottom: 6,
    left: 10,
  },
  real_price: {
    fontSize: 15,
    color: '#777',
    textDecorationLine: 'line-through',
    fontWeight: '500',
    
  },
  discount_price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  dicount_per: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  discountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});
export default Card;
