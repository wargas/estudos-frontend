import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { options } from './options';
import { Api } from '../../Api';
import { DateTime } from 'luxon';


export const ChartQuestoesRespondidas: React.FC<ChartQuestoesRespondidasProps> = (percent) => {
    const [data, setData] = useState<any>({});
    const [dados, setDados] = useState<QuestoesDia[]>([]);

    useEffect(() => getDados(), [])

    useEffect(() => fillData(dados), [percent])

    const getDados = () => {
        Api.get<QuestoesDia[]>('relatorios/questoes-por-dia')
            .then(({ data:_data }) => {
                setDados(_data);
                fillData(_data)
            })
    }

    const fillData = (_data: QuestoesDia[]) => {
        const inicio = DateTime.local().minus({ days: 15 });

        const dates = Array(15).fill(1).map((item, i) => {
            return inicio.plus({ days: i + 1 })
        });

        setData({
            labels: dates.map(d => d.toFormat('dd/MM')),
            datasets: datasets(dates, _data)
        })
    }

    const datasets = (dates: DateTime[], _data: QuestoesDia[]) => {
        const acertos = dates.map(d => {
            const item = _data.find(_d => d.hasSame(DateTime.fromISO(_d.data), 'day'));

            if (item) {
                return item.acertos;
            }
            return 0;
        });

        const erros = dates.map(d => {
            const item = _data.find(_d => d.hasSame(DateTime.fromISO(_d.data), 'day'));

            if (item) {
                return item.total - item.acertos;
            }
            return 0;
        })

        const total = dates.map(d => {
            return _data.find(_d => d.hasSame(DateTime.fromISO(_d.data), 'day'))?.total;
        })

        const percentage = dates.map(d => {

            const item = _data.find(_d => d.hasSame(DateTime.fromISO(_d.data), 'day'));

            if (item) {
                return item.acertos / item.total * 100
            }
            return 0;
        });
        
        if (percent.percent) {
            return [
                {
                    type: 'line',
                    label: 'Acertos',
                    borderColor: 'black',
                    borderWidth: 3,
                    backgroundColor: '#efefef00',
                    data: percentage, 
                },
            ]
        }

        return [
            {
                type: 'line',
                label: 'Acertos',
                borderColor: '#28a745',
                borderWidth: 2,
                backgroundColor: '#efefef00',
                data: acertos
            },
            {
                type: 'line',
                label: 'Erros',
                borderColor: '#dc3545',
                borderWidth: 2,
                backgroundColor: '#efefef00',
                data: erros
            },
            {
                type: 'bar',
                label: 'Total',
                borderColor: '#efefefaa',
                borderWidth: 2,
                backgroundColor: '#efefefff',
                data: total
            }
        ]
    }

    return (
        <React.Fragment>
            <Bar
                height={75}
                data={data}
                options={options()} />
        </React.Fragment>
    )
}

export interface ChartQuestoesRespondidasProps {
    percent: boolean
}
export interface QuestoesDia {
    data: string;
    total: number;
    acertos: number;
}