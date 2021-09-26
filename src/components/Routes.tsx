import React from 'react';

import {  Route, Redirect } from 'react-router-dom';


const Gerenciar = React.lazy(() => import('../screens/gerenciar/Gerenciar'));
const Home = React.lazy(() => import('../screens/home/Home'));
const Aula = React.lazy(() => import('../screens/aula/Aula'));
const ListAulas = React.lazy(() => import('../screens/disciplinas/ListAulas'));
const Estudar = React.lazy(() => import('../screens/estudar/Estudar'));

export const Routes: React.FC<RoutesInterface> = props => {
    return (
        <React.Fragment>
            <React.Suspense fallback={<p>carregando</p>}>

                <Route exact path="/dashboard" component={Home} />
                <Route exact path="/gerenciar" component={Gerenciar} />
                <Route exact path="/estudar" component={Estudar} />
                <Route exact path="/disciplinas/:id" component={ListAulas} />
                <Route exact path="/aula/:id/:questao" component={Aula} />
                <Route exact path="/">
                    <Redirect to="/dashboard" />
                </Route>

            </React.Suspense>
        </React.Fragment>
    )
}

export interface RoutesInterface { }