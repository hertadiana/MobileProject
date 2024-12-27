// In App.js in a new project

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AddEarning from './components/Earnings/AddEarning';
import Earnings from './components/Earnings/EarningsScreen';
function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity>
        <Text onPress={() => {
          navigation.navigate('Earnings', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      >
        Earnings
      </Text>
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Earnings" component={Earnings}/>
        <Stack.Screen name="AddEarning" component={AddEarning}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;