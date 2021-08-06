import React, { createContext, FC, useState, useEffect } from 'react';

export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

const TOKEN_LS_KEY = "auth_token"

export const AuthContextProvider: FC = ({ children }) => {

    const [user, setUser] = useState<User>({} as User);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setToken(localStorage.getItem(TOKEN_LS_KEY) || "");
        setLoading(false);
    }, [])

   

    const login = (token: string) => {
        localStorage.setItem(TOKEN_LS_KEY, token);
        setToken(token)
    }

    const logout = () => {
        setToken("");

        localStorage.removeItem(TOKEN_LS_KEY);
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
        <AuthContext.Provider value={{ setUser, logout, user, login, token, isLogged: token.length > 0 }}>
            {children}
        </AuthContext.Provider>
    )
}

export type AuthContextProps = {
    logout: () => void;
    token: string;
    isLogged: boolean;
    user: User;
    setUser: (user: User) => void;
    login: (token: string) => void;
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