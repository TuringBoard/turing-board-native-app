import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButtons from '../components/CustomButtons';
import Backdrop from './backdrops/Backdrop';
import { useAuth } from '../store/auth-context';
export default function Settings() {
    const { logout } = useAuth();
    const onLogoutHandler = () => {
        logout()
    }
    return (
        <View>
            <Backdrop />
            <View style={styles.container}>
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