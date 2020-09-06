import React, {  } from 'react';
import './Layout.scss';
import { Sidebar } from '../sidebar/Sidebar';
import { Routes } from '../Routes';
import { BrowserRouter } from 'react-router-dom';




export const Layout: React.SFC<LayoutProps> = () => {

    

    return (
        <BrowserRouter basename="estudos">
                <h1>Clear</h1>
            
        </BrowserRouter>
    )
}

export interface LayoutProps { }