import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Backdrop from './backdrops/Backdrop';
import CircularSlider from 'react-native-circular-slider';
import { useFonts } from 'expo-font';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { PanGestureHandler, PanGestureHandlerEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, runOnJS } from 'react-native-reanimated';

let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;

export default function Test() {
    const [sliderVal, setSliderVal] = useState(90)
    const [speed, setSpeed] = useState(0)
    const [angles, setAngles] = useState({
        startAngle: 300,
        angleLength: 1
    })
    const [value, setValue] = useState(0)
    let [fontsLoaded] = useFonts({
        'Avenir-Book': require('../assets/fonts/AvenirBook.otf')
    });

    const onThrottleHandler = (e) => {
        console.log(e)
        setAngles({
            startAngle: 300,
            angleLength: e.angleLength
        })
    }

    let offsetRight = -20
    let startingX = phoneWidth - offsetRight
    let startingY = 300
    let rx = 300
    let ry = 300
    let xEnd = phoneWidth - rx - offsetRight
    let yEnd = 300 + ry

    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const theta = useSharedValue(0)

    const speedHandler = (displacement) => {
        const percentage = displacement / rx
        setSpeed(percentage * 20)
    }

    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translateX = translateX.value
            context.translateY = translateY.value
        },
        onActive: (event, context) => {
            theta.value = Math.atan((-event.translationY - context.translateY) / (rx - event.translationX - context.translateX))
            if (theta.value * 180 / Math.PI < 0 && theta.value * 180 / Math.PI > -50) {
                theta.value = 0
            }
            if (theta.value * 180 / Math.PI < -50 || theta.value * 180 / Math.PI > 88) {
                theta.value = 89 * Math.PI / 180
            }
            // console.log(theta.value * 180 / Math.PI)
            if (event.translationX + context.translateX < 0) {
                translateX.value = 0;
            } else if (event.translationX + context.translateX > rx) {
                translateY.value = rx;
            } else {
                if ((rx - (rx * Math.cos(theta.value))) < rx) {
                    translateX.value = rx - (rx * Math.cos(theta.value))
                } else {
                    translateX.value = rx;
                }
            }
            if ((-(rx * Math.sin(theta.value))) < 0) {
                translateY.value = -(rx * Math.sin(theta.value));
            } else {
                translateY.value = 0
            }

            runOnJS(speedHandler)(translateX.value)
        },
        onEnd: (event) => { },
    })

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value
                }
            ]
        }
    })

    return (
        <View>
            <Backdrop />
            <Text style={{
                color: 'white',
                fontSize: 50,
                position: 'absolute',
                top: 200,
                textAlign: 'center',
                left: 75,
                fontFamily: 'Avenir-Book'
            }}>{speed.toFixed(2).length === 4 ? `0${speed.toFixed(2)}` : speed.toFixed(2)} mph</Text>
            <SafeAreaView style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: 'absolute',
            }}>
                <Svg height={phoneHeight} width={phoneWidth}>
                    {/* <Circle cx={startingX} cy={startingY} r="10" fill="red" />
                    <Circle cx={xEnd} cy={yEnd} r="10" fill="green" /> */}
                    <Defs>
                        <LinearGradient id="strokePath" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor="#2fa862" stopOpacity="1" />
                            <Stop offset="1" stopColor="white" stopOpacity="0.4" />
                        </LinearGradient>
                    </Defs>
                    <Path d={`M ${startingX} ${startingY}
                         A ${rx} ${ry} 0 0 0 ${xEnd} ${yEnd}
                        `}
                        stroke="url(#strokePath)" fill="none" strokeWidth={80} />
                </Svg>
                <PanGestureHandler
                    onGestureEvent={panGestureEvent}
                >
                    <Animated.View
                        style={[{
                            position: 'absolute',
                            top: yEnd + 2,
                            left: xEnd - 45,
                            height: 90,
                            width: 90,
                            borderRadius: 50,
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            zIndex: 2
                        }, rStyle]
                        }
                    >
                    </Animated.View>
                </PanGestureHandler>
            </SafeAreaView>
            {/* <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: 'absolute',
                top: 350,
                left: 50
            }}>
                <CircularSlider
                    startAngle={angles.startAngle}
                    angleLength={angles.angleLength}
                    onUpdate={onThrottleHandler}
                    segments={100}
                    strokeWidth={80}
                    radius={350}
                    gradientColorFrom="green"
                    gradientColorTo="red"
                    clockFaceColor="#9d9d9d"
                    bgCircleColor="rgba(0,0,0,0.5)"
                />
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({

})