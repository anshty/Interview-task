import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/image.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.appName}>Meesho</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  appName: {
    position: 'absolute',
    bottom: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e91e63', 
  },
});

export default SplashScreen;
