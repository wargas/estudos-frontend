import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Container, Card } from 'react-bootstrap';
import { Aula as AulaInterface } from '../../interfaces/Aula';
import { Api } from '../../Api';
import { Questao } from '../../interfaces/Questao';

import './Aula.scss';
import { Questoes } from './Questoes';
import { Respondida } from '../../interfaces/Respondida';

export const Aula: React.FC<AulaProps> = props => {

    const { id } = useParams<AulaParams>();
    const [loading, setLoading] = useState(false);
    const [loadingReposta, setLoadingResposta] = useState(false);
    const [aula, setAula] = useState<AulaInterface>();
    const [questoes, setQuestoes] = useState<Questao[]>([]);
    const [respondidas, setRespondidas] = useState<Respondida[]>([]);
    

    useEffect(() => {
        getAula();
    }, [])

    const getAula = () => {
        setLoading(true)
        Api.get<AulaInterface>(`aulas/${id}`)
            .then(({ data }) => {
                setAula(data);
                getQuestoes(data.id || 0)
            })
            .catch(() => setLoading(false))
    }

    const getQuestoes = (aula_id: number) => {
        setLoading(true)
        Api.get<Questao[]>(`questoes/${aula_id}`)
            .finally(() => setLoading(false))
            .then(({ data }) => {
                getRespondidas(aula_id, data);
            })
    }

    const getRespondidas = (aula_id: number, _questoes: Questao[]) => {
        setLoading(true)
        Api.get<Respondida[]>(`respondidas/${aula_id}`)
            .finally(() => setLoading(false))
            .then(({ data }) => {
                setRespondidas(data);

                setQuestoes(_questoes.map((questao, index) => {
                    questao.respondidas = data.filter(item => item.questao == index)
                    return questao;
                }))
            })
    }

    const handleResponse = useCallback((questao_index, opcao_index) => {

        setLoadingResposta(true)

        const data = {
            aula_id: aula?.id,
            questao: questao_index,
            resposta: opcao_index
        }

        Api.post<Respondida>(`questoes/responder`, data)
            .then(({ data }) => {

                setQuestoes(questoes.map((questao, i) => {
                    if (i === questao_index) {
                        questao.respondida = true;

                        questao.status = data.acertou ? 'correta' : 'errada'

                        if (questao.respondidas?.length) {
                            questao.respondidas.push(data)
                        } else {
                            questao.respondidas = [data]
                        }

                        setRespondidas([...respondidas, data])
                    }
                    return questao;
                }))
            }).finally(() => setLoadingResposta(false));
    }, [questoes, respondidas])


    return (
        <React.Fragment>
            <div className="toolbar">
                <div className="toolbar--label" style={{ textTransform: 'uppercase' }}>
                    <h5>{aula?.ordem?.toString().padStart(2, '0')}. {aula?.name}</h5>
                    <span>{aula?.disciplina?.name}</span>
                </div>
            </div>
            {loading &&
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            }

            {!loading &&
                <Questoes
                    aula={aula as AulaInterface}
                    respondidas={respondidas}
                    loading={loadingReposta}
                    onHasReponse={handleResponse}
                    questoes={questoes} />
            }


        </React.Fragment>
    )
}

export interface AulaProps { }
export interface AulaParams {
    id: string;
}