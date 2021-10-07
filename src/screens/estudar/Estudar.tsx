import React, { useEffect, useState } from "react";
import qs from "query-string";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import Axios from "axios";

import { useModal } from "src/contexts/ModalContext";
import { FormDisciplina } from "./FormDisciplian";
import { Disciplina } from "../../interfaces/Disciplina";
import { CenterLoading } from "src/components/center-loading/CenterLoading";
import { toast } from "react-toastify";

export default function Estudar() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState("");
  const [search, setSeach] = useState("");
  const [showArquivadas, setShowArquivadas] = useState(false);

  const [openModal] = useModal();

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const loadDisciplinas = async () => {
    setLoading(true);

    toast.loading('Carregando disciplinas', {toastId: 'loadDisciplinas', position: 'top-right'})
    try {
      const query = {
        whereArquivada: 0,
        countAulas: true,
        countQuestoes: true,
        search: search,
      };
      const { data } = await Axios.get(`disciplinas?${qs.stringify(query)}`);

      setDisciplinas(data);

      handlerSetOrder("name");
    } catch (error) {}
    setLoading(false);
    toast.dismiss('loadDisciplinas')
  };

  const handlerSetOrder = (_order: "name" | "aulas") => {
    setDisciplinas((old) => {
      return old.sort((a, b) => {
        const itemA = a[_order];
        const itemB = b[_order];

        if (itemA > itemB) {
          return 1;
        }

        return -1;
      });
    });

    setOrder(_order);
  };

  const handleCloseSave = (response: any) => {
    if (response) {
      loadDisciplinas();
    }
  };

  return (
    <React.Fragment>
      <div className="toolbar">
        <div className="d-flex" style={{ flexGrow: 0.5 }}>
          <div className="form-group mb-0 bg-light" style={{ flexGrow: 1 }}>
            <input
              onChange={(ev) => setSeach(ev.target.value)}
              value={search}
              placeholder="Filtrar por nome..."
              type="text"
              className="form-control bg-light"
            />
          </div>
          <button onClick={loadDisciplinas} className="btn btn-light">
            <i className="zmdi zmdi-search"></i>
          </button>
        </div>

        <div className="actions">
          <i
            onClick={() =>
              openModal(
                FormDisciplina,
                {
                  title: "Adicionar Disciplina",
                  size: "md",
                },
                handleCloseSave
              )
            }
            className="zmdi zmdi-plus actions__item"
          ></i>
          <Dropdown className="actions__item">
            <Dropdown.Toggle className="no-caret" as={"div"}>
              <i className="zmdi zmdi-more-vert"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => handlerSetOrder("name")}
                active={order === "nome"}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>Classificar por Nome</div>
                  {order === "name" && <i className="zmdi zmdi-check ml-2"></i>}
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handlerSetOrder("aulas")}
                active={order === "aulas"}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>Classificar por Aulas</div>
                  {order === "aulas" && (
                    <i className="zmdi zmdi-check ml-2"></i>
                  )}
                </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setShowArquivadas(!showArquivadas)}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>Mostrar arquivadas</div>
                  {showArquivadas && <i className="zmdi zmdi-check ml-2"></i>}
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <CenterLoading show={loading} />

          {!loading && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOME</th>
                  <th>AULAS</th>
                  <th>QUESTÕES</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {disciplinas
                  .filter((disciplina) => {
                    if (!showArquivadas && disciplina.arquivada) {
                      return false;
                    }

                    return true;
                  })
                  .map((disciplina) => (
                    <tr key={disciplina.id}>
                      <td>{disciplina.id}</td>
                      <td>{disciplina.name}</td>
                      <td>{disciplina.meta?.aulas_count}</td>
                      <td>{disciplina.meta?.questoes_count}</td>
                      <td className="pb-0">
                        <div className="d-flex align-items-center">
                          <a
                            onClick={() =>
                              openModal(
                                FormDisciplina,
                                {
                                  size: "md",
                                  title: "Editar Disciplina",
                                  data: { id: disciplina.id },
                                },
                                handleCloseSave
                              )
                            }
                            className="btn ml-auto btn-sm"
                          >
                            <i className="zmdi zmdi-edit"></i>
                          </a>
                          <Link
                            to={`disciplinas/${disciplina.id}`}
                            className="btn btn-sm"
                          >
                            <i className="zmdi zmdi-search"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export interface EstudarProps {}
