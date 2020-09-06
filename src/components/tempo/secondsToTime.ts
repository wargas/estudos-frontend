export const SecondsToTime = (time:number) => {

    const hours = Math.floor(time/3600)
    const minutes = Math.floor((time - (hours*3600))/60)
    const seconds = time - (hours * 3600) - (minutes * 60)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}