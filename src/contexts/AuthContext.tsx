import React, { createContext, FC, Fragment, useState, useEffect } from 'react';
import { firebaseApp } from '../firebase/firebase-config';
import { Spinner } from 'react-bootstrap';

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthContextProvider: FC = ({ children }) => {

    const [user, setUser] = useState<User>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        firebaseApp.auth().onAuthStateChanged(user => {
            setLoading(false)
            const email = user?.email || '';
            const uid = user?.uid;
            const displayName = user?.providerData[0]?.displayName || email.split('@')[0]
            const photoURL = user?.providerData[0]?.photoURL || ''

            setUser({ email, uid, displayName, photoURL })

            console.log(user?.providerData[0])
        })
    }, [])



    const logout = () => {
        firebaseApp.auth().signOut();
    }

    if (loading) {
        return ( 
            <div className="d-flex" style={{ height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner animation="border" />
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{ logout, user, isLogged: !!user.email }}>
            {children}
        </AuthContext.Provider>
    )
}

export type AuthContextProps = {
    logout: () => void;
    isLogged: boolean;
    user: User;
}

export interface User {
    displayName?: string,
    email?: string,
    emailVerified?: string,
    photoURL?: string,
    isAnonymous?: string,
    uid?: string,
    providerData?: string
}