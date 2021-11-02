import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

let phoneWidth = Dimensions.get('window').width;
export default function CustomButtons(props) {
    const [btnClass, setBtnClass] = useState()
    const [btnTextClass, setBtnTextClass] = useState()
    const [btnPic, setBtnPic] = useState()
    const [bgColor, setBgColor] = useState(``)

    useEffect(() => {
        if (props.type === "big") {
            setBtnClass(styles.bigBtn)
            setBtnTextClass(styles.bigBtnText)
        } else if (props.type === "settings") {
            setBtnClass(styles.settingsBtn);
            setBtnTextClass(styles.settingsBtnText);
        } else if (props.type === "small") {
            setBtnClass(styles.smallBtn);
            setBtnTextClass(styles.smallBtnText);
        }
        if (props.name === "parking") {
            setBtnPic(styles.parking)
        }
        if (props.name == "cruise") {
            setBgColor('rgba(0, 256, 0, 0.1)')
        } else if (props.name == "fast") {
            setBgColor('rgba(150,0,0,0.2)')
        } else if (props.name == "ludicrous") {
            setBgColor('rgba(150,0,0,0.5)')
        } else {
            setBgColor('rgba(256,256,256,0.25)')
        }
    }, [props])
    return (
        <TouchableOpacity style={[btnClass, { backgroundColor: bgColor }]} onPress={props.onPress}>
            <Text style={btnTextClass}>{props.title}</Text>
            <View style={btnPic}>{props.children}</View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    bigBtn: {
        width: phoneWidth * 0.35,
        height: phoneWidth * 0.35,
        backgroundColor: 'rgba(256, 256, 256, 0.5)',
        borderRadius: 10,
        padding: 15,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        borderTopColor: 'white',
        borderTopWidth: 1,
        borderRightColor: 'white',
        borderRightWidth: 1,
        borderLeftColor: 'white',
        borderLeftWidth: 1,
        marginBottom: 40,
        marginLeft: phoneWidth * 0.10,
    },
    bigBtnText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    settingsBtn: {
        width: phoneWidth * 0.8,
        backgroundColor: 'rgba(230, 161, 92, 0.09)',
        borderRadius: 10,
        padding: 20,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        borderTopColor: 'white',
        borderTopWidth: 1,
        borderRightColor: 'white',
        borderRightWidth: 1,
        borderLeftColor: 'white',
        borderLeftWidth: 1,
        left: phoneWidth * 0.10
    },
    settingsBtnText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    parking: {
        width: 10,
        height: 10
    },
    smallBtn: {
        width: phoneWidth * 0.27,
        height: 55,
        borderRadius: 5,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        borderTopColor: 'white',
        borderTopWidth: 1,
        borderRightColor: 'white',
        borderRightWidth: 1,
        borderLeftColor: 'white',
        borderLeftWidth: 1,
        left: phoneWidth * 0.10
    },
    smallBtnText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
})