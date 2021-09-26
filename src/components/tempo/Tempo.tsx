/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Aula } from "../../interfaces/Aula";
import { Registro } from "../../interfaces/Registros";
import { Spinner } from "react-bootstrap";

import { Duration, DateTime } from "luxon";
import Axios, { AxiosResponse } from "axios";

export const Tempo: React.FC<TempoProps> = ({ id }) => {
  const [play, setPlay] = useState(false);
  const [secounds, setSeconds] = useState(0);
  const [aula, setAula] = useState<Aula>();
  const [registro, setRegistro] = useState<Registro>();
  const [loading, setLoading] = useState(false);

  const [start, setStart] = useState(0);

  useEffect(() => {
    getAula(id);
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout = setInterval(() => {}, 1000);
    if (play) {
      interval = setInterval(() => {
        if (start > 0) {
          const current = DateTime.local().toSeconds();
          setSeconds((old) => current - start);
        } else {
          setSeconds((old) => old + 1);
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [play, secounds]);

  useEffect(() => {
    if (play) {
      setStart(DateTime.local().toSeconds() - secounds);
    } else {
      setStart(0);
    }
  }, [play]);

  useEffect(() => {
    if (secounds > 0 && Math.floor(secounds) % 5 === 0) {
      handleSave();
    }
  }, [secounds]);

  const handleSave = () => {
    setLoading(true);
    let request: Promise<AxiosResponse<Registro>>;
    let data = { tempo: secounds, ...registro };
    data.tempo = secounds;

    if (registro?.id) {
      request = Axios.put<Registro>(`registros/${registro.id}`, data);
    } else {
      request = Axios.post<Registro>(`registros`, data);
    }

    request.then(({ data }) => {
      setRegistro(data);
    });

    request.finally(() => setLoading(false));
  };

  const getAula = (id: string) => {
    Axios.get<Aula>(`aulas/${id}`).then(({ data }) => {
      setAula(data);
      setRegistro({
        aula_id: data.id,
        disciplina_id: data.disciplina_id,
        tempo: 0,
      });
    });
  };

  if (!aula?.id) {
    return (
      <div className="d-flex align-items-center">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }
  return (
    <React.Fragment>
      <div className="d-flex align-items-center justify-content-between p-3">
        <div className="tempo mx-3">
          <h3 className="p-0 m-0 text-bold text-white">
            {Duration.fromObject({ seconds: secounds }).toFormat("hh:mm:ss")}
          </h3>
        </div>
        <div className="actions">
          <button onClick={() => setPlay(!play)} className="btn text-white">
            {play && <i className="fas fa-pause"></i>}
            {!play && <i className="fas fa-play"></i>}
          </button>
          <button onClick={handleSave} className="btn text-white">
            {!loading && <i className="fas fa-check"></i>}
            {loading && <Spinner size="sm" animation="border" />}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export interface TempoProps {
  id: string;
}
