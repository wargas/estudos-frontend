import React, { useState, useEffect } from 'react';
import { Card, Container, Breadcrumb, Accordion, Spinner, useAccordionToggle, ListGroup, Dropdown } from 'react-bootstrap';
import { Disciplina } from '../../interfaces/Disciplina';
import { Api } from '../../Api';
import { Link } from 'react-router-dom';

export const Estudar: React.SFC<EstudarProps> = props => {

    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('')

    useEffect(() => getDisciplinas(), [])

    const getDisciplinas = () => {
        setLoading(true)
        Api.get<Disciplina[]>('disciplinas')
            .then((response) => {
                setDisciplinas(response.data)
            })
            .finally(() => setLoading(false))
    }

    const Toggle: React.SFC<{ eventKey: string }> = ({ eventKey }) => {
        const useHandler = useAccordionToggle(eventKey, ev => { })
        return (
            <button className="btn" onClick={useHandler}>
                <i className="fas fa-chevron-down"></i>
            </button>
        )
    }

    const countQuestoes = (disciplina: Disciplina) => {
        return disciplina.aulas.reduce<number>((acc, aula) => {
            acc = acc + aula.questoes;

            return acc;
        }, 0)
    }

    const handlerSetOrder = (_order: "name" | "aulas") => {

        setDisciplinas(old => {
            return old.sort((a, b) => {
                
                const itemA = a[_order];
                const itemB = b[_order];

                if(itemA > itemB) {
                    return 1
                }

                return -1
            })
        })

        setOrder(_order)
    }

    return (
        <React.Fragment>
            <div className="content-header">
                <div className="d-flex justify-content-between">
                    <h1>Disciplinas</h1>
                    <div className="option">
                        <Dropdown>
                            <Dropdown.Toggle variant="transparent">
                                <i className="fas fa-filter mr-3"></i>
                                 Ordenar por</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handlerSetOrder('name')} active={order === 'nome'}>
                                    Nome
                                    </Dropdown.Item>
                                <Dropdown.Item onClick={() => handlerSetOrder('aulas')} active={order === 'aulas'}>
                                    Aulas
                                    </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="content">
                <Container fluid>


                    {(loading) && (
                        <div className="d-flex align-items-center justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    )}

                    {(!loading) && (
                        <Accordion>
                            {disciplinas.map((disciplina, index) =>
                                <Card key={String(disciplina.id)} className="m-0 elevation-3">
                                    <Card.Header className="d-flex bg-light">
                                        <div>
                                            <Card.Title className="d-block">
                                                <span>{disciplina.name}</span>
                                                <br />
                                                <span className="font-weight-light mt-1">
                                                    {String(disciplina.aulas?.length).padStart(2, "0")} aulas
                                                </span>
                                                <span className="font-weight-light mt-1 ml-3">
                                                    {String(countQuestoes(disciplina)).padStart(2, "0")} questões
                                                </span>
                                            </Card.Title>

                                            {/* <Card.Subtitle>
                                                

                                            </Card.Subtitle> */}
                                        </div>
                                        <div className="ml-auto d-flex align-items-center">
                                            <Toggle eventKey={String(index)} />
                                        </div>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={String(index)}>
                                        <Card.Body className="p-0">
                                            <ListGroup className="list-group-flush">
                                                {disciplina.aulas?.map(aula =>
                                                    <ListGroup.Item key={String(aula.id)}>
                                                        <div className="d-flex justify-content-between">
                                                            <div className="name">
                                                                <span className="font-weight-bold mr-1">
                                                                    AULA {aula.ordem?.toString().padStart(2, '0')} -
                                                                </span>
                                                                <span>
                                                                    {aula.name}
                                                                </span>
                                                                <br />
                                                                <span className="font-weight-light">{aula.questoes} questões</span>
                                                            </div>
                                                            <Link to={`aula/${aula.id}`} className="btn">
                                                                <i className="fas fa-chevron-right"></i>
                                                            </Link>
                                                        </div>
                                                    </ListGroup.Item>
                                                )}
                                            </ListGroup>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            )}
                        </Accordion>
                    )
                    }
                </Container>
            </div>

        </React.Fragment>
    )
}

export interface EstudarProps { }