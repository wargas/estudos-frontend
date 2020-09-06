import React, { createContext, useContext } from 'react';

const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider: React.FC = ({children}) => {
    return (
        <AppContext.Provider value={{user: {name: 'Wargas Teixeira', email: 'teixeira.wargas@gmail.com'}}}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    return useContext(AppContext);
}

export interface AppContextProps {
    user: User
}

export interface User {
    name: string;
    email: string;
}