import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Backdrop from './backdrops/Backdrop';
import CircleSlider from "react-native-circle-slider";

export default function Test() {
    const [sliderVal, setSliderVal] = useState(90)

    return (
        <View>
            <Backdrop />
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: 'absolute',
                top: 500,
                right: -200,
            }}>
                <CircleSlider
                    value={0}
                    dialWidth={30}
                    btnRadius={15}
                    meterColor={'#fff'}
                    min={0}
                    max={90}
                    strokeWidth={1}
                    dialRadius={200}
                    style={{
                        transform: [{ rotate: "-90deg" }]
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

})