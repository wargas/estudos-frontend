export interface Respondida {
    id: number;
    aula_id: number;
    horario: string; 
    questao: number;
    questao_id: number;
    resposta: string;
    gabarito: string;
    acertou: boolean;
}