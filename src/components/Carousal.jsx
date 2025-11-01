import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

const { width } = Dimensions.get('window');

const Carousal = ({ images = [] }) => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Convert array of image URLs into structured objects for uniformity
    if (Array.isArray(images) && images.length > 0) {
      const formattedData = images.map((url, index) => ({
        id: index + 1,
        url,
      }));
      setData(formattedData);
    }
  }, [images]);

  const onScroll = event => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  const renderThumbnail = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        flatListRef.current.scrollToIndex({ index, animated: false });
        setActiveIndex(index);
      }}
    >
      <Image
        source={{ uri: item.url }}
        style={[
          styles.thumbnail,
          activeIndex === index && styles.activeThumbnail,
        ]}
      />
    </TouchableOpacity>
  );

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Main Carousel */}
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        
      />

      {/* Image Thumbnails */}
      <View style={styles.thumbnailContainer}>
        <FlatList
          data={data}
          horizontal
          renderItem={renderThumbnail}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.thumbnailList}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Carousal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width,
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: 350,
    resizeMode: 'cover',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  thumbnailList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginHorizontal: 5,
    opacity: 0.6,
  },
  activeThumbnail: {
    borderWidth: 3,
    borderColor: '#055485ff',
    opacity: 1,
  },
});
