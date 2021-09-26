import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import qs from "querystring";

import { Disciplina } from "src/interfaces/Disciplina";
import { CenterLoading } from "src/components/center-loading/CenterLoading";

import "./ListAula.scss";
import Axios from "axios";
import { AulaItem } from "./AulaItem";
import { useModal } from "src/contexts/ModalContext";
import { FormAula } from "./FormAula";
import { Aula as AulaInterface } from "src/interfaces";

export interface Aula extends AulaInterface {
  meta?: {
    questoes_count: number;
  };
  days: {
    data: string;
    acertos: number;
    erros: number;
    total: number;
    last: boolean;
  }[];
}

const ListAulas = () => {
  const [disciplina, setDisciplina] = useState<Disciplina>({} as Disciplina);
  const [aulas, setAulas] = useState<Aula[]>([]);

  const [orderBy, setOrderBy] = useState("ordem:asc");

  const [loading, setLoading] = React.useState(false);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();
  const [openModal] = useModal();

  React.useEffect(() => {
    loadDisciplina();
  }, [orderBy]);

  function handleSetOrderBy(
    coluna: "ordem" | "name" | "questoes" | "nota" | "last"
  ) {
    const [c = "ordem", o = "asc"] = orderBy.split(":");

    if (c === coluna) {
      setOrderBy(`${c}:${o === "asc" ? "desc" : "asc"}`);
    } else {
      setOrderBy(`${coluna}:asc`);
    }
  }

  const loadDisciplina = async () => {
    setLoading(true);
    try {
      const params = {
        disciplina_id: id,
        order_by: orderBy,
      };
      const [responseDisciplina, responseAulas] = await Promise.all([
        Axios.get(`disciplinas/${id}`),
        Axios.get(`aulas?${qs.stringify(params)}`),
      ]);

      setDisciplina(responseDisciplina.data);
      setAulas(responseAulas.data);
    } catch (error) {}
    setLoading(false);
  };

  const handleCloseForm = (result: any) => {
    if (result) {
      loadDisciplina();
    }
  };

  return (
    <React.Fragment>
      <div className="toolbar pl-3">
        <div className="actions ml-0 mr-2">
          <i
            onClick={() => history.push("/estudar")}
            style={{ fontSize: 12 }}
            className="actions__item fas fa-chevron-left"
          ></i>
        </div>
        <div className="toolbar__label">{disciplina?.name || "NOME"}</div>
        <div className="actions">
          <i
            onClick={() =>
              openModal(
                FormAula,
                {
                  title: "Adicionar Aula",
                  size: "md",
                  data: { disciplina_id: id },
                },
                handleCloseForm
              )
            }
            className="zmdi zmdi-plus actions__item"
          ></i>
          <i className="zmdi zmdi-refresh-alt actions__item"></i>
        </div>
      </div>
      <div
        style={{ position: "relative", minHeight: 200 }}
        className="card p-0"
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: "#ffffffaa",
            }}
          >
            <CenterLoading show={loading} />
          </div>
        )}

        <table className="table table-hover">
          <thead>
            <tr>
              <th onClick={() => handleSetOrderBy("ordem")}>
                <div className="d-flex">
                  Ordem
                  {orderBy.startsWith("ordem:") && (
                    <i
                      className={`text-muted ml-auto fas fa-chevron-${
                        orderBy.endsWith("asc") ? "down" : "up"
                      }`}
                    ></i>
                  )}
                </div>
              </th>
              <th onClick={() => handleSetOrderBy("name")}>
                <div className="d-flex">
                  Nome
                  {orderBy.startsWith("name:") && (
                    <i
                      className={`text-muted ml-auto fas fa-chevron-${
                        orderBy.endsWith("asc") ? "down" : "up"
                      }`}
                    ></i>
                  )}
                </div>
              </th>
              <th onClick={() => handleSetOrderBy("last")}>
                <div className="d-flex">
                  Última
                  {orderBy.startsWith("last:") && (
                    <i
                      className={`text-muted ml-auto fas fa-chevron-${
                        orderBy.endsWith("asc") ? "down" : "up"
                      }`}
                    ></i>
                  )}
                </div>
              </th>
              <th onClick={() => handleSetOrderBy("nota")}>
                <div className="d-flex">
                  Nota
                  {orderBy.startsWith("nota:") && (
                    <i
                      className={`text-muted ml-auto fas fa-chevron-${
                        orderBy.endsWith("asc") ? "down" : "up"
                      }`}
                    ></i>
                  )}
                </div>
              </th>
              <th colSpan={2} onClick={() => handleSetOrderBy("questoes")}>
                <div className="d-flex">
                  Questões
                  {orderBy.startsWith("questoes:") && (
                    <i
                      className={`text-muted ml-auto fas fa-chevron-${
                        orderBy.endsWith("asc") ? "down" : "up"
                      }`}
                    ></i>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {aulas.map((aula) => (
              <AulaItem key={aula.id + ""} aula={aula} />
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

export default ListAulas;
