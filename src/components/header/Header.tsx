import React, { useContext } from 'react';
import { Container, NavDropdown, Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';


import './Header.scss';
import { AuthContext } from '../../contexts/AuthContext';
import { Search } from '../search/Search';

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarOpen }) => {

    const auth = useContext(AuthContext)

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
                            <i className="fas fa-chalkboard"></i>
                        </Link>
                    </li>
                    <li>
                        <a href="">
                            <i className="zmdi zmdi-more-vert"></i>
                        </a>
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