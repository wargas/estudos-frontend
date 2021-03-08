import React, { useContext, useEffect, Fragment, useState, useCallback } from 'react';
import './Layout.scss';
import { Routes } from '../Routes';
import { HashRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { Header } from '../header/Header';
import { Login } from '../../screens/auth/Login';
import { AuthContext } from '../../contexts/AuthContext';
import { Sidebar } from '../sidebar/Sidebar';


export const Layout: React.SFC<LayoutProps> = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false) 

    useEffect(() => {
        document.body.setAttribute('data-ma-theme', 'green')
    }, [])

    const auth = useContext(AuthContext);

    const toggleSidebar = useCallback((ev: boolean) => {
        setSidebarOpen(!sidebarOpen)
    }, [sidebarOpen])

    return (
        <Fragment>
            {(!!auth.isLogged) ?
                <HashRouter>
                    <main className="main">
                        <div className="page-loader d-none">
                            <div className="page-loader__spinner">
                                <svg viewBox="25 25 50 50">
                                    <circle cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
                                </svg>
                            </div>
                        </div>
                        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                        <Sidebar open={sidebarOpen} />
                        <section className="content content--full" onClick={() => setSidebarOpen(false)}>
                            <Container fluid>
                                <Routes />
                            </Container>
                        </section>
                    </main>
                </HashRouter>
                : <Login />}
        </Fragment>
    )
}

export interface LayoutProps { }