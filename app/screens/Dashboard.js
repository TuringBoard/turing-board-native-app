import React from 'react';
import { Dimensions, Image, StyleSheet, View, Text } from 'react-native';
import Backdrop from './backdrops/Backdrop';

let phoneWidth = Dimensions.get('window').width;

export default function Dashboard() {
    return (
        <View>
            <Backdrop />
            <View style={styles.container}>
                <Image source={require('../assets/logov2.png')} style={styles.logo} />
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