import React, { useContext, useEffect, Fragment } from 'react';
import './Layout.scss';
import { Routes } from '../Routes';
import { BrowserRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { Header } from '../header/Header';
import { Login } from '../../screens/auth/Login';
import { AuthContext } from '../../contexts/AuthContext';


export const Layout: React.SFC<LayoutProps> = () => {

    const auth = useContext(AuthContext);

    return (
        <Fragment>
            {(!!auth.user.uid) ? 
            <BrowserRouter basename="estudos">
                <div id="layout-wrapper" >
                    <Header />
                    <Container fluid>
                        <Routes />
                    </Container>
                </div>
            </BrowserRouter>
            : <Login />}
        </Fragment>
    )
}

export interface LayoutProps { }