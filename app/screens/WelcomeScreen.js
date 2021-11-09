import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, TextInput, Button, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Backdrop from './backdrops/Backdrop';
import Login from './Login';
import Signup from './Signup';

import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../store/auth-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;



export default function WelcomeScreen(props) {
    const [authAction, setAuthAction] = useState("signup");
    const { dummyLogin } = useAuth();
    const navigate = useNavigation();
    const setActionHelper = () => {
        if (authAction === "login") {
            setAuthAction("signup")
        } else {
            setAuthAction("login")
        }
    }

    const nav = () => {
        dummyLogin()
    }
    return (
        <KeyboardAwareScrollView
            behavior="padding"
            resetScrollToCoords={{ x: 0, y: 0 }}
            scrollEnabled={false}
            style={{ width: phoneWidth, height: phoneHeight }}
        >
            <Backdrop />
            <View style={styles.container}>
                <Image source={require('../assets/logov2.png')} style={styles.logo}
                />
                {authAction === "login"
                    ? <Login loginMode={setActionHelper} />
                    : <Signup loginMode={setActionHelper} />
                }
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    logo: {
        width: 150,
        height: 150,
        left: (phoneWidth / 2) - 75,
        top: phoneHeight > 670 ? 100 : 30,
    },
})