import { Respondida } from "./Respondida";

export interface Questao {
    enunciado?: string;
    gabarito?: number;
    opcoes: Opcao[],
    respondidas?: Respondida[], 
    respondida?: boolean,
    status?: string
}

export interface Opcao { 
    letra?: string, 
    texto?: string, 
    correta?: boolean,
    status?: string,
    marcada?: boolean,
    riscada?: boolean
}