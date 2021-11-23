import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'

import WelcomeScreen from './app/screens/WelcomeScreen';
import Dashboard from './app/screens/Dashboard';
import Throttle from './app/screens/Throttle';
import Settings from './app/screens/Settings';

import { useAuth } from './app/store/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Test from './app/screens/Test';
import ThrottleLeft from './app/screens/ThrottleLeft';

export default function Stacks() {
    const Stack = createStackNavigator();
    const { isLoggedIn, currentUser, dominantHand } = useAuth();
    const [storageLogin, setStorageLogin] = useState();

    useEffect(async () => {
        let isMounted = true;
        if (isMounted) {
            setStorageLogin(await AsyncStorage.getItem('isLoggedIn'))
        }
        return () => {
            isMounted = false;
        }
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                {!isLoggedIn || currentUser === null ?
                    <>
                        <Stack.Screen name="Welcome Screen" component={WelcomeScreen} />
                    </>
                    :
                    <>
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="Test" component={Test} />
                        <Stack.Screen name="Throttle" component={dominantHand === "left" ? ThrottleLeft : Throttle} />
                        <Stack.Screen name="Settings" component={Settings} />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer >
    );
}

