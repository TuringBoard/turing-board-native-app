import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

import WelcomeScreen from './app/screens/WelcomeScreen';
import Dashboard from './app/screens/Dashboard';
import Throttle from './app/screens/Throttle';
import Settings from './app/screens/Settings';

import { useAuth } from './app/store/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Stacks() {
    const Stack = createStackNavigator();
    const { isLoggedIn } = useAuth();
    const [storageLogin, setStorageLogin] = useState();

    useEffect(async () => {
        setStorageLogin(await AsyncStorage.getItem('isLoggedIn'))
    }, [isLoggedIn])

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {!isLoggedIn && storageLogin !== 'true' ?
                    <>
                        <Stack.Screen name="Welcome Screen" component={WelcomeScreen} />
                    </>
                    :
                    <>
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="Throttle" component={Throttle} />
                        <Stack.Screen name="Settings" component={Settings} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer >
    );
}

