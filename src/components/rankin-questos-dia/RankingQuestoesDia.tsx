import React from 'react';
import { Api } from 'src/Api'; 

import { DateTime } from 'luxon';

export default () => {

    const [dados, setDados] = React.useState<QuestoesDia[]>([]);

    const getDados = async () => {
        try {
            const { data } = await Api.get<QuestoesDia[]>('relatorios/ranking-questoes-dia?limite=5');

            setDados(data)
        } catch (error) {

        }
    }

    React.useEffect(() => {
        getDados()
    }, [])


    return (
        <React.Fragment>
            <div className="listview listview--bordered">
                {dados.map((item, index) => (
                    <div key={index} className="listview__item px-3">
                        <i className={`avatar-char bg-secondary`}>{item?.position || 0}º</i>
                        <div className="listview__content">
                            <div className="listview__heading">
                                {item.hoje ? 'hoje' : DateTime.fromISO(item.data).toFormat('dd/MM/yyyy')}
                            </div>
                            <p>{Math.floor(item.acertos / item.total * 100)}% de acerto</p>
                        </div>
                        <div>
                            <span className="badge badge-secondary">{item.total}</span>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}

export interface QuestoesDia {
    data: string;
    total: number;
    acertos: number;
    position?: number;
    hoje?: boolean;
}