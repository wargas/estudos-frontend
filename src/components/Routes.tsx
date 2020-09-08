import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import { Estudar } from '../screens/estudar/Estudar';
import { Gerenciar } from '../screens/gerenciar/Gerenciar';
import { Home } from '../screens/home/Home';
import { Aula } from '../screens/aula/Aula';
import { Login } from '../screens/auth/Login';

export const Routes: React.SFC<RoutesInterface> = props => {

    

    return (
        <React.Fragment>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/dashboard" />
                    </Route>
                    <Route exact path="/dashboard" component={Home} />
                    <Route exact path="/gerenciar" component={Gerenciar} />
                    <Route exact path="/estudar" component={Estudar} />
                    <Route exact path="/aula/:id" component={Aula} />
                    <Route path="*">
                        <Redirect to="/" />
                    </Route>
                </Switch>
        </React.Fragment>
    )
}

export interface RoutesInterface {}