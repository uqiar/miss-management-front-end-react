import moment from 'moment'

export const formateDate=(date)=>{
    return moment(date).format("DD-MMM-YYYY")
}

export const roundeNumber=(number)=>{
    return Math.round((number + Number.EPSILON) * 100) / 100
}