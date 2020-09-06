import React, { useState, useEffect } from 'react';
import { Respondida } from '../../interfaces/Respondida';
import { Api } from '../../Api';
import { Aula, Historico } from '../../interfaces/Aula';
import { Bar } from 'react-chartjs-2';
import { options } from './options';
import { useLocation, useHistory } from 'react-router-dom';

export const ChartNivelAula: React.FC<ChartNivelAulaProps> = ({ disciplina }) => {
    const [data, setData] = useState({});
    const history = useHistory();

    const token = 'last-disciplina-token';

    useEffect(() => {
        if(disciplina === 0) {
            const id = localStorage.getItem(token);
            if(id) {
                getAulas(parseInt(id))
            }
        } else {
            getAulas(disciplina);

            localStorage.setItem(token, disciplina.toString())
        }

    }, [disciplina])

    const handlerRedirect = (ev:any[]) => {
        if(ev.length) {
            const id = ev[0]['_model']['label']['id'];

            history.push(`aula/${id}`)
        }
        
    }

    const getAulas = (id: number) => {
        Api.get<Aula[]>(`relatorios/questoes-media/${id}`)
            .then(({ data: _data }) => {
                fillData(_data.sort((a, b) => {
                    if(a.ordem === b.ordem) {
                        return 0;
                    } 
                    if(a.ordem > b.ordem) {
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
                borderColor: '#eeeeee',
                borderWidth: 2,
                backgroundColor: '#efefef',
                data: aulas.map(aula => {
                    if(!aula.historico) {
                        return 0;
                    }
                    const last = aula?.historico.reduce<Historico>((acc, it) => {
                       
                        if((it.acertos + it.erros) < aula.questoes) {
                            return acc;
                        }

                        if(acc.data == '') {
                            acc = it
                        }
                       
                        if(it.data > acc.data) {
                            acc = it
                        }

                        return acc;
                    }, {data: '', acertos: 0, erros: 0});

                    return last.acertos / (last.acertos + last.erros) * 100
                })
            }]

            setData({ labels, datasets })
        }
    }

    return (
        <React.Fragment>
            <Bar height={75} data={data} onElementsClick={handlerRedirect} options={options()} />
        </React.Fragment>
    )
}

export interface ChartNivelAulaProps {
    disciplina: number;
}