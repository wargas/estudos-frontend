/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import { useApp } from 'src/contexts/AppContext';
import { Aula } from 'src/interfaces/Aula';
import { Disciplina } from 'src/interfaces/Disciplina';

import svgEmpty from '../../assets/empty.svg';
import './ListAula.scss';
import Axios from 'axios';

const KEY_LS_ORDERBY = 'orderby_aulas';
const KEY_LS_SHOW_RESPONDIDAS = 'show_aulas_respondidas';


const ListAulas = () => {
    const [disciplina, setDisciplina] = React.useState<Disciplina>({} as Disciplina);
    const [orderBy, setOrderBy] = React.useState(localStorage.getItem(KEY_LS_ORDERBY) || 'ordem');
    const [showRespondidas, setShowRespondidas] = React.useState(localStorage.getItem(KEY_LS_SHOW_RESPONDIDAS) || false);
    const [aulas, setAulas] = React.useState<Aula[]>([]);
    const [loading, setLoading] = React.useState(false);
    const { id } = useParams<{ id: string }>();

    const history = useHistory()

    React.useEffect(() => {
        loadAulas();
    }, [])

   
    React.useEffect(() => {
        localStorage.setItem(KEY_LS_ORDERBY, orderBy)
    }, [orderBy])


    React.useEffect(() => {
        if (showRespondidas) {
            localStorage.setItem(KEY_LS_SHOW_RESPONDIDAS, "true")
        } else {
            localStorage.removeItem(KEY_LS_SHOW_RESPONDIDAS);
        }
    }, [showRespondidas])




    const filterAulas = (_aula: Aula) => {
        if (!showRespondidas) {
            return !_aula.relatorio?.some(item => DateTime.fromISO(item.data)
                .hasSame(DateTime.local(), "day"))
        }

        return true;
    }

    const loadAulas = async () => {
        try {
            setLoading(true);
            const { data } = await Axios.get<Aula[]>(`relatorios/respondidas-por-disciplina/${id}`);

            setAulas(data)
        } catch (error) {

        }

        setLoading(false);
    }

    return (
        <React.Fragment>
            <div className="card">
                <div className="toolbar toolbar--inner mb-0">
                    <div className="toolbar--label">
                        <h5>{disciplina.name || '...'}</h5>
                        <span className="text-muted">{aulas.length} aulas</span>
                    </div>
                    <div className="actions">
                        <span className="badge">Mostrar</span>
                        <span
                            onClick={() => setShowRespondidas(old => !old)}
                            className={`badge badge-item mx-1 badge-${showRespondidas ? 'success' : 'light'}`}>Respondidas hoje</span>
                        <span className="badge ml-3">Ordenar</span>
                        <span
                            onClick={() => setOrderBy('ordem')}
                            className={`badge badge-item mx-1 badge-${orderBy === 'ordem' ? 'success' : 'light'}`}>Por ordem</span>
                        <span
                            onClick={() => setOrderBy('data')}
                            className={`badge badge-item mx-1 badge-${orderBy === 'data' ? 'success' : 'light'}`}>Por data</span>
                        <span
                            onClick={() => setOrderBy('nota')}
                            className={`badge badge-item mx-1 badge-${orderBy === 'nota' ? 'success' : 'light'}`}>Por nota</span>

                    </div>

                </div>

            </div>
            <div className="card">
                <div className="card-body p-0">
                    {loading && (
                        <div className="d-flex p-5 align-items-center justify-content-center">
                            <Spinner animation="border" />
                        </div>
                    )}
                    {aulas.filter(filterAulas).length > 0 && (
                        <div className="listview listview--bordered">
                            {aulas
                                .map(aula => {

                                    const datas = aula.relatorio?.map(item => DateTime.fromISO(item.data).toMillis()) || [];

                                    const maxDate = DateTime.fromMillis(Math.max(...datas))

                                    const last = aula.relatorio?.find(item => DateTime.fromISO(item.data).hasSame(maxDate, "day"))

                                    if (!last) {
                                        return { ...aula, nota: 0, last: null }
                                    } else {
                                        return { ...aula, last, nota: Math.floor(last.acertos / last.total * 100) / 100 }
                                    }
                                })
                                .filter(filterAulas)
                                .sort((a, b) => a.ordem - b.ordem)
                                .sort((a, b) => {
                                    if (orderBy === 'nota') {
                                        return a.nota - b.nota;
                                    }

                                    return 0;
                                })
                                .sort((a,b) => {
                                    if(orderBy === 'data') {
                                        return DateTime.fromISO(a.last?.data || '').toMillis() - DateTime.fromISO(b.last?.data || '').toMillis()
                                    }

                                    return 0;
                                })
                                .map(aula => (
                                    <div key={aula.id} className="listview__item pl-3">
                                        <i className="avatar-char bg-green">{String(aula.ordem).padStart(2, '0')}</i>
                                        <div className="listview__content">
                                            <div className="listview__heading">
                                                <span>{aula.name}</span>
                                            </div>
                                            <div className="listview__attrs">
                                                <span>{aula.questoes} questões </span>
                                                {aula.last && (
                                                    <>
                                                        <span>{DateTime.fromISO(aula.last?.data || '').toFormat('dd/MM/yyyy')}</span>
                                                        <span>{(aula.nota * 100).toFixed(0)}% de acerto</span>
                                                        <span>respondida {aula.relatorio?.length} veze(s)</span>
                                                    </>
                                                )}
                                                {!aula.last && <span>Nunca respondeu</span>}
                                            </div>
                                        </div>
                                        <div className="actions listview__actions">
                                            <i onClick={() => history.push(`/aula/${aula.id}`)} className="actions__item zmdi zmdi-arrow-right"></i>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                    {aulas.filter(filterAulas).length === 0 && !loading && (
                        <div className="d-flex flex-column p-5 align-items-center justify-content-center">
                            <img width={400} src={svgEmpty} alt="" />

                            <h5 className="d-flex text-muted mt-5">Nenhum aula encontrada!</h5>
                        </div>
                    )}
                </div>
            </div>

        </React.Fragment>
    )
}

export default ListAulas;