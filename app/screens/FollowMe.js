import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import Backdrop from './backdrops/Backdrop';
import { useAuth } from '../store/auth-context';
import { getDatabase, ref, set } from 'firebase/database';

let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;

const db = getDatabase();
export default function FollowMe() {
    const { uid } = useAuth();
    useEffect(() => {
        set(ref(db, 'users/' + uid), {
            speed: 0,
            mode: 2,
            autonomous: true
        });

        return () => {
            set(ref(db, 'users/' + uid), {
                speed: 0,
                mode: 1,
                autonomous: false
            });
        }
    }, [])

    return (
        <View>
            <Backdrop />
            <View style={styles.container}>
                <Image source={require('../assets/logov2.png')} style={styles.logo}
                />
                <Text style={styles.textStyles}>Device is set to follow you.
                    {"\n\n"}Please face away from the board and begin journey.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
    },
    textStyles: {
        width: '60%',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Avenir-Book',
        fontSize: 18,
        top: 150,
        left: (phoneWidth / 2) - 130,
    },
    logo: {
        width: 150,
        height: 150,
        left: (phoneWidth / 2) - 75,
        top: phoneHeight > 680 ? 100 : 30,
    },
})