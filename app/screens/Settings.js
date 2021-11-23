import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import CustomButtons from '../components/CustomButtons';
import Backdrop from './backdrops/Backdrop';
import { useAuth } from '../store/auth-context';
export default function Settings() {
    const { logout, toggleHand, dominantHand } = useAuth();
    const [revDomHand, setRevDomHand] = useState();

    useEffect(() => {
        if (dominantHand === "right") {
            setRevDomHand("left")
        } else {
            setRevDomHand("right")
        }
    }, [])

    const onLogoutHandler = () => {
        logout()
    }

    const onToggleHandHandler = () => {
        Alert.alert(
            `Your current dominant hand is set to ${dominantHand.toUpperCase()}`,
            `Are you sure you want to toggle to ${revDomHand.toUpperCase()}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Yes, I'm sure",
                    onPress: toggleHand,
                }
            ]
        )
    }
    return (
        <View>
            <Backdrop />
            <View style={styles.container}>
                <View>
                    <CustomButtons type="settings" title="Toggle Dominant Hand" onPress={onToggleHandHandler} />
                </View>
                <View>
                    <CustomButtons type="settings" title="LOGOUT" onPress={onLogoutHandler} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
    },
})