import React, { useState, useEffect } from 'react';
import { Respondida } from '../../interfaces/Respondida';
import { DateTime } from 'luxon';
import { ListGroup, Row, Col, OverlayTrigger, Popover } from 'react-bootstrap';

export const Historico: React.FC<HistoricoProps> = ({ respondidas }) => {

    const [historico, setHistorico] = useState<HistoricoInterface[]>([])

    useEffect(() => {

        const _historico = respondidas
            .reduce<HistoricoInterface[]>((_acc, _item) => {
                const current = DateTime.fromISO(_item.horario);
                const historicoHoje = _acc.find(hist => hist.data.hasSame(current, 'day'));

                if (!historicoHoje) {
                    _acc.push({
                        erros: 0,
                        data: current,
                        acertos: 0
                    })
                }
                _acc = _acc.map(acc => {
                    if (acc.data.hasSame(current, 'day')) {
                        if (_item.acertou) {
                            acc.acertos = acc.acertos + 1;
                        } else {
                            acc.erros = acc.erros + 1
                        }
                    }

                    return acc;
                })


                return _acc;
            }, [])
            .sort((a, b) => {
                if (a.data.hasSame(b.data, 'day')) {
                    return 0
                }
                if (a.data < b.data) {
                    return 1
                } else {
                    return -1
                }
            });

        setHistorico(_historico)
    }, [respondidas])

    return (
        <React.Fragment>
            <ListGroup>
                {historico.map(item =>
                    <ListGroup.Item
                        key={item.data.toISOTime()}
                        className={DateTime.local().hasSame(item.data, 'day') ? 'bg-info' : ''}>
                        <Row>
                            <Col>{item.data.toFormat('dd/MM/y')}</Col>
                            <Col className="text-right">
                                <OverlayTrigger placement="left" overlay={
                                    <Popover id="estatitiscas-porpover">
                                        <Popover.Title>Estatísticas da aula</Popover.Title>
                                        <Popover.Content>
                                            <div className="d-flex justify-content-between">
                                                <div>acertos</div>
                                                <div>{item.acertos}</div>

                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div>erros</div>
                                                <div>{item.erros}</div>

                                            </div>
                                            <div className="d-flex justify-content-between font-weight-bold">
                                                <div>Total</div>
                                                <div>{item.acertos + item.erros}</div>
                                            </div>
                                        </Popover.Content>
                                    </Popover>
                                } >
                                    <span className="badge" style={{cursor: 'pointer'}}>
                                        {((item.acertos / (item.acertos + item.erros)) * 100).toFixed(1)}%
                                    </span>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                )}
            </ListGroup>
        </React.Fragment>
    )
}

export interface HistoricoProps {
    respondidas: Respondida[]
}

export interface HistoricoInterface {
    data: DateTime,
    acertos: number,
    erros: number
}