import React, { Fragment, useEffect } from 'react';
import { Api } from 'src/Api';
import { respondidasByDay } from 'src/services/respondidas';

import './Gerenciar.scss';

export const Gerenciar: React.FC<GerenciarProps> = () => {

    useEffect(() => {
        Api.get('respondidas/7')
            .then(({data}) => {
                console.log(respondidasByDay(data))
            })
    }, [])

    return (
        <Fragment>
            <header className="content__title">
                <h1>Preferencias</h1>
                <small>Suas Preferencias</small>
            </header>
            <div></div>
        </Fragment>
    )
}

export interface GerenciarProps {}