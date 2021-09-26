import React from 'react';
import './Sidebar.scss';
import { Link } from 'react-router-dom';
import { UserInfo } from '../user-info/UserInfo';

export const Sidebar: React.SFC<SidebarProps> = ({ open }) => {

    return (
        <React.Fragment>
            <aside className={`sidebar bg-white ${open ? 'toggled' : ''}`}>
                <div className="scrollbar-inner">

                    <UserInfo />

                    <ul className="navigation">
                        <li>
                            <Link to="/">
                                <i className="zmdi zmdi-view-dashboard"></i>
                            Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/estudar">
                                <i className="zmdi zmdi-view-week"></i>
                            Estudar
                            </Link>
                        </li>
                        <li>
                            <Link to="/gerenciar">
                                <i className="zmdi zmdi-settings"></i>
                            Configurar
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
        </React.Fragment>
    )
}

export interface SidebarProps {
    open: boolean
}