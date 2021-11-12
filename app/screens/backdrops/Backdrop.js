import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Image, StyleSheet } from 'react-native';

export default function Backdrop(props) {
    return (
        // <LinearGradient colors={['rgba(184, 120, 52, 1)', 'rgba(0, 212, 240, 1)']}
        //     start={{ x: 0, y: 1 }}
        //     end={{ x: 1, y: 0 }}
        //     locations={[0, 1]}
        //     style={{
        //         width: Dimensions.get('window').width,
        //         height: Dimensions.get('window').height,
        //         zIndex: -1
        //     }}>
        // </LinearGradient >
        <Image source={require('../../assets/bg8.png')} style={styles.bg}
        />
    );
}

const styles = StyleSheet.create({
    bg: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: -1
    }
})
