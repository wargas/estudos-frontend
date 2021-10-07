import Axios from "axios";
import { DateTime } from "luxon";
import React, { Fragment } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useModal } from "src/contexts/ModalContext";

import "./Gerenciar.scss";

export default function Gerenciar() {
  const [currentDate, setCurentDate] = useState(
    DateTime.local().minus({ days: 1 })
  );

  const [openModal] = useModal();

  const [aulaId, setAulaId] = useState(null);

  const { push } = useHistory()

  const handlerGerar = async () => {
    try {
      const { data } =  await Axios.get(`erros/${currentDate.toSQLDate()}`);

      setAulaId(data.id);
    } catch (err) {

    }
  };

  return (
    <Fragment>
      <header className="content__title">
        <h1>Preferencias</h1>
        <small>Suas Preferencia</small>
      </header>
      <div className="card" style={{ maxWidth: 400 }}>
        <div className="card-body">
          <h5 className="card-title">Questões Erradas</h5>
          <div className="input-group">
            <div className="input-group-prepend">
              <button
                className="btn btn-primary"
                onClick={() => setCurentDate((old) => old.minus({ days: 1 }))}
              >
                <i className="zmdi zmdi-chevron-left"></i>
              </button>
            </div>
            <input
              value={currentDate.toFormat("dd/MM/yyyy")}
              type="text"
              className="form-control text-center"
              placeholder="Data"
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                onClick={() => setCurentDate((old) => old.plus({ days: 1 }))}
              >
                <i className="zmdi zmdi-chevron-right"></i>
              </button>
            </div>
          </div>
          <div className="d-flex">
            <button onClick={handlerGerar} className="btn btn-primary mt-3">Gerar</button>
            <button
            onClick={() => push(`/aula/${aulaId}`)}
              disabled={aulaId === null}
              className="btn ml-auto btn-success mt-3"
            >
              Aula
            </button>
          </div>
        </div>
      </div>

      <button onClick={() => openModal({
        content: Teste,
        data: { id: 1},
        title: "Wargas !"
      })} className="btn btn-info">Abrir modal</button>
    </Fragment>
  );
}

export interface GerenciarProps {}

function Teste(props: any) {
  return <h1>TESTE {JSON.stringify(props)}</h1>
}
