import React from 'react';
import { Dimensions, Image, StyleSheet, View, ScrollView, Text, Platform } from 'react-native';
import CustomButtons from '../components/CustomButtons';
import Backdrop from './backdrops/Backdrop';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

let phoneWidth = Dimensions.get('window').width;

export default function Dashboard() {
    const navigation = useNavigation();
    let [fontsLoaded] = useFonts({
        'Avenir-Book': require('../assets/fonts/AvenirBook.otf')
    });
    const onWarningHandler = () => {
        alert('This feature is currently under construction. 🛠');
    };
    if (!fontsLoaded) {
        return (<AppLoading />)
    } else {
        if (Platform.OS === "ios") {
            return (
                <ScrollView>
                    <Backdrop />
                    <View style={styles.container}>
                        <Image source={require('../assets/logov2.png')} style={styles.logo} />
                        <View style={styles.messageContainer}>
                            <Text style={[styles.message, { fontSize: 25 }]}>Hello, Sahaj!</Text>
                            <Text style={styles.message}>What would you like to do today?</Text>
                            <View style={styles.buttons}>
                                <View style={styles.row}>
                                    <CustomButtons title="PARK" type="big" name="parking" onPress={onWarningHandler}>
                                        <Image source={require('../assets/park.png')} style={styles.pic} />
                                    </CustomButtons>
                                    <CustomButtons title="SUMMON" type="big" onPress={onWarningHandler}>
                                        <Image source={require('../assets/bell2.png')} style={styles.pic} />
                                    </CustomButtons>
                                </View>
                                <View style={styles.row}>
                                    <CustomButtons title="FOLLOW" type="big" onPress={onWarningHandler}>
                                        <Image source={require('../assets/duck.png')} style={styles.pic} />
                                    </CustomButtons>
                                    <CustomButtons title="RIDE" type="big" onPress={() => navigation.navigate('Throttle')}>
                                        <Image source={require('../assets/skateboard.png')} style={styles.pic} />
                                    </CustomButtons>
                                </View>
                                <View style={styles.row}>
                                    <CustomButtons title="Manage Settings ⚙️" type="settings" />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            );
        } else if (Platform.OS === "android") {
            return (
                <View>
                    <Backdrop />
                    <View style={styles.container}>
                        <Image source={require('../assets/logov2.png')} style={styles.logo} />
                        <View style={styles.messageContainer}>
                            <Text style={[styles.message, { fontSize: 25 }]}>Hello, Sahaj!</Text>
                            <Text style={styles.message}>What would you like to do today?</Text>
                            <View style={styles.buttons}>
                                <View style={styles.row}>
                                    <CustomButtons title="PARK" type="big" name="parking" onPress={onWarningHandler}>
                                        <Image source={require('../assets/park.png')} style={android.pic} />
                                    </CustomButtons>
                                    <CustomButtons title="SUMMON" type="big" onPress={onWarningHandler}>
                                        <Image source={require('../assets/bell2.png')} style={android.pic} />
                                    </CustomButtons>
                                </View>
                                <View style={styles.row}>
                                    <CustomButtons title="FOLLOW" type="big" onPress={onWarningHandler}>
                                        <Image source={require('../assets/duck.png')} style={android.pic} />
                                    </CustomButtons>
                                    <CustomButtons title="RIDE" type="big" onPress={() => navigation.navigate('Throttle')}>
                                        <Image source={require('../assets/skateboard.png')} style={android.pic} />
                                    </CustomButtons>
                                </View>
                                <View style={styles.row}>
                                    <CustomButtons title="Manage Settings ⚙️" type="settings" />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const android = StyleSheet.create({
    pic: {
        width: 55,
        height: 55,
        top: 15,
        left: 35
    }
})

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
    logo: {
        width: 100,
        height: 100,
        left: (phoneWidth / 2) - 50,
        top: 70,
    },
    messageContainer: {
        position: 'absolute',
        width: phoneWidth,
        top: 190,
    },
    message: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Avenir-Book',
        fontSize: 18
    },
    buttons: {
        top: 20,
        flex: 1,
        flexDirection: 'column'
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    pic: {
        width: 55,
        height: 55,
        top: 15,
        left: 25
    }
})