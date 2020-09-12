import axios from 'axios';

export const Api = axios.create({
    baseURL: 'https://questoes.wargasteixeira.com.br/api/'
})