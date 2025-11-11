import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from '../screens/MenuScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameScreen from '../screens/GameScreen';
import MusicInitializer from '../components/MusicInitializer';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <MusicInitializer >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MenuScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0a0404',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShown: false, 
          }}
        >
          <Stack.Screen 
            name="MenuScreen" 
            component={MenuScreen}
            options={{ title: 'MenuScreen' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MusicInitializer>
  );
};

export default AppNavigator;