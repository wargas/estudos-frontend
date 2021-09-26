import { Respondida } from "./Respondida";

export interface Questao {
    id: number
    enunciado: string;
    gabarito?: string;
    questao_id: number;
    aula_id: number;
    alternativas: Alternativa[],
    respondidas?: Respondida[], 
    respondida?: boolean,
    status: string,
    resposta: string,
}

export interface Alternativa { 
    letra: string, 
    conteudo?: string, 
    correta?: boolean,
    status?: string,
    marcada?: boolean,
    riscada?: boolean
}