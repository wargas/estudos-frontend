import React, { useState, useEffect, Fragment } from 'react';
import { Dropdown, Card, Col, Row } from 'react-bootstrap';
import { ChartTempoEStadudo } from '../../components/chart-tempo-estudado/ChartTempoEstudado';

import './Home.scss';
import { ChartNivelAula } from '../../components/chart-nivel-aula/ChartNivelAula';
import { Api } from '../../Api';
import { Disciplina } from '../../interfaces/Disciplina';
import { ChartQuestoesRespondidas } from '../../components/chart-questoes-respondidas/ChartQuestoesRespondidas';



export const Home: React.SFC<HomeProps> = () => {

    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [disciplina, setDisciplina] = useState<Disciplina>();
    const [percent, setPercent] = useState(true)

    useEffect(() => {
        getDisciplinas()

        
    }, [])

    const getDisciplinas = () => {
        Api.get<Disciplina[]>('disciplinas').then(({ data }) => setDisciplinas(data))
    }

    return (
        <Fragment>

            <Card className="">
                <Card.Body>
                    <div className="actions">
                        <div className="actions--item">
                            <button
                                onClick={() => setPercent(!percent)}
                                className={`btn btn-tool ${percent ? 'text-dark' : ''}`}>
                                <i className="fas fa-percent"></i>
                            </button>
                        </div>
                    </div>
                    <Card.Title>Questões Respondidas</Card.Title>
                    <ChartQuestoesRespondidas percent={percent} />
                </Card.Body>
            </Card>
            <Row>
                <Col xs={12}>
                    <Card className="">

                        <Card.Body>
                            <Card.Title>Tempo Estudado por Dia</Card.Title>
                            <div style={{ flexDirection: 'column', display: 'flex' }}>
                                <ChartTempoEStadudo />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
            </Row>


            <Card className="">
                <Card.Body>
                    <Card.Title>Nível por Aula</Card.Title>
                    <div className="actions">
                        <div className="actions--item">
                            <Dropdown>
                                <Dropdown.Toggle style={{ backgroundColor: 'white', border: 'none', color: '#000' }} variant="secondary" split>
                                    {(!!disciplina) ? disciplina.name : 'Selecione'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {disciplinas.map(disciplina =>
                                        <Dropdown.Item onClick={() => setDisciplina(disciplina)} key={String(disciplina.id)}>{disciplina.name}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <ChartNivelAula disciplina={(!!disciplina) ? disciplina.id : 0} />
                </Card.Body>
            </Card>

        </Fragment>
    )
}

export interface HomeProps { }