import React, { useRef, useEffect } from 'react';
import './Layout.scss';
import { Sidebar } from '../sidebar/Sidebar';
import { Routes } from '../Routes';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Tempo } from '../tempo/Tempo';




export const Layout: React.SFC<LayoutProps> = props => {

    

    return (
        <BrowserRouter basename="estudos">
                <div className="wrapper"  >
                    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <button className="btn">
                                    <i className="fas fa-bars"></i>
                                </button>
                            </li>
                        </ul>
                        {/* <div className="ml-auto">
                            <Switch>
                                <Route exact path="/aula/:id" component={Tempo} />
                            </Switch>
                        </div> */}
                    </nav>
                    <aside className="main-sidebar sidebar-dark-primary elevation-4">
                        <Sidebar />
                    </aside>

                    <div className="content-wrapper">

                        <Routes />
                    </div>
                </div>
            
        </BrowserRouter>
    )
}

export interface LayoutProps { }