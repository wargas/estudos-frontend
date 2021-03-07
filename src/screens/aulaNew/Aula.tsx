/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import Markdown from 'react-markdown';
import { Card, Row, Col, Button, ProgressBar, Spinner, Dropdown } from 'react-bootstrap';

import { Api } from 'src/Api';
import { Aula as AulaInterface, Questao, Registro, Respondida } from 'src/interfaces';

import './Aula.scss';
import { DateTime, Duration } from 'luxon';
import { Tempo } from 'src/components/tempo/Tempo';
import { useDialog } from 'src/components/dialog/Dialog';
import { ListQuestoes } from './ListQuestoes';
import { Comment } from 'src/components/comment/Comment';
import EditQuestao from 'src/components/edit-questao/EditQuestao';

export const Aula = () => {

    const [load, setLoad] = React.useState(0.0);
    const [loadingResponder, setLoadingResponder] = React.useState(false);
    const [aula, setAula] = React.useState<AulaInterface>({} as AulaInterface);
    const [questoes, setQuestoes] = React.useState<Questao[]>([]);
    const [respondidas, setRespondidas] = React.useState<Respondida[]>([]);
    const [current, setCurrent] = React.useState<Questao>({} as Questao);
    const [position, setPosition] = React.useState(-1);
    const [aba, setAba] = React.useState('questoes')
    const [dias, setDias] = React.useState<Dia[]>([])

    const { id } = useParams<{ id: string }>();
    const [DialogListQuestions, openDialogListQuestions] =
        useDialog(ListQuestoes, (result: number) => {
            if (result !== null) {
                setPosition(result);
            }
        });

    const [DialogEdit, openEdit] =
        useDialog(EditQuestao, async (result: Questao) => {
            if (result === null) {
                return;
            }
            await loadQuestoes();
            await loadRespondidas();
        })

    React.useEffect(() => {
        const loads = async () => {
            setLoad(0.1)
            await loadAula();
            setLoad(0.5)
            await loadQuestoes();
            setLoad(0.9)
            await loadRespondidas();
            setLoad(1)

            setPosition(0);
        }

        loads();

    }, [id])

    React.useEffect(() => {
        setQuestoes(old => old.map((questao, index) => {

            questao.respondidas = respondidas
                .filter(respondida => respondida.questao === index)

            const respostaHoje = questao.respondidas.find(respondida =>
                DateTime.fromISO(respondida.horario).hasSame(DateTime.local(), "day"))

            questao.resposta = respostaHoje;

            questao.respondida = !!respostaHoje;

            return questao;
        }));

        const _dias = respondidas.reduce<Dia[]>((acc, item) => {

            const _curDia = DateTime.fromISO(item.horario)

            const _exits = acc.some(it => it.data.hasSame(_curDia, "day"));

            if (_exits) {
                return acc.map(it => {
                    if (it.data.hasSame(_curDia, "day")) {
                        it.acertos += item.acertou ? 1 : 0;
                        it.total += 1;
                    }
                    return it;
                })
            }

            return [...acc, { data: _curDia, total: 1, acertos: item.acertou ? 1 : 0 }];
        }, [])
            .sort((a, b) => {

                if (a.data.toMillis() > b.data.toMillis())
                    return -1;

                if (a.data.toMillis() < b.data.toMillis())
                    return 1;

                return 0;
            });

        setDias(_dias)

    }, [respondidas])

    React.useEffect(() => {
        if (position > -1 && questoes.length >= position - 1)
            setCurrent(questoes[position])
    }, [position, respondidas])

    const loadAula = async () => {
        try {
            const { data } = await Api.get(`aulas/${id}`);


            setAula(data);
        } catch (error) {

        }
    }

    const loadQuestoes = async () => {
        try {
            const { data } = await Api.get(`questoes/${id}`);

            setQuestoes(data);

        } catch (error) {

        }
    }

    const loadRespondidas = async () => {
        try {
            const { data } = await Api.get(`respondidas/${id}`);

            setRespondidas(data);

        } catch (error) {

        }
    }

    const riscar = (opcao_id: number) => {
        setQuestoes(old => old.map((questao, pos) => {

            if (!current?.respondida && pos === position) {
                questao.opcoes = questao.opcoes.map((opcao, index) => {
                    if (index === opcao_id)
                        opcao.riscada = !opcao.riscada;

                    return opcao;
                })
            }

            return questao;
        }))
    }

    const marcar = (opcao_id: number) => {
        setQuestoes(old => old.map((questao, pos) => {

            if (pos === position) {
                questao.opcoes = questao.opcoes.map((opcao, index) => {
                    if (index === opcao_id) {
                        opcao.marcada = !opcao.marcada
                    } else {
                        opcao.marcada = false
                    }
                    return opcao;
                })
            }

            return questao;
        }))
    }

    const responder = async () => {

        const marcada = current?.opcoes.find(op => op.marcada);

        if (!marcada) {
            return;
        }

        const _data = {
            aula_id: aula.id,
            questao: position,
            resposta: current?.opcoes.indexOf(marcada)
        }

        if(current.gabarito === -1) {
            _data.resposta = -1
        }

        try {
            setLoadingResponder(true);
            const { data } = await Api.post(`questoes/responder`, _data);

            setRespondidas(old => [...old, data])
        } catch (error) {

        }
        setLoadingResponder(false);
    }

    const next = () => {
        if (questoes.length >= position - 1)
            setPosition(old => old + 1)
    }

    const prev = () => {
        if (position > 0)
            setPosition(old => old - 1)
    }

    if (load < 1) {
        return (
            <div className="p-5">
                <ProgressBar variant="danger" now={load * 100} />
            </div>
        )
    }

    return (
        <React.Fragment>

            <div className="toolbar">
                <div className="toolbar--label">
                    <h5 title={aula.name}>{String(aula.ordem).padStart(2, '0')} - {aula.name?.substring(0, 80)}{(aula.name?.length || 0) > 80 ? '...' : ''}</h5>
                    <Link className="text-dark" to={`/disciplinas/${aula?.disciplina_id}`}>{aula?.disciplina?.name}</Link>
                </div>
                <div className="actions">
                    <Tempo id={id} />
                </div>
            </div>
            <Row>
                <Col>
                    <Card>
                        <div className="toolbar toolbar--inner mb-0">
                            <div className="stats">
                                {current?.respondidas?.map((item, index) => (
                                    (current?.respondidas?.length || 0) - index <= 10 && (
                                        <div key={item.id} className={`stat ${item.acertou ? 'acertou' : 'errou'}`}></div>
                                    )
                                ))}
                                {
                                    (current?.respondidas?.length || 0) <= 10 &&
                                    Array(10 - (current?.respondidas?.length || 0)).fill('').map((item, index) => (
                                        <div key={index} className="stat nada"></div>
                                    ))
                                }
                            </div>
                            <div className="actions">
                                <button onClick={() => openEdit({ ...current, aula_id: id })} className="btn actions__item">
                                    <i className="zmdi zmdi-code"></i>
                                </button>
                                <button disabled={position === 0} onClick={prev} className="btn actions__item">
                                    <i className="zmdi zmdi-arrow-left"></i>
                                </button>
                                <button
                                    onClick={() => openDialogListQuestions({ dias, questoes })}
                                    className="btn">{position + 1} / {questoes.length}</button>

                                <button disabled={questoes.length === position + 1} onClick={next} className="btn actions__item">
                                    <i className="zmdi zmdi-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                        <Card.Body className="p-0">
                            <Markdown
                                allowDangerousHtml
                                className="enunciado px-4 pt-3"
                                children={current?.enunciado?.replace(/\n/g, "\n\n") || ""} />
                            <div className="px-4 pt-3">
                                {current?.opcoes?.map((opcao, opcao_id) => (
                                    <div key={opcao.letra} className="d-flex  flex-row align-items-center mb-2">
                                        <div className="mr-2">
                                            {!current?.respondida && (
                                                <Button
                                                    onClick={() => marcar(opcao_id)}
                                                    variant={opcao.marcada ? 'info' : 'light'} style={{ width: 40 }}>{opcao.letra}</Button>
                                            )}
                                            {current?.respondida && (
                                                <Button
                                                    variant={
                                                        current?.resposta?.resposta === opcao_id ?
                                                            current?.resposta?.gabarito === opcao_id ? 'success' : 'danger'
                                                            :
                                                            current?.resposta?.gabarito === opcao_id ? 'outline-success' : 'light'
                                                    } style={{ width: 40 }}>{opcao.letra}</Button>
                                            )}
                                        </div>
                                        <div
                                            onClick={() => riscar(opcao_id)}
                                            className="d-flex align-items-center"
                                            style={{ opacity: opcao?.riscada ? 0.2 : 1, cursor: 'pointer' }}>
                                            <Markdown
                                                allowDangerousHtml
                                                children={opcao.texto || ""} />
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </Card.Body>
                        <Card.Body className="d-flex border-top mt-3 px-4 py-3">
                            <Button
                                onClick={responder}
                                disabled={current?.opcoes?.every(it => !it.marcada) || current?.respondida}>
                                {loadingResponder ?
                                    <Spinner animation="border" size="sm" /> :
                                    <span>RESPONDER</span>}
                            </Button>

                        </Card.Body>
                    </Card>
                    {current?.respondida && (
                        <Card>
                            <Card.Body>
                                <Comment questao={current} />
                            </Card.Body>
                        </Card>
                    )}
                </Col>
                <Col md={3} >
                    <Card>
                        <div className="toolbar toolbar--inner mb-0">
                            <div className="toolbar__nav">
                                <a style={{ cursor: 'pointer' }} onClick={() => setAba('questoes')}>QUESTÕES</a>
                                <a style={{ cursor: 'pointer' }} onClick={() => setAba('tempo')}>TEMPO</a>
                            </div>
                            <div className="actions">
                                <Dropdown>
                                    <Dropdown.Toggle className="no-caret" as={'div'}>
                                        <i className="actions__item zmdi zmdi-more-vert"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => loadRespondidas()} className="d-flex align-items-center">
                                            <i className="zmdi zmdi-refresh mr-3"></i>
                                            <div>Atualizar</div>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        {aba === 'tempo' && (
                            <Card.Body className="p-0">
                                <div className="listview listview--bordered">
                                    {aula.registros?.reduce<Registro[]>((acc, item) => {
                                        const itemHorario = DateTime.fromISO(item.horario || '');

                                        if (acc.some((_acc) => itemHorario.hasSame(DateTime.fromISO(_acc.horario || ''), "day"))) {
                                            return acc
                                        }

                                        return [...acc, item];
                                    }, [])
                                        .map(dia => {

                                            dia.tempo = (aula.registros || [])
                                                .filter(_dia => DateTime.fromISO(_dia.horario || '').hasSame(DateTime.fromISO(dia.horario || ""), "days"))
                                                .reduce((acc, item) => {
                                                    return acc + (item.tempo || 0);
                                                }, 0)

                                            return dia;
                                        })
                                        .filter(registro => {
                                            return (registro.tempo || 0) > 60
                                        })
                                        .sort((a, b) => {

                                            if (DateTime.fromISO(a.horario || '').toMillis() > DateTime.fromISO(b.horario || '').toMillis()) {
                                                return -1;
                                            } else {
                                                return 1;
                                            }
                                        })
                                        .map(registro => (
                                            <div className="listview__item">

                                                <div className="listview__content">
                                                    <div className="listview-heading">
                                                        {DateTime.fromISO(registro.horario || '').toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="badge badge-light">
                                                        {Duration.fromObject({ seconds: registro.tempo }).toFormat("hh:mm:ss")}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </Card.Body>
                        )}
                        {aba === 'questoes' && (
                            <Card.Body className="p-0">
                                <div className="listview listview--bordered">
                                    {dias.map(dia => (
                                        <div key={dia.data.toMillis()} className="listview__item py-3">
                                            <div className="listview__content">
                                                <div className="listview-heading">{dia.data.toFormat('dd/MM/yyyy')}</div>
                                                <p>{dia.acertos}/{dia.total}</p>
                                            </div>
                                            <div>
                                                <span className="badge badge-light">{Math.floor(dia.acertos / dia.total * 1000) / 10}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        )}

                    </Card>
                </Col>
            </Row>

            {DialogListQuestions({
                title: "Questões da Aula",
                centered: true,
                size: "lg"
            })}

            {DialogEdit({
                title: "Editar Questão",
                centered: true,
                size: "lg"
            })}
        </React.Fragment>
    )
}

export interface Dia {
    data: DateTime,
    acertos: number,
    total: number,
}