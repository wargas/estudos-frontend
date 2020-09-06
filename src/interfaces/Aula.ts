import { Disciplina } from "./Disciplina";

export interface Aula {
    id: number;
    name?: string;
    ordem: number;
    paginas?: number;
    markdown?: string;
    user_id?: number;
    concurso_id?: number;
    disciplina_id?: number;
    questoes: number;
    disciplina?: Disciplina;
    historico?: Historico[]
}

export interface Historico {
    data: string,
    acertos: number,
    erros: number
}