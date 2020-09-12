import React, { useState, useCallback, useEffect } from 'react';
import { Questao } from '../../interfaces/Questao';
import { QuestaoItem } from './QuestaoItem';
import { Card, Button, Spinner, Row, Col, ListGroup, OverlayTrigger, Popover, Modal } from 'react-bootstrap';

import './Questoes.scss';
import { Historico } from './Historico';
import { Respondida } from '../../interfaces/Respondida';

import { DateTime } from 'luxon';
import { useKey } from '../../hooks';
import { Tempo } from '../../components/tempo/Tempo';
import { Comment } from '../../components/comment/Comment'
import { Aula } from '../../interfaces/Aula';

export const Questoes: React.FC<QuestoesProps> = ({ questoes, onHasReponse, loading, respondidas, aula }) => {

    const [index, setIndex] = useState(0);
    const [current, setCurrent] = useState<Questao>();
    const [count, setCount] = useState([]);
    const [openComment, setOpenComment] = useState(false)

    useEffect(() => {
        setCurrent(questoes[index])
    }, [index, questoes])

    // useKey("ArrowRight", ev => next())
    // useKey("ArrowLeft", ev => prev())

    // useKey("a", ev => onMarcar(isMultiplaEscolha() ? 0 : -1))
    // useKey("b", ev => onMarcar(isMultiplaEscolha() ? 1 : -1))
    // useKey("c", ev => onMarcar(isMultiplaEscolha() ? 2 : 0))
    // useKey("d", ev => onMarcar(3))
    // useKey("e", ev => onMarcar(isMultiplaEscolha() ? 4 : 1))

    // useKey("Enter", () => onResponder())


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
                        <Card.Body>
                            <Card.Title>
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
                            </Card.Title>
                            <div className="actions">
                                <div className="actions--item">
                                    <button className="btn" onClick={() => setOpenComment(true)}>
                                        <i className="fas fa-comment"></i>
                                    </button>
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
                            </div>
                            {questoes.length &&
                                <QuestaoItem riscar={onRiscar} marcar={onMarcar} index={index} questao={current} />
                            }
                            <hr />
                            <Button
                                className={`.card-link ${loading ? 'btn-loading on' : 'btn-loading of'}`}
                                disabled={!current.opcoes.some(item => item.marcada) || current.respondida}
                                onClick={onResponder}
                                variant="dark">
                                {loading ? <Spinner animation="border" size="sm" /> : 'RESPONDER'}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Tempo />
                    </Card>
                    <Card body>
                        <Row className="panel">
                            {questoes.map((questao, id) =>
                                <Col key={String(id)} xs={2} className="p-1">
                                    <div className={`panel-item ${questao.status || ''} ${index === id ? 'shadow-sm' : ''}`}
                                        onClick={() => setIndex(id)}>
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

            <Modal show={openComment} onHide={() => setOpenComment(false)}>
                <Modal.Body>
                    <Modal.Title>QUESTAO 00</Modal.Title>
                    <Comment aula={aula} questao={current} />
                </Modal.Body>
            </Modal>

        </React.Fragment>
    )
}

export interface QuestoesProps {
    aula: Aula,
    questoes: Questao[],
    respondidas: Respondida[],
    onHasReponse: (questao_index: number, resposta_index: number) => void,
    loading: boolean
}