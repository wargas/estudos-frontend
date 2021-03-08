/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { options } from './options';
import { DateTime } from 'luxon';
import { Card } from 'react-bootstrap';
import Axios from 'axios';


export const ChartQuestoesRespondidas: React.FC<ChartQuestoesRespondidasProps> = () => {
    const [data, setData] = useState<any>({});
    const [dados, setDados] = useState<QuestoesDia[]>([]);
    const [metrica, setMetrica] = useState(metricas[0]);

    const [percent, setPercent] = useState(false);

    useEffect(() => getDados(), [percent, metrica])

    useEffect(() => fillData(dados), [percent, metrica])

    const getDados = () => {
        Axios.get<QuestoesDia[]>(metrica.api)
            .then(({ data: _data }) => {

                const formatedData = _data.map(item => {
                    item.data = metrica.inputFormat(item.chave);
                    return item;
                })

                setDados(formatedData);
                fillData(formatedData)
            })
    }

    const fillData = (_data: QuestoesDia[]) => {
        setData({
            labels: metrica.dates().map(d => d.toFormat(metrica.outputFormat)),
            datasets: datasets(metrica.dates(), _data)
        })
    }

    const datasets = (dates: DateTime[], _data: QuestoesDia[]) => {
        const acertos = dates.map(d => {
            const item = _data.find(_d => d.hasSame(_d.data, metrica.key as "day"));

            if (item) {
                return item.acertos; 
            }
            return 0;
        });

        const erros = dates.map(d => {
            const item = _data.find(_d => d.hasSame(_d.data, metrica.key as "day"));

            if (item) {
                return item.total - item.acertos;
            }
            return 0;
        })

        const total = dates.map(d => {
            return _data.find(_d => d.hasSame(_d.data, metrica.key as "day"))?.total;
        })

        const percentage = dates.map(d => {
            const item = _data.find(_d => d.hasSame(_d.data, metrica.key as "day"));

            if (item) {
                return Math.floor(item.acertos / item.total * 100)
            }
            return 0;
        });

        if (percent) {
            return [
                {
                    type: 'line',
                    label: 'Acertos',
                    borderColor: '#607d8b',
                    borderWidth: 3,
                    backgroundColor: '#607d8b11',
                    data: percentage,
                },
            ]
        }

        return [
            {
                type: 'line',
                label: 'Acertos',
                borderColor: '#32c787',
                borderWidth: 2,
                backgroundColor: '#efefef00',
                data: acertos
            },
            {
                type: 'line',
                label: 'Erros',
                borderColor: '#ff6b68',
                borderWidth: 2,
                backgroundColor: '#efefef00',
                data: erros
            },
            {
                type: 'bar',
                label: 'Total',
                borderColor: '#2196f315',
                borderWidth: 2,
                backgroundColor: '#607d8b',
                data: total
            }
        ]
    }

    return (
        <React.Fragment>
            <div className="d-flex">
                <Card.Title>Questões Respondidas</Card.Title>
                <div className="ml-auto">
                    <span
                        onClick={() => setPercent(old => !old)}
                        style={{ cursor: 'pointer', borderRadius: 15 }}
                        className={`badge badge-${percent ? 'secondary' : 'light'} ml-2 mr-3`}>%</span>
                    {metricas.map(m => (
                        <span key={m.key}
                            onClick={() => setMetrica(m)}
                            style={{ cursor: 'pointer', borderRadius: 15 }}
                            className={`badge badge-${metrica.key === m.key ? 'secondary' : 'light'} ml-2`}>{m.label}</span>
                    ))}
                </div>
            </div>
            <Bar
                height={60}
                data={data}
                options={options()} />
        </React.Fragment>
    )
}

export interface ChartQuestoesRespondidasProps {
    
}
export interface QuestoesDia {
    data: DateTime;
    chave: string,
    total: number;
    acertos: number;
    position?: number;
    hoje?: boolean;
}

const metricas = [
    {
        api: "views/count_respondidas_dia",
        key: "day",
        label: "DIÁRIO",
        inputFormat: (value: string): DateTime => {
            return DateTime.fromISO(value);
        },
        outputFormat: "dd/M",
        dates: () => {
            const inicio = DateTime.local().minus({ day: 15 });
            return Array(15).fill(1).map((item, i) => {
                return inicio.plus({ day: i + 1 })
            });
        }
    },
    {
        api: "views/count_respondidas_mes",
        key: "month",
        label: "MENSAL",
        inputFormat: (value: string): DateTime => {
            return DateTime.fromFormat(value, "yyM")
        },
        outputFormat: "MM/yyyy",
        dates: () => {
            const inicio = DateTime.local().minus({ month: 15 });
            return Array(15).fill(1).map((item, i) => {
                return inicio.plus({ month: i + 1 })
            });
        }
    }
]