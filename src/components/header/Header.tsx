import React, { useContext } from 'react';
import { Container, NavDropdown, Dropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';


import './Header.scss';
import { AuthContext } from '../../contexts/AuthContext';

export const Header: React.FC = props => {

    const auth = useContext(AuthContext)

    return (
        <React.Fragment>
            <nav className="navbar navbar-dark bg-dark navbar-expand-sm fixed-top shadow py-0">
                <Container fluid>
                    <Link to="/" className="navbar-brand">
                        <span style={{ fontFamily: 'Alfa Slab One', fontSize: 30, padding: 0 }} className="d-none d-md-block d-xl-block d-lg-block d-xl-none">
                            ESTUDOS
                        </span>
                        <span style={{ fontFamily: 'Alfa Slab One', fontSize: 30, padding: 0 }} className="d-none d-sm-block d-md-none">
                            E
                        </span>
                    </Link>

                    <ul className="navbar-nav main-menu" >
                        <li className="nav-item">
                            <NavLink to="/dashboard" activeClassName="active" className="nav-link">
                                <i className="fas fa-chart-bar mr-3"></i>
                                HOME
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/estudar" activeClassName="active" className="nav-link">
                                <i className="fas fa-chalkboard mr-3"></i>
                                ESTUDAR
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <a href="#" onClick={e => e.preventDefault()} className="nav-link">
                                <img src={auth.user.photoURL} alt="" className="img avatar" />
                                <span className="d-xs-none">{auth.user.displayName}</span>
                            </a>
                        </li>
                        <NavDropdown title=" " id="user-drop">
                            <NavDropdown.Item onClick={() => auth.logout()}>
                                <i className="fas fa-user mr-3"></i>
                                    Sair
                                    </NavDropdown.Item>
                            <NavDropdown.Item>
                                <i className="fas fa-cog mr-3"></i>
                                    Preferencias
                                    </NavDropdown.Item>
                        </NavDropdown>
                    </ul>
                </Container>
            </nav>
        </React.Fragment>
    )
}