import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Backdrop from './backdrops/Backdrop';
import CircularSlider from 'react-native-circular-slider';
import { useFonts } from 'expo-font';
import Svg, { Circle, Path } from 'react-native-svg';
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


    let startingX = phoneWidth - 50
    let startingY = 300
    let rx = 300
    let ry = 300
    let xEnd = phoneWidth - rx - 50
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
            theta.value = Math.acos((rx - event.translationX - context.translateX) / rx)
            if (event.translationX + context.translateX < 0) {
                translateX.value = 0;
            } else {
                if ((event.translationX + context.translateX) < rx) {
                    translateX.value = event.translationX + context.translateX;
                } else {
                    translateX.value = rx;
                }
            }
            if (isNaN(theta.value)) {
                translateY.value = 0;
            } else {
                if ((-(rx * Math.sin(theta.value))) > -rx) {
                    translateY.value = -(rx * Math.sin(theta.value));
                } else {
                    translateY.value = -ry
                }
            }
            console.log(translateX.value, ", ", translateY.value)
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
                left: 100,
                fontFamily: 'Avenir-Book'
            }}>{speed.toFixed(2)} mph</Text>
            <SafeAreaView style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: 'absolute',
            }}>
                <Svg height={phoneHeight} width={phoneWidth}>
                    <Circle cx={startingX} cy={startingY} r="10" fill="red" />
                    <Circle cx={xEnd} cy={yEnd} r="10" fill="green" />
                    <Path d={`M ${startingX} ${startingY}
                         A ${rx} ${ry} 0 0 0 ${xEnd} ${yEnd}
                        `}
                        stroke="white" fill="none" strokeWidth={2} />
                </Svg>
                <PanGestureHandler
                    onGestureEvent={panGestureEvent}
                >
                    <Animated.View
                        style={[{
                            position: 'absolute',
                            top: yEnd + 32,
                            left: xEnd - 15,
                            height: 30,
                            width: 30,
                            borderRadius: "50%",
                            backgroundColor: 'rgba(255,255,255,0.6)',
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
                    radius={145}
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