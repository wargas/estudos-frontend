import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { options } from './options';
import { DateTime } from 'luxon';
import { Api } from '../../Api';

export const ChartTempoEStadudo: React.SFC<ChartTempoEStadudoProps> = props => {

    const [data, setData] = useState({});

    useEffect(() => { getDados() }, [])

    
    const getDados = () => {
        Api.get<Response[]>('relatorios/tempo-por-dia')
            .then(({ data: _data }) => {
                fiilData(_data)
            })
    }


    const fiilData = (_data: Response[]) => {
        const inicio = DateTime.local().minus({ days: 15 });

        const dates = Array(15).fill(1).map((item, i) => {
            return inicio.plus({ days: i + 1 })
        });

        const tempos = dates.map(d => {
            const current = _data.find(c => d.hasSame(DateTime.fromISO(c.data), 'day'));

            if(current) {
                return current.tempo
            }

            return 0;
        })
        setData({
            labels: dates.map(d => d.toFormat('dd/MM')),
            datasets: [
                {
                    type: 'bar',
                    label: 'Tempo por Dia',
                    data: tempos,
                    borderColor: '#eeeeeeaa',
                    borderWidth: 2,
                    backgroundColor: '#eeeeeeaa'
                },
                {
                    label: 'Meta para o dia (03:00:00)',
                    borderColor: 'black',
                    data: Array(15).fill(10800),
                    backgroundColor: '#00000000',
                    type: 'line',
                    pointBorderWidth: 0,
                    borderDash: [1, 5],
                    borderWidth: 1,
                    pointBackgroundColor: '#00000000',
                    pointBorderColor: '#00000000',
                    fill: true
                }
            ]
        })
    }

    return (
        <React.Fragment>
            <div className="chart" style={{ display: 'block', flex: 1 }}>
                <Bar data={data} height={75} options={options} />
            </div>
        </React.Fragment>
    )
}
export interface ChartTempoEStadudoProps { }
export interface Response {
    data: string,
    tempo: number
}