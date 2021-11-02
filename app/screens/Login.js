import React from 'react';
import { StyleSheet, Dimensions, Image, View, Text, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Stack = createNativeStackNavigator();


let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;

export default function Login() {
    const navigation = useNavigation();
    let [fontsLoaded] = useFonts({
        'Avenir-Book': require('../assets/fonts/AvenirBook.otf')
    });
    const onSubmitHandler = () => {
        navigation.navigate('Dashboard')
    }
    if (!fontsLoaded) {
        return (<AppLoading />)
    } else {
        console.log(phoneHeight)
        return (
            <KeyboardAwareScrollView
                behavior="padding"
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={false}
                style={{ width: phoneWidth, height: phoneHeight - 250 }}
            >
                <View style={styles.form}>
                    <View>
                        <Text style={styles.header}>SIGN IN</Text>
                    </View>
                    <View style={styles.formItems}>
                        <TextInput style={styles.input} autoCapitalize='none' autoCorrect={false} autoComplete='email' keyboardType='email-address' placeholder="E-mail address"></TextInput>
                        <TextInput style={styles.input} autoCapitalize='none' autoCorrect={false} autoComplete='password' secureTextEntry={true} placeholder="Password"></TextInput>
                        <TouchableOpacity style={styles.submit} onPress={onSubmitHandler}>
                            <Text style={styles.submitText}>LOG IN</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footerContainer}>
                        <Text style={{ color: 'white' }}>
                            <TouchableOpacity><Text style={styles.footerItems}>Forgot Password?</Text></TouchableOpacity><Text> or </Text><TouchableOpacity><Text style={styles.footerItems}>Sign Up!</Text></TouchableOpacity>
                        </Text>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 25,
        fontFamily: 'Avenir-Book',
        paddingBottom: 25
    },
    input: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 5,
        opacity: 0.75,
        padding: 10,
        marginBottom: 7,
        fontFamily: 'Avenir-Book',
    },
    formItems: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submit: {
        marginTop: 10,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 8,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: 'rgba(256,256,256,0.25)',
        color: 'white',
        borderRadius: 5,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Avenir-Book',
        fontSize: 16
    },
    footerContainer: {
        color: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Avenir-Book',
        marginBottom: 20,
        marginTop: 10,
    },
    footerItems: {
        color: 'white',
        textDecorationLine: 'underline',
        top: 2
    },
    textLink: {
        textDecorationLine: 'underline'
    },
    form: {
        width: phoneWidth * 0.8,
        top: 120,
        left: (phoneWidth / 2) - (phoneWidth * 0.4),
        backgroundColor: 'rgba(256, 256, 256, 0.25)',
        borderRadius: 20,
    }
})