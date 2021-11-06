import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../APIs/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from '@firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// import { useHistory } from 'react-router';

const AuthContext = React.createContext()
const db = getFirestore();

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [uid, setUid] = useState("")
    const isLoggedIn = !!uid;
    const signup = (email, password, firstName, lastName) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                return setDoc(doc(db, 'users', cred.user.uid), {
                    id: cred.user.uid,
                    firstName,
                    lastName
                })
            }).catch(error => {
                setSignupSuccess(false);
            });
        setSignupSuccess(true);
    }

    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password).then(async () => {
            const myAuth = getAuth();
            try {
                setLoginSuccess(true);
                await AsyncStorage.setItem('uid', myAuth.currentUser.uid);
            } catch (error) {
                console.log(error)
                alert.log(error)
            }
            setUid(myAuth.currentUser.uid);
            navigation.navigate('Dashboard');
        }).catch((error) => {
            console.log(error)
            setLoginSuccess(false)
        });
    }

    const logout = () => {
        const myAuth = getAuth();
        signOut(myAuth).then(async () => {
            try {
                await AsyncStorage.removeItem('uid')
                navigation.navigate('Welcome Screen')
            } catch (error) {
                console.log(error)
            }
        });
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            user && setUid(user.uid);
            // user && localStorage.setItem('uid', user.uid);
            setCurrentUser(user)
        })
        return unsubscribe;
    }, [])

    const value = {
        currentUser,
        isLoggedIn,
        signup,
        login,
        logout,
        loginSuccess,
        signupSuccess,
        uid
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};
