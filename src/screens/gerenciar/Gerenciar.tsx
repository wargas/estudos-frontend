import React from 'react';
import { Card, Breadcrumb } from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';

import './Gerenciar.scss';
import { useApp } from '../../contexts/AppContext';

export const Gerenciar: React.SFC<GerenciarProps> = props => {

    const app = useApp()

    return (
        <div className="gerenciar-container p-3">            
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Gerenciar</Breadcrumb.Item>
            </Breadcrumb>
            <div className="boxs">
                {app?.user.email}
            </div>
        </div>
    )
}

export interface GerenciarProps {}