import React, { useState, useEffect } from 'react';
import { Card, Container, Breadcrumb, Accordion, Spinner, useAccordionToggle, ListGroup } from 'react-bootstrap';
import { Disciplina } from '../../interfaces/Disciplina';
import { Api } from '../../Api';
import { Link } from 'react-router-dom';

export const Estudar: React.SFC<EstudarProps> = props => {

    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [loading, setLoading] = useState(false)

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

    return (
        <React.Fragment>
            <div className="content-header">
                <Container fluid>
                    <h1>Disciplinas</h1>
                </Container>
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
                                            <Card.Title>
                                                {disciplina.name}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                {String(disciplina.aulas?.length).padStart(2, "0")} aulas
                                            </Card.Subtitle>
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
                                                                <span className="font-weight-bolder mr-1">{aula.ordem?.toString().padStart(2, '0')}</span> 
                                                                {aula.name}
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