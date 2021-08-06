/* eslint-disable react-hooks/exhaustive-deps */
import Axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext, User } from './AuthContext';

const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider: React.FC = ({ children }) => {

    const { logout, token, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    Axios.defaults.baseURL = 'https://estudos.deltex.work/api';

    Axios.interceptors.request.use((request) => {

        let headers = {}

        if (token) {
            headers = {
                authorization: token
            }
        }

        request.headers = {
            ...request.headers,
            ...headers
        }
        return request;
    }, error => {
        return Promise.reject(error)
    })

    Axios.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error['response']?.status === 403) {
            logout()
        }
    })

    useEffect(() => {
        if (token.length > 0) {
            getCurrentUser()
        } else {
            setUser({} as User);
            setLoading(false);
        }
    }, [token])

    const getCurrentUser = async () => {
        setLoading(true);
        try {
            const { data } = await Axios.get("me");

            setUser(data);
        } catch (error) {

        }
        setLoading(false)
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
        <AppContext.Provider value={null}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    return useContext(AppContext);
}

export interface AppContextProps {

}
