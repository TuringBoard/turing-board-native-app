import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions, Alert } from 'react-native';
import Backdrop from "./backdrops/Backdrop";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import RNSpeedometer from 'react-native-speedometer';
import CustomButtons from "../components/CustomButtons";

let phoneWidth = Dimensions.get('window').width;
const customFonts = {
    'Avenir-Book': require('../assets/fonts/AvenirBook.otf')
}
export default function Throttle() {
    const [value, setValue] = useState(0);
    const [maxSpeed, setMaxSpeed] = useState(5);
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
            labelColor: '',
            activeBarColor: 'rgba(29, 112, 68, 0.8)'
        },
        {
            name: ' ',
            labelColor: '',
            activeBarColor: 'rgba(117, 173, 111, 0.8)'
        },
        {
            name: '  ',
            labelColor: '',
            activeBarColor: 'rgba(255, 190, 0, 0.8)'
        },
        {
            name: '   ',
            labelColor: '',
            activeBarColor: 'rgba(255, 126, 1, 0.8)'
        },
        {
            name: '    ',
            labelColor: '',
            activeBarColor: 'rgba(227, 7, 29, 0.8)'
        },
        {
            name: '     ',
            labelColor: '',
            activeBarColor: 'rgba(201, 20, 20, 0.8)'
        },
    ]

    const onThrottleHandler = (e) => {
        setValue(e)
    }

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
                        trackStyle={{ height: 150 }}
                        markerStyle={{ shadowOpacity: 0, height: 150, width: 50, top: 75, borderRadius: 5 }}
                        sliderLength={300}
                        selectedStyle={{ backgroundColor: 'rgba(256,256,256,0.15)', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}
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
                        touchDimensions={{ height: 150, width: 150, borderRadius: 15, slipDisplacement: 500 }}
                    />
                </View>
                <View style={styles.modes}>
                    <CustomButtons title={`CRUISE\n0 - 5 mph`} type="small" name="cruise" onPress={() => changeModeHandler(5)} />
                    <CustomButtons title={`FAST\n0 - 12 mph`} type="small" name="fast" onPress={() => changeModeHandler(12)} />
                    <CustomButtons title={`LUDICROUS\n0 - ⚡️ mph`} type="small" name="ludicrous" onPress={() => changeModeHandler(20)} />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Avenir-Book', color: 'white', fontSize: 18, position: "absolute", top: 405, left: 20 }}>Mode</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    speedometer: {
        top: 100,
        left: 45
    },
    odometerView: {
        top: 100,
        left: 50
    },
    odometry: {
        color: 'white',
        fontFamily: 'Avenir-Book',
        fontSize: 33,
    },
    slider: {
        flex: 1,
        top: 130,
        left: 23,
        alignContent: 'center',
        justifyContent: 'center'
    },
    modes: {
        flex: 1,
        flexDirection: 'row',
        top: 720,
        justifyContent: "space-between",
        width: phoneWidth * 0.9,
        position: "absolute"
    }
});