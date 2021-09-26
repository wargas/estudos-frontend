/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Aula, Historico } from '../../interfaces/Aula';
import { Bar } from 'react-chartjs-2';
import { options } from './options';
import { useHistory } from 'react-router-dom';
import { Disciplina } from 'src/interfaces/Disciplina';
import Axios from 'axios';

export const ChartNivelAula: React.FC<ChartNivelAulaProps> = ({ disciplina }) => {
    const [data, setData] = useState({});
    const history = useHistory();

    
    useEffect(() => {
        getAulas(disciplina?.id || 0)

    }, [disciplina])

    const handlerRedirect = (ev: any[]) => {
        if (ev.length) {
            const id = ev[0]['_model']['label']['id'];

            history.push(`aula/${id}`)
        }

    }

    const getAulas = (id: number) => {
        Axios.get<Aula[]>(`relatorios/questoes-media/${id}`)
            .then(({ data: _data }) => {
                fillData(
                    _data
                    .filter(aula => aula.questoes)
                    .sort((a, b) => {
                    if (a.ordem === b.ordem) {
                        return 0;
                    }
                    if (a.ordem > b.ordem) {
                        return 1
                    }
                    return -1

                }))
            })
    }

    const fillData = (aulas: Aula[]) => {

        if (aulas) {
            const labels: Aula[] = aulas
            const datasets: any[] = [{
                label: 'Nota',
                backgroundColor: aulas.map(a => '#607d8b'),
                data: aulas.map(aula => {
                    if (!aula.historico) {
                        return 0;
                    }
                    const last = aula?.historico.reduce<Historico>((acc, it) => {

                        if ((it.acertos + it.erros) < aula.questoes.length) {
                            return acc;
                        } 

                        if (acc.data === '') {
                            acc = it
                        }

                        if (it.data > acc.data) {
                            acc = it
                        }

                        return acc;
                    }, { data: '', acertos: 0, erros: 0 });

                    return last.acertos / (last.acertos + last.erros) * 100
                })
            }]

            const min = datasets[0].data.reduce((acc: number, current: number) => {
                
                if(acc > current) {
                    return current;
                }

                return acc;
            }, 100)

            datasets[0].data.forEach((d: number, i: number) => {
                if(d === min) {
                    datasets[0].backgroundColor[i] = '#607d8baa'
                }
            })           

            setData({ labels, datasets })
        }
    }

    return (
        <React.Fragment>
            <Bar
                height={50} data={data}
                onElementsClick={handlerRedirect}
                options={options()} />
        </React.Fragment>
    )
}

export interface ChartNivelAulaProps {
    disciplina?: Disciplina;
}
