import React from 'react';
import { StyleSheet, Dimensions, Text, View, Image, TextInput, Button } from 'react-native';
import Backdrop from './backdrops/Backdrop';
import Login from './Login';

let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;

export default function WelcomeScreen() {
    return (
        <View>
            <Backdrop />
            <View style={styles.container}>
                <Image source={require('../assets/logov2.png')} style={styles.logo} />
                <Login />
            </View>
        </View>
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