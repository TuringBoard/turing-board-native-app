import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Alert, Platform, ScrollView } from 'react-native';
import Backdrop from "./backdrops/Backdrop";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import RNSpeedometer from 'react-native-speedometer';
import CustomButtons from "../components/CustomButtons";
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { getDatabase, ref, set } from 'firebase/database';
import { useAuth } from "../store/auth-context";

const db = getDatabase();
let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;
export default function Throttle() {
    const [value, setValue] = useState(0);
    const [maxSpeed, setMaxSpeed] = useState(5);
    const { uid } = useAuth();
    let date = new Date()
    let [fontsLoaded] = useFonts({
        'Avenir-Book': require('../assets/fonts/AvenirBook.otf')
    });

    const changeModeHandler = (maxSpeedVal) => {
        Alert.alert(
            "Confirm Speed Mode",
            'Are you sure you want to change max speed to ' + maxSpeedVal + ' mph?',
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    onPress: () => { setMaxSpeed(maxSpeedVal) },
                }
            ]
        )
    }
    const labels = [
        {
            name: '',
            labelColor: 'rgba(256,256,256,0)',
            activeBarColor: 'rgba(29, 112, 68, 0.8)'
        },
        {
            name: ' ',
            labelColor: 'rgba(256,256,256,0)',
            activeBarColor: 'rgba(117, 173, 111, 0.8)'
        },
        {
            name: '  ',
            labelColor: 'rgba(256,256,256,0)',
            activeBarColor: 'rgba(255, 190, 0, 0.8)'
        },
        {
            name: '   ',
            labelColor: 'rgba(256,256,256,0)',
            activeBarColor: 'rgba(255, 126, 1, 0.8)'
        },
        {
            name: '    ',
            labelColor: 'rgba(256,256,256,0)',
            activeBarColor: 'rgba(227, 7, 29, 0.8)'
        },
        {
            name: '     ',
            labelColor: 'rgba(256,256,256,0)',
            activeBarColor: 'rgba(201, 20, 20, 0.8)'
        },
    ]
    // useEffect(() => {
    //     set(ref(db, 'users/' + uid), {
    //         speed: value
    //     });
    // }, [value])
    const onThrottleHandler = (e) => {
        set(ref(db, 'users/' + uid), {
            speed: e
        });
        console.log("{'speed': " + e + "} " + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds())
        setValue(e)
    }

    if (!fontsLoaded) {
        return (<AppLoading />)
    } else {
        if (Platform.OS === "ios") {
            return (
                <View>
                    <Backdrop />
                    <View style={styles.container}>
                        <View style={styles.speedometer}>
                            <RNSpeedometer
                                value={value}
                                minValue={0}
                                maxValue={20}
                                allowedDecimals={3}
                                easeDuration={0}
                                size={phoneWidth - 125}
                                labels={labels}
                                labelStyle={{ display: 'none' }}
                            />
                        </View>
                        <View style={styles.odometerView}>
                            <Text style={styles.odometry}>{value < 0 ? "0.00" : value.toFixed(2)} mph</Text>
                            <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Avenir-Book' }}>Odometer</Text>
                            <Text style={{ right: 2, color: 'white', textAlign: 'center', fontFamily: 'Avenir-Book' }}>TRIP: 0.00 mi</Text>
                        </View>
                        <View style={styles.slider}>
                            <MultiSlider
                                containerStyle={styles.slider}
                                trackStyle={phoneHeight > 670 ? { height: 150, } : { height: 120 }}
                                markerStyle={
                                    phoneHeight > 670
                                        ? { backgroundColor: 'white', shadowOpacity: 0, height: 150, width: 50, top: 75, borderRadius: 5 }
                                        : { backgroundColor: 'white', shadowOpacity: 0, height: 120, width: 50, top: 60, borderRadius: 5 }
                                }
                                sliderLength={300}
                                selectedStyle={{ backgroundColor: 'rgba(256,256,256,0.55)', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
                                unselectedStyle={{
                                    backgroundColor: 'rgba(256,256,256,0.25)',
                                    borderTopRightRadius: 10,
                                    borderBottomRightRadius: 10
                                }}
                                min={-5}
                                max={maxSpeed + 0.125}
                                values={[value]}
                                step={0.125}
                                onValuesChange={values => { onThrottleHandler(values[0]) }}
                                onValuesChangeFinish={() => setValue(0)}
                                vertical={true}
                            />
                        </View>
                        <View style={styles.modes}>
                            <CustomButtons title={`CRUISE\n0 - 5 mph`} type="small" name="cruise" onPress={() => changeModeHandler(5)} />
                            <CustomButtons title={`FAST\n0 - 12 mph`} type="small" name="fast" onPress={() => changeModeHandler(12)} />
                            <CustomButtons title={`LUDICROUS\n0 - ⚡️ mph`} type="small" name="ludicrous" onPress={() => changeModeHandler(20)} />
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'Avenir-Book', color: 'white', fontSize: 18, position: "absolute", top: 405, left: -25 }}>Mode</Text>
                        </View>
                    </View>
                </View>
            );
        } else if (Platform.OS === "android") {
            return (
                <View>
                    <Backdrop />
                    <View style={styles.container}>
                        <View style={android.speedometer}>
                            <RNSpeedometer
                                value={value}
                                minValue={0}
                                maxValue={20}
                                allowedDecimals={3}
                                easeDuration={0}
                                size={phoneWidth - 125}
                                labels={labels}
                                labelStyle={{ display: 'none' }}
                            />
                        </View>
                        <View style={android.odometerView}>
                            <Text style={styles.odometry}>{value < 0 ? "0.00" : value.toFixed(2)} mph</Text>
                            <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Avenir-Book' }}>Odometer</Text>
                            <Text style={{ right: 2, color: 'white', textAlign: 'center', fontFamily: 'Avenir-Book' }}>TRIP: 0.00 mi</Text>
                        </View>
                        <View style={android.slider}>
                            <MultiSlider
                                containerStyle={android.slider}
                                trackStyle={{ height: 150 }}
                                markerStyle={{ height: 150, top: 24, width: 50, borderRadius: 5, backgroundColor: 'white' }}
                                pressedMarkerStyle={{ elevation: 3, height: 150, top: 24, width: 50, borderRadius: 5, backgroundColor: 'white' }}
                                markerContainerStyle={{ height: 150 }}
                                selectedStyle={{ backgroundColor: 'rgba(256,256,256,0.55)', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
                                unselectedStyle={{
                                    backgroundColor: 'rgba(256,256,256,0.25)',
                                    borderTopRightRadius: 10,
                                    borderBottomRightRadius: 10
                                }}
                                vertical={true}
                                min={-5}
                                max={maxSpeed + 0.125}
                                values={[value]}
                                step={0.125}
                                onValuesChange={values => { onThrottleHandler(values[0]) }}
                                onValuesChangeFinish={() => setValue(0)}
                            />
                        </View>
                        <View style={android.modes}>
                            <CustomButtons title={`CRUISE\n0 - 5 mph`} type="small" name="cruise" onPress={() => changeModeHandler(5)} />
                            <CustomButtons title={`FAST\n0 - 12 mph`} type="small" name="fast" onPress={() => changeModeHandler(12)} />
                            <CustomButtons title={`LUDICROUS\n0 - ⚡️ mph`} type="small" name="ludicrous" onPress={() => changeModeHandler(20)} />
                        </View>
                        <View>
                            <Text style={{ fontFamily: 'Avenir-Book', color: 'white', fontSize: 18, position: "absolute", top: phoneHeight > 680 ? 405 : 305, left: -25 }}>Mode</Text>
                        </View>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    speedometer: {
        width: phoneWidth,
        top: phoneHeight > 670 ? 100 : 45
    },
    odometerView: {
        top: phoneHeight > 670 ? 100 : 45
    },
    odometry: {
        color: 'white',
        fontFamily: 'Avenir-Book',
        fontSize: 33,
    },
    slider: {
        flex: 1,
        top: phoneHeight > 670 ? 130 : 90,
        alignContent: 'center',
        justifyContent: 'center'
    },
    modes: {
        flex: 1,
        flexDirection: 'row',
        top: phoneHeight > 670 ? 720 : 590,
        justifyContent: "space-between",
        width: phoneWidth * 0.9,
        position: "absolute",
        left: -20
    }
});

const android = StyleSheet.create({
    speedometer: {
        width: phoneWidth,
        position: "relative",
        top: phoneHeight > 680 ? 100 : 40,
    },
    slider: {
        flex: 1,
        top: phoneHeight > 680 ? 130 : 90,
        alignContent: 'center',
        justifyContent: 'center',
    },
    odometerView: {
        top: phoneHeight > 680 ? 100 : 45
    },
    modes: {
        flex: 1,
        flexDirection: 'row',
        top: phoneHeight > 680 ? 720 : 590,
        justifyContent: "space-between",
        width: phoneWidth * 0.9,
        position: "absolute",
        left: -20
    }
});