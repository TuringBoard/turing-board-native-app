import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../APIs/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from '@firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext({
    loginSuccess: false
})
const db = getFirestore();

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [uid, setUid] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const signup = (email, password, firstName, lastName) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                setSignupSuccess(true);
                setIsLoggedIn(true)
                return setDoc(doc(db, 'users', cred.user.uid), {
                    id: cred.user.uid,
                    firstName,
                    lastName
                })
            }).catch(error => {
                console.log(error)
                setSignupSuccess(false);
                setIsLoggedIn(false)
                alert(error)
            });
    }

    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password).then(async () => {
            const myAuth = getAuth();
            try {
                await AsyncStorage.setItem('uid', myAuth.currentUser.uid);
                await AsyncStorage.setItem('isLoggedIn', 'true').then(() => {
                    setIsLoggedIn(true)
                    setUid(myAuth.currentUser.uid);
                    setLoginSuccess(true);
                })
            } catch (error) {
                console.log(error)
                alert.log(error)
            }
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
                await AsyncStorage.setItem('isLoggedIn', 'false')
                setIsLoggedIn(false)
            } catch (error) {
                console.log(error)
            }
        });
    }

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            user && setCurrentUser(user)
            user && setLoginSuccess(true);
            user && setUid(user.uid);
            user && AsyncStorage.setItem('uid', user.uid)
        })
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
