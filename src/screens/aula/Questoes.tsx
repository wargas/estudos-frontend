import React, { useState, useCallback, useEffect } from 'react';
import { Questao } from '../../interfaces/Questao';
import { QuestaoItem } from './QuestaoItem';
import { Card, Button, Spinner, Row, Col, ListGroup, OverlayTrigger, Popover } from 'react-bootstrap';

import './Questoes.scss';
import { Historico } from './Historico';
import { Respondida } from '../../interfaces/Respondida';

import { DateTime } from 'luxon';
import { useKey } from '../../hooks';
import { Tempo } from '../../components/tempo/Tempo';

export const Questoes: React.FC<QuestoesProps> = ({ questoes, onHasReponse, loading, respondidas }) => {

    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState<Questao>();
    const [count, setCount] = useState([])

    useEffect(() => {
        setCurrent(questoes[index])
    }, [index, questoes])

    useKey("ArrowRight", ev => next())
    useKey("ArrowLeft", ev => prev())

    useKey("a", ev => onMarcar(isMultiplaEscolha() ? 0 : -1))
    useKey("b", ev => onMarcar(isMultiplaEscolha() ? 1 : -1))
    useKey("c", ev => onMarcar(isMultiplaEscolha() ? 2 : 0))
    useKey("d", ev => onMarcar(3))
    useKey("e", ev => onMarcar(isMultiplaEscolha() ? 4 : 1))

    useKey("Enter", () => onResponder())


    const isMultiplaEscolha = () => {
        if (current)
            return current.opcoes.length > 2;

        return false;
    }

    const next = () => {
        if (index === questoes.length - 1) {
            return;
        }
        setIndex(index + 1)
    }

    const prev = () => {
        if (index === 0) {
            return;
        }
        setIndex(index - 1)
    }

    const onRiscar = useCallback((opcao_index) => {
        if (current?.respondida) {
            return;
        }
        if (current) {
            const n_opcoes = current.opcoes.map((opcao, i) => {
                if (i === opcao_index) {
                    opcao.riscada = !opcao.riscada
                }
                return opcao;
            });

            setCurrent({ ...current, opcoes: n_opcoes })
        }

    }, [current])

    const onMarcar = useCallback((opcao_index) => {
        if (current?.respondida) {
            return;
        }
        if (current) {
            const n_opcoes = current.opcoes.map((opcao, i) => {

                if (i === opcao_index) {
                    opcao.marcada = !opcao.marcada
                } else {
                    opcao.marcada = false;
                }
                return opcao;
            });

            setCurrent({ ...current, opcoes: n_opcoes })
        }
    }, [current])

    const onResponder = useCallback(() => {
        const opcoes = current?.opcoes || [];
        const marcada = opcoes.find(op => op.marcada);

        if (marcada) {
            const opcao_index = opcoes.indexOf(marcada)
            onHasReponse(index, opcao_index)
        }
    }, [current, respondidas]);

    const getLetra = (questao: Questao, letra: number) => {
        if (questao.opcoes.length > 2) {
            return ['A', 'B', 'C', 'D', 'E'][letra];
        }
        return ['C', 'E'][letra];
    }

    if (!current) {
        return (
            <></>
        )
    }



    return (
        <React.Fragment>
            <Row>
                <Col xs={9} >
                    <Card>
                        <Card.Header className="align-items-center">
                            <div className="ml-auto card-tools">
                                <button onClick={prev} className="btn btn-tool">
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                <button style={{ cursor: 'pointer' }} className="btn btn-tool">
                                    {index + 1}/{questoes.length}
                                </button>
                                <button onClick={next} className="btn btn-tool">
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                            <div className="mr-auto">
                                <div className="stats">
                                    {questoes.length && current['respondidas']?.map((respondida, r_index) =>
                                        <OverlayTrigger
                                            key={String(r_index)}
                                            // trigger="click"
                                            placement="bottom"
                                            overlay={
                                                <Popover id="popover-basic">
                                                    <Popover.Title>Dados da Resposta</Popover.Title>
                                                    <Popover.Content>
                                                        <span> {DateTime.fromISO(respondida.horario).toFormat('dd/MM/yyyy')}</span>
                                                        <br />
                                                        <span>resposta: {getLetra(current, respondida.resposta)}</span> <br />
                                                        <span>gabarito: {getLetra(current, respondida.gabarito)}</span>
                                                    </Popover.Content>
                                                </Popover>
                                            }>

                                            <div className="stat">
                                                {respondida.acertou ? <div className="stat s acertou"></div> : <div className="stat errou"></div>}
                                            </div>
                                        </OverlayTrigger>
                                    )}
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {questoes.length &&
                                <QuestaoItem riscar={onRiscar} marcar={onMarcar} index={index} questao={current} />
                            }
                        </Card.Body>
                        <Card.Footer>
                            <div className="d-flex justify-content-between align-items-center">
                                <Button
                                    className={loading ? 'btn-loading on' : 'btn-loading of'}
                                    disabled={!current.opcoes.some(item => item.marcada) || current.respondida}
                                    onClick={onResponder}
                                    variant="dark">
                                    {loading ? <Spinner animation="border" size="sm" /> : 'RESPONDER'}
                                </Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col>
                    <Card body>
                        <Tempo />
                    </Card>
                    <Card body>
                        <Row className="panel">
                            {questoes.map((questao, id) =>
                                <Col key={String(id)} xs={2}>
                                    <div className={`panel-item ${questao.status || ''} ${index === id ? 'elevation-1' : ''}`} onClick={() => setIndex(id)}>
                                        <span>{(id + 1).toString().padStart(2, "0")}</span>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Card>
                    <Card>
                        <Card.Body className="p-0">
                            <Historico respondidas={respondidas} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </React.Fragment>
    )
}

export interface QuestoesProps {
    questoes: Questao[],
    respondidas: Respondida[],
    onHasReponse: (questao_index: number, resposta_index: number) => void,
    loading: boolean
}