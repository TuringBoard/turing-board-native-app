import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native';
import Backdrop from './backdrops/Backdrop';
import CircularSlider from 'react-native-circular-slider';
import { useFonts } from 'expo-font';
import Svg, { Line, Text as SvgText, TextPath, Circle, G, Defs, RadialGradient, Path, Stop, TSpan } from 'react-native-svg';
import { PanGestureHandler, PanGestureHandlerEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, runOnJS, max } from 'react-native-reanimated';
import { getDatabase, ref, set } from 'firebase/database';
import { useAuth } from "../store/auth-context";

let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;
const db = getDatabase();

export default function Throttle() {
    const [sliderVal, setSliderVal] = useState(90)
    const [speed, setSpeed] = useState(0)
    const [mode, setMode] = useState("cruise")
    const { uid } = useAuth();
    const [angles, setAngles] = useState({
        startAngle: 300,
        angleLength: 1
    })
    const [value, setValue] = useState(0)
    let [fontsLoaded] = useFonts({
        'Avenir-Book': require('../assets/fonts/AvenirBook.otf'),
    });

    let fuelAngles = []
    for (let i = 3; i <= 72; i += 1) {
        fuelAngles.push(i)
    }

    let offsetRight = -40
    let startingX = phoneWidth - offsetRight
    let startingY = 300
    let rx = 300
    let ry = 300
    let xEnd = phoneWidth - rx - offsetRight
    let yEnd = 300 + ry
    let trackStrokeWidth = 80

    let outerOffsets = -85
    let outerRadius = rx - outerOffsets
    let outerCircumferenceStart = startingX - rx + outerOffsets

    let innerOffsets = 150
    let innerRadius = rx - innerOffsets
    let innerCircumferenceStart = startingX - rx + innerOffsets
    { /*
        Max angle: 80.4, Offset by 10
        For 0-5: Increments of 70.4/5 = 14.08
        For 0-12: Increments of 70.4/12 = 5.86
        For 0-20: Increments of 70.4/20 = 3.52
    */}
    let cruiseInnerAngles = [24.08, 38.16, 52.24, 66.32, 80.4]
    let fastInnerAngles = [15.89, 21.72, 27.58, 33.44, 39.30, 45.16, 51.02, 56.88, 62.74, 68.6, 74.46, 80.32]
    let insaneInnerAngles = [17.04, 24.08, 31.12, 38.16, 45.2, 52.24, 59.28, 66.32, 73.36, 80.4]
    let cruiseNums = [1, 2, 3, 4, 5]
    let fastNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    let insaneNums = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const theta = useSharedValue(0)
    const [innerAngles, setInnerAngles] = useState(cruiseInnerAngles)
    const [nums, setNums] = useState(cruiseNums)

    const speedHandler = (angle) => {
        if (angle * 180 / Math.PI < 10) {
            angle = 0
        }
        const percentage = ((angle * 180 / Math.PI) - 10) / 70.4
        let maxSpeed = 5
        if (mode === "cruise") {
            maxSpeed = 5
        } else if (mode === "fast") {
            maxSpeed = 12
        } else {
            maxSpeed = 20
        }
        if (percentage * (maxSpeed) > 0) {
            setSpeed(percentage * (maxSpeed))
            set(ref(db, 'users/' + uid), {
                speed: percentage * (maxSpeed),
            });
        } else {
            setSpeed(0)
            set(ref(db, 'users/' + uid), {
                speed: 0
            });
        }
    }

    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translateX = translateX.value
            context.translateY = translateY.value
        },
        onActive: (event, context) => {
            theta.value = Math.atan((-event.translationY - context.translateY) / (rx - event.translationX - context.translateX))
            if (theta.value * 180 / Math.PI < 0 && translateY.value <= 0) {
                theta.value = 0
            }
            if (translateX.value >= rx && theta.value * 180 / Math.PI > 88) {
                theta.value = 88 * Math.PI / 180
            }
            if (translateX.value < 0) {
                translateX.value = 0;
            } else if (event.translationX + context.translateX > rx) {
                translateX.value = rx;
            } else {
                if ((rx - (rx * Math.cos(theta.value))) < rx) {
                    translateX.value = rx - (rx * Math.cos(theta.value))
                } else {
                    translateX.value = rx;
                }
            }
            if ((-(rx * Math.sin(theta.value))) < 0) {
                if (translateX.value >= rx) {
                    translateY.value = -rx
                } else if ((-(rx * Math.sin(theta.value))) < -rx) {
                    translateY.value = -rx
                } else {
                    translateY.value = -(rx * Math.sin(theta.value));
                }
            }
            runOnJS(speedHandler)(theta.value)
        },
        onEnd: (event) => {
            translateX.value = rx - (rx * Math.cos(10 * Math.PI / 180))
            translateY.value = -(rx * Math.sin(10 * Math.PI / 180));
            runOnJS(speedHandler)(0)
        },
    })

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value
                },
            ]
        }
    })

    const modeChangeHandler = () => {
        if (mode === "cruise") {
            setMode("fast")
            setInnerAngles(fastInnerAngles)
            setNums(fastNums)
        }
        if (mode === "fast") {
            setMode("insane")
            setInnerAngles(insaneInnerAngles)
            setNums(insaneNums)
        }
        if (mode === "insane") {
            setMode("cruise")
            setInnerAngles(cruiseInnerAngles)
            setNums(cruiseNums)
        }
    }

    return (
        <View>
            <Backdrop />
            <Text
                style={{
                    color: 'white',
                    fontFamily: 'Avenir-Book',
                    fontSize: 15,
                    position: 'absolute',
                    left: 30,
                    top: phoneWidth <= 375 || phoneHeight === 736 ? 240 : 260
                }}
            >
                TRIP: <Text style={{ fontSize: 25 }}>03.14</Text> mi
            </Text>
            <Text style={{
                color: 'white',
                fontSize: 80,
                position: 'absolute',
                top: phoneWidth <= 375 || phoneHeight === 736 ? 150 : 170,
                textAlign: 'center',
                left: 25,
                fontFamily: 'Avenir-Book'
            }}>{speed.toFixed(2).length === 4 ? `0${speed.toFixed(2)}` : speed.toFixed(2)}<Text style={{ fontSize: 30 }}> mph</Text>
            </Text>
            <Text
                style={{
                    fontSize: 15,
                    color: 'white',
                    position: 'absolute',
                    top: phoneWidth <= 375 ? 315 : 335,
                    textAlign: 'center',
                    left: phoneWidth <= 375 ? 15 : phoneWidth <= 390 || phoneWidth <= 414 ? 18 : 57,
                    fontFamily: 'Avenir-Book',
                    opacity: 0.6
                }}
            >Tap to change</Text>

            <SafeAreaView style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: 'absolute',
            }}>
                <Svg height={phoneHeight} width={phoneWidth}>
                    <Defs>
                        <RadialGradient
                            id="strokePath"
                            cx={xEnd}
                            cy={yEnd}
                            rx={rx}
                            ry={rx}
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0" stopColor="white" stopOpacity="1" />
                            <Stop offset="1" stopColor="white" stopOpacity="0.3" />
                        </RadialGradient>
                        <RadialGradient
                            id="speedometerPath"
                            cx={xEnd}
                            cy={yEnd}
                            rx={rx - outerOffsets}
                            ry={rx - outerOffsets}
                            gradientUnits="userSpaceOnUse"
                        >
                            <Stop offset="0" stopColor="green" stopOpacity="1" />
                            <Stop offset="1" stopColor="red" stopOpacity="0.3" />
                        </RadialGradient>
                    </Defs>
                    <Path d={`M ${startingX} ${startingY}
                         A ${rx} ${ry} 0 0 0 ${xEnd} ${yEnd}
                        `}
                        stroke="url(#strokePath)" fill="none" strokeWidth={trackStrokeWidth} />
                    <Path d={`M ${startingX} ${startingY + outerOffsets}
                         A ${rx - outerOffsets} ${ry - outerOffsets} 0 0 0 ${xEnd + outerOffsets} ${yEnd + 35}
                        `}
                        stroke="white"
                        fill="none"
                        strokeWidth={2}
                        id="outerLinePath"
                    />
                    <Path d={`M ${startingX} ${startingY + innerOffsets}
                         A ${rx - innerOffsets} ${ry - innerOffsets} 0 0 0 ${xEnd + innerOffsets} ${yEnd}
                        `}
                        stroke="white"
                        fill="none"
                        strokeWidth={2}
                        id="innerLinePath"
                    />
                    <SvgText
                        x={outerCircumferenceStart + ((outerRadius) - ((outerRadius - 10) * Math.cos(80.5 * Math.PI / 180))) + 3}
                        y={yEnd - (outerRadius - 10) * Math.sin(80.4 * Math.PI / 180) + 210}
                        fill="white"
                        fontSize="20"
                        key="F"
                    >
                        F
                    </SvgText>
                    <SvgText
                        x={innerCircumferenceStart - 25}
                        y={yEnd - 8}
                        fill="white"
                        fontSize="20"
                        key="E"
                    >
                        E
                    </SvgText>
                    <SvgText fill="white" fontSize="15" >
                        <TextPath href="#outerLinePath" startOffset="89%">
                            <TSpan dy="-10"> B R A K E</TSpan>
                        </TextPath>
                    </SvgText>
                    {
                        fuelAngles.map((angle, index) => {
                            return <Line
                                x1={innerCircumferenceStart + (innerRadius - (innerRadius * Math.cos(angle * Math.PI / 180)))}
                                y1={yEnd - innerRadius * Math.sin(angle * Math.PI / 180)}
                                x2={innerCircumferenceStart + ((innerRadius) - ((innerRadius - 10) * Math.cos(angle * Math.PI / 180)))}
                                y2={yEnd - (innerRadius - 10) * Math.sin(angle * Math.PI / 180)}
                                stroke="white"
                                strokeWidth="2"
                                key={index + 9009}
                                strokeOpacity={index > fuelAngles.length / 4 ? 0.3 : 1}
                            />
                        })
                    }
                    <Line
                        x1={innerCircumferenceStart + (innerRadius - (innerRadius * Math.cos(40 * Math.PI / 180)))}
                        y1={yEnd - innerRadius * Math.sin(40 * Math.PI / 180)}
                        x2={innerCircumferenceStart + ((innerRadius) - ((innerRadius + 10) * Math.cos(40 * Math.PI / 180)))}
                        y2={yEnd - (innerRadius + 10) * Math.sin(40 * Math.PI / 180)}
                        stroke="white"
                        strokeWidth="2"
                        key={2 + 90090}
                    />
                    <SvgText
                        x={innerCircumferenceStart + 30}
                        y={yEnd - 10}
                        fill="white"
                        fontSize="35"
                        fontStyle="italic"
                        key="fuelCapacity"
                    >
                        24<SvgText
                            x={innerCircumferenceStart + 75}
                            y={yEnd - 10}
                            fill="white"
                            fontSize="20"
                            fontStyle="italic"
                            key="fuelCapacity"
                        >%</SvgText>
                    </SvgText>

                    { /* Bottom semi circle */}
                    <Path
                        d={`M ${(xEnd) - trackStrokeWidth / 2} 
                        ${yEnd} a1,1 0 0,0 ${trackStrokeWidth},0`} fill="url(#strokePath)" />
                    <Line
                        x1={outerCircumferenceStart + (outerRadius - (outerRadius * Math.cos(10 * Math.PI / 180)))}
                        y1={yEnd - outerRadius * Math.sin(10 * Math.PI / 180)}
                        x2={outerCircumferenceStart + ((outerRadius) - ((outerRadius - 10) * Math.cos(10 * Math.PI / 180)))}
                        y2={yEnd - (outerRadius - 10) * Math.sin(10 * Math.PI / 180)}
                        stroke="white"
                        strokeWidth="2"
                        key={0}
                    />
                    <SvgText
                        x={outerCircumferenceStart + ((outerRadius) - ((outerRadius - 10) * Math.cos(10 * Math.PI / 180))) + 3}
                        y={yEnd - (outerRadius - 10) * Math.sin(10 * Math.PI / 180) + 15}
                        fill="white"
                        fontSize="15"
                        key={`${0}${10}`}
                    >
                        {0}
                    </SvgText>

                    {
                        innerAngles.map((angle, index) => {
                            return <G key={`${index + 2}${angle}`}>
                                <Line
                                    x1={outerCircumferenceStart + (outerRadius - (outerRadius * Math.cos(angle * Math.PI / 180)))}
                                    y1={yEnd - outerRadius * Math.sin(angle * Math.PI / 180)}
                                    x2={outerCircumferenceStart + ((outerRadius) - ((outerRadius - 10) * Math.cos(angle * Math.PI / 180)))}
                                    y2={yEnd - (outerRadius - 10) * Math.sin(angle * Math.PI / 180)}
                                    stroke="white"
                                    strokeWidth="2"
                                    key={index}
                                />
                                <SvgText
                                    x={outerCircumferenceStart + ((outerRadius) - ((outerRadius - 10) * Math.cos(angle * Math.PI / 180))) + 3}
                                    y={yEnd - (outerRadius - 10) * Math.sin(angle * Math.PI / 180) + 15}
                                    fill="white"
                                    fontSize="15"
                                    key={`${index + 1}${angle}`}
                                >
                                    {nums[index]}
                                </SvgText>
                            </G>
                        })
                    }
                </Svg>

                { /* Track Ball*/}
                <PanGestureHandler
                    onGestureEvent={panGestureEvent}
                >
                    <Animated.View
                        style={[{
                            position: 'absolute',
                            top: Platform.OS === "ios" ? phoneHeight === 736 ? yEnd - 20 : phoneWidth <= 375 ? yEnd - 20 : yEnd + 7 : yEnd - 40,
                            left: xEnd - trackStrokeWidth / 2,
                            height: trackStrokeWidth,
                            width: trackStrokeWidth,
                            borderRadius: 50,
                            backgroundColor: 'rgba(10,47,78,0.5)',
                            zIndex: 2,
                            borderColor: 'white',
                            borderWidth: 1
                        }, rStyle]
                        }
                    >
                    </Animated.View>

                </PanGestureHandler>
                { /* Brake Cutoff */}
                <View style={{
                    height: 10,
                    width: 81,
                    backgroundColor: 'black',
                    opacity: 0.5,
                    position: 'absolute',
                    top: Platform.OS === "ios" ? phoneWidth <= 375 || phoneHeight === 736 ? startingY + rx - 35 : startingY + rx - 10 : startingY + rx - 57,
                    left: xEnd + offsetRight + 4,
                    borderRadius: 0,
                    transform: [
                        {
                            rotate: "0.17453292519943195rad" // 10 * (Math.PI / 180) because Android is stupid 
                        }
                    ]
                }}>
                </View>
                <TouchableOpacity
                    style={{
                        borderRadius: 50,
                        height: phoneWidth <= 375 ? 70 : 80,
                        width: phoneWidth <= 375 ? 70 : 80,
                        backgroundColor: mode === "cruise" ? 'rgba(0,255,0,0.3)' : mode === "fast" ? 'rgba(255,0,0,0.2)' : mode === "insane" ? 'rgba(255,0,0,0.5)' : 'rgba(0,255,0,0.3)',
                        position: 'absolute',
                        left: phoneWidth <= 390 || phoneWidth <= 414 ? 25 : 65,
                        top: phoneWidth <= 375 ? startingY + 40 : startingY + 60,
                        flex: 1,
                        justifyContent: 'center',
                        borderColor: 'white',
                        borderWidth: 3
                    }}
                    onPress={modeChangeHandler}
                >
                    <Text
                        style={{
                            color: 'white',
                            textAlign: 'center',
                            fontFamily: 'Avenir-Book'
                        }}
                    >
                        {mode === "cruise" ? "CRUISE" : mode === "fast" ? "FAST" : mode === "insane" ? "INSANE" : ""}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
            { /* Juice */}
            <Image source={require('../assets/juice.png')}
                style={{
                    position: 'absolute',
                    top: Platform.OS === "ios" ? phoneHeight <= 736 ? yEnd - 100 : yEnd - 75 : yEnd - 120,
                    right: 80,
                    height: 20,
                    width: 20
                }}
            />

        </View >
    );
}

const styles = StyleSheet.create({

})