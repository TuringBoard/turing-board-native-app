import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../APIs/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from '@firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
// import { useHistory } from 'react-router';

const AuthContext = React.createContext()
const db = getFirestore();

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    // const history = useHistory();
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
        console.log(email, password)
        signInWithEmailAndPassword(auth, email, password).then(() => {
            setLoginSuccess(true);
            const myAuth = getAuth();
            localStorage.setItem('uid', myAuth.currentUser.uid);
            // history.go('/dashboard');
            setUid(myAuth.currentUser.uid);
        }).catch((error) => {
            setLoginSuccess(false)
        });
    }

    const logout = () => {
        const myAuth = getAuth();
        signOut(myAuth).then(() => {
            localStorage.removeItem('uid');
            // history.go('/');
        });
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            user && setUid(user.uid);
            user && localStorage.setItem('uid', user.uid);
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
