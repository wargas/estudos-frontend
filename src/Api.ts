import axios from 'axios';

export const Api = axios.create({
    baseURL: 'http://wargasteixeira.com.br:3333/api/'
})