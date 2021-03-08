import React, { useEffect, useState } from 'react';
import { Card, Spinner, Dropdown, Row, Col } from 'react-bootstrap';
import { Disciplina } from '../../interfaces/Disciplina';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

export const Estudar: React.FC<EstudarProps> = () => {

    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [loading] = useState(false);
    const [order, setOrder] = useState('');
    const [showArquivadas, setShowArquivadas] = useState(false)

    const history = useHistory()

    useEffect(() => {
        loadDisciplinas()
    }, [])


    const loadDisciplinas = async () => {
        try {
            const { data } = await Axios.get("disciplinas");

            console.log(data)

            setDisciplinas(data)
        } catch (error) {

        }
    }


    const handlerSetOrder = (_order: "name" | "aulas") => {

        setDisciplinas(old => {
            return old.sort((a, b) => {

                const itemA = a[_order];
                const itemB = b[_order];

                if (itemA > itemB) {
                    return 1
                }

                return -1
            })
        })

        setOrder(_order)
    }

    return (
        <React.Fragment>
            <div className="toolbar">
                <div className="toolbar--label">DISCIPLINAS</div>
                <div className="actions">
                    <div className="actions__item">
                        <Dropdown>
                            <Dropdown.Toggle className="no-caret" as={'div'}>
                                <i className="zmdi zmdi-more-vert"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handlerSetOrder('name')} active={order === 'nome'}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>Classificar por Nome</div>
                                        {order === 'name' && (
                                            <i className="zmdi zmdi-check ml-2"></i>
                                        )}
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handlerSetOrder('aulas')} active={order === 'aulas'}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>Classificar por Aulas</div>
                                        {order === 'aulas' && (
                                            <i className="zmdi zmdi-check ml-2"></i>
                                        )}
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => setShowArquivadas(!showArquivadas)}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>Mostrar arquivadas</div>
                                        {showArquivadas && (
                                            <i className="zmdi zmdi-check ml-2"></i>
                                        )}
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>


            {(loading) && (
                <div className="d-flex align-items-center justify-content-center">
                    <Spinner animation="border" />
                </div>
            )}

            {(!loading) && (
                <Row>
                    {disciplinas
                        .filter(disciplina => {
                            if (!showArquivadas && disciplina.arquivada) {
                                return false;
                            }

                            return true;
                        })
                        .map(disciplina => {

                            const questoes = disciplina.aulas.reduce((acc, aula) => {
                                return acc + aula.questoes
                            }, 0)

                            return { ...disciplina, questoes }
                        })
                        .map(disciplina => (
                            <Col key={disciplina.id} md={4}>
                                <Card style={{ cursor: 'pointer' }} onClick={() => history.push(`disciplinas/${disciplina.id}`)}>
                                    <Card.Body>
                                        <Card.Title>{disciplina.name}</Card.Title>
                                        <span className="badge badge-light">
                                            {String(disciplina.aulas?.length).padStart(2, "0")} aulas
                                            </span>
                                        <span className="ml-3 badge badge-light">
                                            {String(disciplina.questoes).padStart(2, '0')} questões
                                            </span>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                </Row>
            )}
        </React.Fragment >
    )
}

export interface EstudarProps { }