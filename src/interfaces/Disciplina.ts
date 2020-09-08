import { Aula } from "./Aula";

export interface Disciplina {
    "id": number;
    "name": string;
    "user_id"?: string;
    "concurso_id"?: number;
    "aulas": Aula[]
}
