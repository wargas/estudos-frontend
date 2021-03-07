import React, { createContext, FC, useState, useEffect } from 'react';
import { firebaseApp } from '../firebase/firebase-config';

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

            
        })
    }, [])



    const logout = () => {
        firebaseApp.auth().signOut();
    }

    if (loading) {
        return (
            <div className="page-loader">
                <div className="page-loader__spinner">
                    <svg viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
                    </svg>
                </div>
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