import Axios from "axios";
import { DateTime } from "luxon";
import React, { FC } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Questao, Respondida } from "src/interfaces";

type props = {
  open: boolean;
  questoes: Questao[];
  onClose: () => void;
};

type diaProps = {
  date: DateTime;
  acertos: Number;
  erros: Number;
  percent: Number;
};

export const AulaEstatisticas: FC<props> = ({
  open = false,
  questoes = [],
  onClose = () => {},
}) => {
  const [dias, setDias] = useState<diaProps[]>([]);
  const [respondidas, setRespondidas] = useState<Respondida[]>([]);
  const [dia, setDia] = useState("");

  const { push } = useHistory();
  const { id = "" } = useParams<{ id: string }>();

  useEffect(() => {
    if (open) {
      loadRespondidas()
    }
  }, [open]);

  useEffect(() => {
    const _dias = Array.from(
      new Set(
        respondidas.map((item) => {
          return DateTime.fromISO(item.horario).toSQLDate();
        })
      )
    ).map((dia) => {
      const acertos = respondidas.filter((resp) => {
        return (
          DateTime.fromISO(resp.horario).toSQLDate() === dia && resp.acertou
        );
      });

      const erros = respondidas.filter((resp) => {
        return (
          DateTime.fromISO(resp.horario).toSQLDate() === dia && !resp.acertou
        );
      });

      return {
        date: DateTime.fromSQL(dia),
        acertos: acertos.length,
        erros: erros.length,
        percent: (acertos.length / (erros.length + acertos.length)) * 100 || 0,
      };
    });
    setDias(_dias);
  }, [respondidas]);

  async function loadRespondidas() {
    try {
      const { data } = await Axios.get(`respondidas/${id}`);

      setRespondidas(data);
    } catch (error) {}
  }

  return (
    <>
      {open && <div onClick={onClose} className="ma-backdrop"></div>}
      <div className={`chat pt-0 ${open && "toggled"} `}>
        <div className="toolbar pl-0 mb-0">
          {dia !== "" && (
            <div className="actions ml-0">
              <button onClick={() => setDia("")} className="btn actions__item">
                <i className="zmdi zmdi-arrow-left"></i>
              </button>
            </div>
          )}
          <div className="toolbar__label ml-4">
            {dia !== ""
              ? DateTime.fromSQL(dia).toLocaleString()
              : "QUESTÕES RESPONDIDAS"}
          </div>
          <div className="actions">
            <button onClick={onClose} className="btn actions__item">
              <i className="zmdi zmdi-close"></i>
            </button>
          </div>
        </div>

        <div
          style={{ maxHeight: "calc(100vh - 50px)", overflowY: "auto" }}
          className="py-4"
        >
          {dia === "" && (
            <div className="listview listview--hover listview--bordered">
              {dias.map((item) => (
                <div
                  onClick={() => setDia(item.date.toSQLDate())}
                  key={item.date.toSQLDate()}
                  className="listview__item cursor-pointer"
                >
                  <div className="listview__content">
                    <div className="listview__heading">
                      {item.date.toLocaleString()}
                    </div>
                    <p>
                      {item.acertos} acertos &#8226; {item.erros} Erros
                    </p>
                  </div>
                  <div className="listview__actions">
                    <span
                      className={`badge badge-${
                        item.percent > 80 ? "success" : "danger"
                      }`}
                    >
                      {item.percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {dia !== "" && (
            <>
              {Array(
                Math.floor(questoes.length / 5) +
                  (questoes.length % 5 > 0 ? 1 : 0)
              )
                .fill("")
                .map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="d-flex justify-content-around mb-3 px-4"
                  >
                    {Array(5)
                      .fill(rowIndex * 5)
                      .map((start, i) => start + i)
                      .map((questaoIndex) => {
                        let bg = "outline-secondary";

                        const questao = questoes[questaoIndex];
                        if (questao && respondidas) {
                          const _respondida = respondidas.find((i) => {
                            return (
                              DateTime.fromISO(i.horario).toSQLDate() === dia && i.questao_id === questao.id
                            );
                          });

                          if(!_respondida) {
                            bg = 'light'
                          } else {
                            if (_respondida?.acertou) {
                              bg = "success";
                            } else {
                              bg = "danger";
                            }
                          }
                        }

                        return {
                          index: questaoIndex,
                          bg,
                        };
                      })
                      .map(({ index, bg }) => (
                        <button
                          key={index}
                          style={{
                            width: 45,
                            opacity: questoes.length < index + 1 ? 0 : 1,
                          }}
                          onClick={() =>
                            push(`/aula/${id}/${questoes[index].id}`)
                          }
                          className={`btn btn-${bg}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};
