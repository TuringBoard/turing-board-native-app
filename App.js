import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

import WelcomeScreen from './app/screens/WelcomeScreen';
import Dashboard from './app/screens/Dashboard';
import Throttle from './app/screens/Throttle';

import { AuthContextProvider } from './app/store/auth-context';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome Screen" component={WelcomeScreen}
            options={{
              title: 'Welcome',
              headerShown: false,
              headerTransparent: true
            }} />
          <Stack.Screen name="Dashboard" component={Dashboard}
            options={{
              title: 'Dashboard',
              headerShown: false
            }}
          />
          <Stack.Screen name="Throttle" component={Throttle}
            options={{
              title: 'Throttle',
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
