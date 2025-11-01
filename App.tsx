import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import Main_stack from './src/navigations/Main_stack';
import { StatusBar } from 'react-native';

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle={'dark-content'} />
      <Main_stack />
    </NavigationContainer>
  );
};

export default App;
