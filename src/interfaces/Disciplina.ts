import { Aula } from "./Aula";

export interface Disciplina {
    id: number;
    name: string;
    user_id?: string;
    concurso_id?: number;
    aulas: Aula[],
    arquivada: boolean,
    meta?: {
        aulas_count: number,
        questoes_count: number
    }
}
