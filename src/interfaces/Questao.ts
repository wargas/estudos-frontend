import { Respondida } from "./Respondida";

export interface Questao {
    enunciado: string;
    gabarito?: number;
    questao_id: number;
    aula_id: number;
    opcoes: Opcao[],
    respondidas?: Respondida[], 
    respondida?: boolean,
    status?: string,
    resposta?: Respondida
}

export interface Opcao { 
    letra?: string, 
    texto?: string, 
    correta?: boolean,
    status?: string,
    marcada?: boolean,
    riscada?: boolean
}