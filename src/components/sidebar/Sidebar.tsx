import React from 'react';
import './Sidebar.scss';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Sidebar: React.SFC<SidebarProps> = props => {
    return (
        <React.Fragment>
            <a href="" className="brand-link">
                <span className="brand-text">ESTUDOS</span>
            </a>
            <div className="sidebar">
                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <i className="nav-icon fas fa-th"></i>
                                <p>Dashboard</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/estudar" className="nav-link">
                                <i className="nav-icon fas fa-chalkboard"></i>
                                <p>Estudar</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/gerenciar" className="nav-link">
                                <i className="nav-icon fas fa-cog"></i>
                                <p>Gerenciar</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
                
            </div>
        </React.Fragment>
    )
}

export interface SidebarProps { }