import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, View, Text, Platform } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import CustomButtons from '../components/CustomButtons';
import Backdrop from './backdrops/Backdrop';
import { useNavigation } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { useAuth } from '../store/auth-context';
import * as Location from 'expo-location';

const db = getFirestore();

let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;

export default function Dashboard(props) {
    const { uid } = useAuth()
    const [firstName, setFirstName] = useState("Friend");
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);

    const [mapRegion, setmapRegion] = useState({
        latitude: 32.730588,
        longitude: -97.113983,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
    });

    let [fontsLoaded] = useFonts({
        'Avenir-Book': require('../assets/fonts/AvenirBook.otf')
    });
    const onWarningHandler = () => {
        alert('This feature is currently under construction.');
    };

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            async function getData() {
                const q = query(collection(db, "users"), where("id", "==", uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setFirstName(doc.data().firstName)
                });
            }
            getData();
        }
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
        return () => {
            isMounted = false;
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
            })();
        }
        return () => {
            isMounted = false;
        }
    }, []);

    if (!fontsLoaded) {
        return (<AppLoading />)
    } else {
        if (Platform.OS === "ios") {
            return (
                <View>
                    <Backdrop />
                    <View style={styles.container}>
                        <Image source={require('../assets/logov2.png')} style={styles.logo} />
                        <View style={styles.messageContainer}>
                            <Text style={[styles.message, { fontSize: 25 }]}>Hello, {firstName}!</Text>
                            <Text style={styles.message}>What would you like to do today?</Text>
                            <View style={styles.buttons}>
                                <View style={styles.row}>
                                    <CustomButtons title="PARK" type="big" name="parking" onPress={onWarningHandler}>
                                        <Image source={require('../assets/park.png')} style={styles.pic} />
                                    </CustomButtons>
                                    <CustomButtons title="SUMMON" type="big" onPress={onWarningHandler} coords={location}>
                                    </CustomButtons>
                                </View>
                                <View style={styles.row}>
                                    <CustomButtons title="FOLLOW" type="big" onPress={onWarningHandler}>
                                        <Image source={require('../assets/duck.png')} style={styles.pic} />
                                    </CustomButtons>
                                    <CustomButtons title="RIDE" type="big" onPress={() => navigation.navigate('Throttle')}>
                                        <Image source={require('../assets/skateboard2.png')} style={styles.pic} />
                                    </CustomButtons>
                                </View>
                                <View style={styles.row}>
                                    <CustomButtons title="Manage Settings ⚙️" type="settings" onPress={() => navigation.navigate('Settings')} />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
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
        top: phoneHeight > 670 ? 70 : 30
    },
    messageContainer: {
        position: 'absolute',
        width: phoneWidth,
        top: phoneHeight > 670 ? 190 : 140
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
        top: 45,
        left: 25
    },
    skatePic: {
        width: 85,
        height: 85,
        top: 29,
        left: 29,
        borderBottomRightRadius: 10
    }
})