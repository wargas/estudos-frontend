import React from 'react';

import { DateTime } from 'luxon';
import { SecondsToTime } from '../tempo/secondsToTime';
import Axios from 'axios';

export default () => {

    const [dados, setDados] = React.useState<RankingTempo[]>([]);

    const getDados = async () => {
        try {
            const { data } = await Axios.get<RankingTempo[]>('relatorios/ranking-tempo-dia?limite=5');

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
                            {/* <p>Akgum texto</p> */}
                        </div>
                        <div>
                            <span className="badge badge">{SecondsToTime(item.tempo)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </React.Fragment>
    )
}

export interface RankingTempo  {
    data: string;
    tempo: number;
    position: number;
    hoje: boolean;
}