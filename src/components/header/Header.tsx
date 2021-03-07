import React from 'react';
import { Link } from 'react-router-dom';


import './Header.scss';
import { Search } from '../search/Search';

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {


    return (
        <React.Fragment>

            <header className="header">
                <div className={`navigation-trigger ${sidebarOpen ? 'toggled' : ''}`} onClick={() => toggleSidebar(true)} >
                    <div className="navigation-trigger__inner">
                        <i className="navigation-trigger__line"></i>
                        <i className="navigation-trigger__line"></i>
                        <i className="navigation-trigger__line"></i>
                    </div>
                </div>
                <div className="header__logo hidden-sm-down">
                    <h1>
                        <Link to="/">ESTUDOS<b>APP</b></Link>
                    </h1>
                </div>

                <Search />
                
                <ul className="top-nav">
                    <li>
                        <Link to="/estudar">
                            <div style={{lineHeight: 2, fontWeight: 'bold', padding: '0 1rem 0 1rem'}}>ESTUDAR</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/gerenciar">
                            <div style={{lineHeight: 2, fontWeight: 'bold', padding: '0 1rem 0 1rem'}}>GERENCIAR</div>
                        </Link>
                    </li>
                </ul>
                {!!sidebarOpen &&
                    <div className="ma-backdrop" onClick={() => toggleSidebar(false)}></div>
                }
            </header>

        </React.Fragment>
    )
}

export interface HeaderProps {
    sidebarOpen: boolean,
    toggleSidebar: (open: boolean) => void
}