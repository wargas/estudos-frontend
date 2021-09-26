import React from "react";
import { Link, Route, Switch } from "react-router-dom";

import "./Header.scss";
import { Tempo } from "../tempo/Tempo";
import { Search } from "../search/Search";

export const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  sidebarOpen,
}) => {
  return (
    <React.Fragment>
      <header className="header">
        <div
          className={`navigation-trigger ${sidebarOpen ? "toggled" : ""}`}
          onClick={() => toggleSidebar(true)}
        >
          <div className="navigation-trigger__inner">
            <i className="navigation-trigger__line"></i>
            <i className="navigation-trigger__line"></i>
            <i className="navigation-trigger__line"></i>
          </div>
        </div>
        <div className="header__logo hidden-sm-down">
          <h1>
            <Link to="/">
              ESTUDOS<b>APP</b>
            </Link>
          </h1>
        </div>

        <Search />

        <div></div>

        <ul className="top-nav">
          <li>
            <Link to="/estudar">
              <div
                style={{
                  lineHeight: 2,
                  fontWeight: "bold",
                  padding: "0 1rem 0 1rem",
                }}
              >
                ESTUDAR
              </div>
            </Link>
          </li>
          <li>
            <Link to="/gerenciar">
              <div
                style={{
                  lineHeight: 2,
                  fontWeight: "bold",
                  padding: "0 1rem 0 1rem",
                }}
              >
                GERENCIAR
              </div>
            </Link>
          </li>
        </ul>
        <div className="ml-auto">
          <Switch>
            <Route exact path="/aula/:aula_id/:questao_id">
              {({ match }) => (
                <>
                  <Tempo id={match?.params.aula_id || 0} />
                </>
              )}
            </Route>
          </Switch>
        </div>
        {!!sidebarOpen && (
          <div
            className="ma-backdrop"
            onClick={() => toggleSidebar(false)}
          ></div>
        )}
      </header>
    </React.Fragment>
  );
};

export interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: (open: boolean) => void;
}
