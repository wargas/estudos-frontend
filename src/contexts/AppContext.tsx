import React, { createContext, useContext, useEffect, useState } from 'react';
import { Api } from 'src/Api';
import { Disciplina } from 'src/interfaces/Disciplina';

const AppContext = createContext<AppContextProps | null>(null);

export const AppContextProvider: React.FC = ({ children }) => {

    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDisciplinas()
    }, [])

    const loadDisciplinas = () => {
        setLoading(true)
        Api.get<Disciplina[]>('/disciplinas')
            .then(({ data }) => setDisciplinas(data))
            .finally(() => setLoading(false))
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
        <AppContext.Provider value={{ disicplinas: disciplinas }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    return useContext(AppContext);
}

export interface AppContextProps {
    disicplinas: Disciplina[]
}
