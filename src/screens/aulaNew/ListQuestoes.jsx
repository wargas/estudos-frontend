import { DateTime } from 'luxon';
import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

export const ListQuestoes = ({ data, onClose }) => {

    const [currentDay, setCurrentDay] = React.useState(DateTime.local())

    return (
        <React.Fragment>
            <Row>
                <Col xs={3} className="pl-0">
                    {/* <Card>
                        <Card.Body className="p-0" > */}
                    <div className="listview listview--bordered" >
                        {data.dias.map(dia => (
                            <div
                                onClick={() => setCurrentDay(dia.data)}
                                style={{ cursor: 'pointer', opacity: currentDay.hasSame(dia.data, "day") ? 1 : 0.5 }}
                                key={dia.data.toMillis()}
                                className="listview__item">
                                <div className="listview__content">
                                    <div className="listview-heading">{dia.data.toFormat('dd/MM/yyyy')}</div>
                                    <p>{dia.acertos}/{dia.total}</p>
                                </div>
                                <div>
                                    <span className="badge badge-secondary">{Math.floor(dia.acertos / dia.total * 1000) / 10}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* </Card.Body>
                    </Card> */}
                </Col>
                <Col>
                    {data.questoes.map((questao, questao_id) => {
                        const resCurrent = questao.respondidas
                            .find(res => currentDay.hasSame(DateTime.fromISO(res.horario), "day"));


                        return { ...questao, current: resCurrent };
                    }).map((questao, questao_id) => (
                        <Button
                            onClick={() => onClose(questao_id)}
                            key={questao_id}
                            variant={!!questao.current ? questao.current.acertou ? 'success' : 'danger' : 'light'}
                            className="m-1 px-0" style={{ width: 40 }}>
                            {String(questao_id + 1).padStart(2, '0')}
                        </Button>
                    ))}
                </Col>
            </Row>
        </React.Fragment>
    )
}

