import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AulaParams } from '../../screens/aula/Aula';
import { SecondsToTime } from './secondsToTime';
import { isNull } from 'util';
import { Aula } from '../../interfaces/Aula';
import { Registro } from '../../interfaces/Registros';
import { Api } from '../../Api';
import { Spinner } from 'react-bootstrap';
import { AxiosResponse } from 'axios';
import { useKey } from '../../hooks';

export const Tempo: React.SFC<TempoProps> = props => {
    const { id } = useParams<AulaParams>();
    const [play, setPlay] = useState(false);
    const [secounds, setSeconds] = useState(0);
    const [aula, setAula] = useState<Aula>();
    const [registro, setRegistro] = useState<Registro>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getAula(id);
    }, [id])

    useEffect(() => {
        let interval: NodeJS.Timeout = setInterval(() => { }, 1000);
        if (play) {
            interval = setInterval(() => {
                setSeconds(secounds + 1)
                if (secounds % 60 === 0) {
                    handleSave()
                }
            }, 1000)
        } else {
            if (!isNull(interval))
                clearInterval(interval)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [play, secounds])

    useKey(" ", () => setPlay(!play))

    const handleSave = () => {
        setLoading(true)
        let request: Promise<AxiosResponse<Registro>>;
        let data = { tempo: secounds, ...registro };
        data.tempo = secounds;

        if (registro?.id) {
            request = Api.put<Registro>(`registros/${registro.id}`, data)
        } else {
            request = Api.post<Registro>(`registros`, data)
        }

        request.then(({ data }) => {
            setRegistro(data)
        })

        request.finally(() => setLoading(false))
    }

    const getAula = (id: string) => {
        Api.get<Aula>(`aulas/${id}`)
            .then(({ data }) => {
                setAula(data);
                setRegistro({
                    aula_id: data.id,
                    disciplina_id: data.disciplina_id,
                    tempo: 0
                })
            })
    }



    if (!aula?.id) {
        return (
            <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" />
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="d-flex align-items-center justify-content-between p-3">
                <div className="tempo mx-3">
                    <h3 className="p-0 m-0 text-bold">{SecondsToTime(secounds)}</h3>
                </div>
                <div className="actions">
                    <button onClick={ev => setPlay(!play)} className="btn">
                        {play && <i className="fas fa-pause"></i>}
                        {!play && <i className="fas fa-play"></i>}
                    </button>
                    <button onClick={handleSave} className="btn">
                        {!loading && <i className="fas fa-check"></i>}
                        {loading && <Spinner size="sm" animation="border" />}
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export interface TempoProps { }