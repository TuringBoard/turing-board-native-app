import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Platform, View, Text, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../store/auth-context';


let phoneWidth = Dimensions.get('window').width;
let phoneHeight = Dimensions.get('window').height;

export default function Login({ loginMode }) {
    const { login, loginSuccess, isLoggedIn } = useAuth();
    const [loginAttempted, setLoginAttempted] = useState(false);
    const [isError, setIsError] = useState(false)
    const [values, setValues] = useState({
        email: "",
        password: ""
    })
    let [fontsLoaded] = useFonts({
        'Avenir-Book': require('../assets/fonts/AvenirBook.otf')
    });

    useEffect(() => {
        if (loginAttempted && !loginSuccess) {
            setIsError(true)
        } else if (loginAttempted && loginSuccess) {
            setIsError(false)
        }
    }, [loginAttempted, loginSuccess]);

    const printScreen = () => {
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                let myStorage = {};
                for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                }
                console.log('CURRENT STORAGE from Login: ', myStorage);
            })
        });
    }

    const onChangeTextHandler = (text, eventName) => {
        setValues(prev => {
            return {
                ...prev,
                [eventName]: text
            }
        });
    }

    const onSubmitHandler = async () => {
        setLoginAttempted(true)
        try {
            await login(values.email, values.password)
        } catch (error) {
            alert(error)
        }
        setValues({
            email: "",
            password: ""
        })
    }

    if (!fontsLoaded) {
        return (<AppLoading />)
    } else {
        if (Platform.OS === 'ios') {
            return (
                <KeyboardAwareScrollView
                    behavior="padding"
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={false}
                    style={{ width: phoneWidth, height: phoneHeight }}
                >
                    <View style={styles.form}>
                        <View>
                            <Text style={styles.header}>SIGN IN</Text>
                        </View>
                        <View style={styles.formItems}>
                            <TextInput
                                style={isError ? styles.inputError : styles.input}
                                value={values.email}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='email'
                                keyboardType='email-address'
                                placeholder="E-mail address"
                                onChangeText={text => onChangeTextHandler(text, "email")}
                            ></TextInput>
                            <TextInput
                                style={isError ? styles.inputError : styles.input}
                                value={values.password}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='password'
                                secureTextEntry={true}
                                placeholder="Password"
                                onChangeText={text => onChangeTextHandler(text, "password")}
                            ></TextInput>
                            <TouchableOpacity style={styles.submit} onPress={onSubmitHandler}>
                                <Text style={styles.submitText}>LOG IN</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.footerContainer}>
                            <Text style={{ color: 'white' }}>
                                <TouchableOpacity onPress={() => { Alert.alert("Just contact Sahaj", "Writing code for this isn't worth the time, he'll manually email you the password reset link.") }}><Text style={styles.footerItems}>Forgot Password?</Text></TouchableOpacity><Text> or </Text><TouchableOpacity onPress={loginMode}><Text style={styles.footerItems}>Sign Up!</Text></TouchableOpacity>
                            </Text>
                        </View>
                    </View>
                    {isError &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>Invalid email or password, please try again.</Text>
                        </View>
                    }
                </KeyboardAwareScrollView >
            )
        } else if (Platform.OS === 'android') {
            return (
                <View
                    style={{ width: phoneWidth, height: phoneHeight - 250 }}
                >
                    <View style={android.form}>
                        <View>
                            <Text style={android.header}>SIGN IN</Text>
                        </View>
                        <View style={android.formItems}>
                            <TextInput
                                style={isError ? styles.inputError : styles.input}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='email'
                                keyboardType='email-address'
                                placeholder="E-mail address"
                                onChangeText={text => onChangeTextHandler(text, "email")}
                            ></TextInput>
                            <TextInput
                                style={isError ? styles.inputError : styles.input}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoComplete='password'
                                secureTextEntry={true}
                                placeholder="Password"
                                onChangeText={text => onChangeTextHandler(text, "password")}
                            ></TextInput>

                            <TouchableOpacity style={android.submit} onPress={onSubmitHandler}>
                                <Text style={android.submitText}>LOG IN</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={android.footerContainer}>
                            <TouchableOpacity onPress={() => { Alert.alert("Just contact Sahaj", "Writing code for this isn't worth the time, he'll manually email you the password reset link.") }}><Text style={android.footerItems}>Forgot Password?</Text></TouchableOpacity><Text style={{ color: 'white' }}> or </Text><TouchableOpacity onPress={loginMode}><Text style={android.footerItems}>Sign Up!</Text></TouchableOpacity>
                        </View>
                    </View>
                </View >
            )
        }
    }
}

const android = StyleSheet.create({
    header: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 25,
        fontFamily: 'Avenir-Book',
    },
    form: {
        width: phoneWidth * 0.8,
        top: 120,
        left: (phoneWidth / 2) - (phoneWidth * 0.4),
        backgroundColor: 'rgba(256, 256, 256, 0.25)',
        borderRadius: 20,
        height: 320,
    },
    formItems: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        top: -15
    },
    submit: {
        marginTop: 10,
        marginBottom: 25,
        paddingTop: 10,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 25,
        backgroundColor: 'rgba(256,256,256,0.25)',
        color: 'white',
        borderRadius: 5,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Avenir-Book',
        fontSize: 16,
        textAlign: 'center',
        left: 5
    },
    footerContainer: {
        color: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        fontFamily: 'Avenir-Book',
        marginBottom: 20,
        paddingTop: 20,
        position: 'absolute',
        top: 255,
        left: (phoneWidth / 2) - 145
    },
    footerItems: {
        color: 'white',
        textDecorationLine: 'underline',
        fontFamily: 'Avenir-Book',
        fontSize: 16
    },
});

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
    inputError: {
        backgroundColor: 'rgb(255, 166, 157)',
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
        top: phoneHeight > 680 ? 120 : 40,
        left: (phoneWidth / 2) - (phoneWidth * 0.4),
        backgroundColor: 'rgba(256, 256, 256, 0.25)',
        borderRadius: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: 130
    },
    error: {
        color: 'rgb(255, 180, 180)',
        fontFamily: 'Avenir-Book',
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: 130
    },
    success: {
        color: 'rgb(180, 255, 180)',
        fontFamily: 'Avenir-Book',
    }
})