import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Text, View, Image, TextInput, Button, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Backdrop from './backdrops/Backdrop';
import Login from './Login';
import Signup from './Signup';
import SVG from './SVG';

let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;



export default function WelcomeScreen(props) {
    const [authAction, setAuthAction] = useState("signup");
    const setActionHelper = () => {
        if (authAction === "login") {
            setAuthAction("signup")
        } else {
            setAuthAction("login")
        }
    }
    return (
        <ScrollView>
            <KeyboardAwareScrollView
                behavior="padding"
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={false}
                style={{ width: phoneWidth, height: phoneHeight - 250 }}
            >
                <Backdrop />
                <View style={styles.container}>
                    <Image source={require('../assets/logov2.png')} style={styles.logo} />
                    {authAction === "login"
                        ? <Login loginMode={setActionHelper} />
                        : <Signup loginMode={setActionHelper} />
                    }
                </View>
                <Image source={require('../assets/skate.gif')} style={{
                    width: 185,
                    height: 185,
                    position: 'absolute',
                    bottom: 0,
                    right: 0
                }} />
            </KeyboardAwareScrollView>
        </ScrollView>
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
        top: 100,
    },
})