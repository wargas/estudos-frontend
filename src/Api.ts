import axios from 'axios';

export const Api = axios.create({
    baseURL: 'http://157.245.218.108:3333/api'
})