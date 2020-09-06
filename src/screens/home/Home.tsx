import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Container } from 'react-bootstrap';
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
        <div className="content pt-3">
            <Container fluid >
                <Card className="elevation-1">
                    <Card.Header>
                        <Card.Title>Questões Respondidas</Card.Title>
                        <div className="card-tools">
                            <button 
                                onClick={() => setPercent(!percent) }
                                className={`btn btn-tool ${percent ? 'text-dark' : ''}`}>
                                <i className="fas fa-percent"></i>
                            </button>
                            <button className="btn btn-tool">
                                <i className="fas fa-sync"></i>
                            </button>

                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ChartQuestoesRespondidas percent={percent} />
                    </Card.Body>
                </Card>
            </Container>
            <Container fluid>
                <Card className="elevation-1">
                    <Card.Header>
                        <Card.Title>Tempo Estudado por Dia</Card.Title>
                        <div className="card-tools">
                            <button className="btn btn-tool">
                                <i className="fas fa-sync"></i>
                            </button>
                            <button className="btn btn-tool">
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <button className="btn btn-tool">
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ flexDirection: 'column', display: 'flex' }}>
                            <ChartTempoEStadudo />
                        </div>
                    </Card.Body>
                </Card>
            </Container>

            <Container fluid className="mt-3">
                <Card className="elevation-1">
                    <Card.Header>
                        <Card.Title>Nível por Aula</Card.Title>
                        <div className="card-tools">
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
                    </Card.Header>
                    <Card.Body>
                        <ChartNivelAula disciplina={(!!disciplina) ? disciplina.id : 0} />
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export interface HomeProps { }