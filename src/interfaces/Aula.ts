import { Disciplina } from "./Disciplina";
import { Registro } from "./Registros";

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
    historico?: Historico[];
    registros?: Registro[];
    relatorio?: RelatorioItem[];
}

export interface RelatorioItem {
    aula_id: number,
    data: string,
    total: number,
    acertos: number
}

export interface Historico {
    data: string,
    acertos: number,
    erros: number
}