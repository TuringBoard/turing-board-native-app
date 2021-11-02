import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions } from 'react-native';

export default function Backdrop(props) {
    return (
        <LinearGradient colors={['rgba(184, 120, 52, 1)', 'rgba(0, 212, 240, 1)']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            locations={[0, 1]}
            style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
                zIndex: -1
            }}>
        </LinearGradient >
    );
}
