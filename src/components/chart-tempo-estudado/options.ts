import { SecondsToTime } from "../tempo/secondsToTime";

export const options = {
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
                    display: false
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
                    fontSize: 10
                }
            }
        ]
    },
    tooltips: {
        callbacks: {
            label: (item:any) => {
                const value = item['value'];

                return SecondsToTime(value)
            }
        }
    }

}