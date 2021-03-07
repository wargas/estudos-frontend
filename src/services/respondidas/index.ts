import { DateTime } from 'luxon';
import {Respondida} from '../../interfaces/Respondida';

export function respondidasByDay(respondidas: Respondida[]) {
    type dayInterface = {
        day: DateTime,
        items: Respondida[],
        acertos: number,
        erros: number
    }
    let days: dayInterface[] = [];

    respondidas.forEach(item => {
        const currentDate = DateTime.fromISO(item.horario);
        
        const contain = days.find(day => day.day.hasSame(currentDate, 'day'));

        if(!contain) {
            days.push({day: currentDate, items: [item], acertos: 0, erros: 0})
        } else {
            days = days.map(d => {
                if(d.day.hasSame(currentDate, 'day')) {
                    d.items.push(item)
                }

                return d;
            })
        }
    })

    return days.map(day => {
        day.acertos = day.items.reduce((acc, it) => {

            if(it.acertou) {
                acc = acc + 1
            }
            return acc;
        }, 0);
        day.erros = day.items.length - day.acertos;
        return day;
    }).sort((a, b) => {
        if(a.day > b.day) {
            return 1;
        } else {
            return -1
        }
    });
}

export default {
    respondidasByDay
}