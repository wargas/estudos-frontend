
export const options = () => {
    return {
        legend: {
            display: false
        },
        scales: {
            yAxes: [
                {
                    gridLines: {
                        display: false,
                        drawBorder: false,
                        drawTicks: true
                    },
                    ticks: {
                        beginAtZero: true,
                        display: false,
                        // max: 100
                    }
                }
            ],
            xAxes: [
                {
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        display: true,
                        fontColor: '#aaa',
                        fontSize: 10,
                        // callback: (value: Aula) => {
                        //     return 'AULA ' + value.ordem.toString().padStart(2, '0')
                        // }
                    }
                }
            ]
        },
        // tooltips: {
        //     callbacks: {
        //         footer: (item: any, data: any) => {
        //             const datas: any[] = data['datasets'][0]['data'];
        //             const value: number = item[0]['value']

        //             const position = datas.filter(d => d > value).length + 1;

        //             return `${position}ª de ${datas.length} aulas`
        //         },
        //         label: (item: any, data: any) => {
        //             return parseFloat(item['value']).toFixed(1).replace('.', ',') + '%'
        //         },
        //         title: (item: any[], data: any[]) => {

        //             return item[0]['xLabel']['name']
        //         }
        //     }
        // },
        
    }
}