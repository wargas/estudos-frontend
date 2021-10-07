import Axios from "axios";
import { DateTime } from "luxon";
import React, { useState, useEffect } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import Markdown from "react-markdown";
import { useModal } from "src/contexts/ModalContext";
import { Questao, Respondida } from "src/interfaces";
import { Comentarios } from "./Comentarios";
import { FormQuestoes } from "./FormQuestoes";

export function QuestaoItem({ questaoId = 0 }) {
  const [questao, setQuestao] = useState({} as Questao);
  const [loadingQuestao, setLoadingQuestao] = useState(false);
  const [loadingResposta, setLoadingResposta] = useState(false);
  const [showComents, setShowComents] = useState(false);

  const [openModal] = useModal();

  useEffect(() => {
    if (questaoId !== 0) {
      loadQuestao(questaoId);
    }
  }, [questaoId]);

  async function loadQuestao(id: number) {
    setLoadingQuestao(true);
    try {
      const { data } = await Axios.get<Questao>(`questoes/${questaoId}`);

      setQuestao({
        ...data,
        resposta: getResponseToday(data?.respondidas || []),
        status: hasReponseToday(data?.respondidas || [])
          ? "RESPONDIDA"
          : "PENDENTE",
      });
    } catch (error) {}
    setLoadingQuestao(false);
  }

  function handleMarcar(letra: string) {
    if (questao.status === "RESPONDIDA") {
      return;
    }
    let resposta = questao.resposta;
    let status = questao.status;
    if (letra === questao.resposta) {
      resposta = "";
      status = "";
    } else {
      status = "MARCADA";
      resposta = letra;
    }

    setQuestao({ ...questao, resposta, status });
  }

  async function handleResponder() {
    if (questao.resposta === "") return;

    setLoadingResposta(true);

    try {
      const { data } = await Axios.post(`questoes/responder`, {
        questao_id: questao.id,
        resposta: questao.resposta,
      });

      const _respondidas = [...(questao?.respondidas || []), data];

      setQuestao({
        ...questao,
        resposta: getResponseToday(_respondidas),
        respondidas: _respondidas,
        status: hasReponseToday(_respondidas) ? "RESPONDIDA" : questao.status,
      });
    } catch (error) {}

    setLoadingResposta(false);
  }

  function handleRiscar(letra: string) {
    setQuestao((old) => {
      const alternativas = old.alternativas.map((item) => {
        if (item.letra === letra) {
          item.riscada = !item.riscada;
        }

        return item;
      });

      return { ...old, alternativas };
    });
  }

  function hasReponseToday(respondidas: Respondida[]): boolean {
    return getResponseToday(respondidas) !== "";
  }

  function getResponseToday(respondidas: Respondida[]) {
    const today = DateTime.local().toSQLDate();
    const responseToday = respondidas.find(
      (item) => today === DateTime.fromISO(item.horario).toSQLDate()
    );

    return responseToday ? responseToday.resposta : "";
  }

  return (
    <>
      {loadingQuestao && (
        <div className="d-flex p-5 align-items-center justify-content-center">
          <Spinner animation="border" />
        </div>
      )}
      {!loadingQuestao && questao.id !== undefined && (
        <>
          <div className="toolbar mb-0">
            <div className="stats">
              {questao?.respondidas?.map((respondida) => (
                <OverlayTrigger
                  key={respondida.id}
                  overlay={
                    <Tooltip id={`${respondida.id}`}>
                      <span>{`marquei a letra ${respondida.resposta}`}</span>{" "}
                      <br />
                      <span>{`em ${DateTime.fromISO(
                        respondida.horario
                      ).toLocaleString()}`}</span>
                    </Tooltip>
                  }
                >
                  <div
                    className={`stat ${
                      respondida.acertou ? "acertou" : "errou"
                    }`}
                  ></div>
                </OverlayTrigger>
              ))}
              {Array(10 - Math.min(10, questao.respondidas?.length || 0))
                .fill("")
                .map((_, index) => (
                  <span key={index} className="stat nada"></span>
                ))}
            </div>
            <div className="actions">
              <i 
                onClick={() => setShowComents(true)}
                className="actions__item zmdi zmdi-comment-outline"></i>
              <i
                onClick={() =>
                  openModal(
                    FormQuestoes,
                    {
                      title: "Editar Questão",
                      size: 'lg',
                      data: { aula_id: questao.aula_id, questao_id: questaoId },
                    },
                    (result: any) => {
                      if (result) {
                        loadQuestao(questaoId);
                      }
                    }
                  )
                }
                className="zmdi zmdi-edit actions__item"
              ></i>
            </div>
          </div>
          <div className="card-body p-0">
            <Markdown
              allowDangerousHtml
              className="enunciado"
              children={questao?.enunciado?.replace(/\n/g, "\n\n") || ""}
            />
          </div>
          <div className="card-body p-0">
            {questao.alternativas &&
              questao.alternativas
                .map((alternativa) => {
                  let status = "light";
                  if (questao.status === "MARCADA") {
                    if (questao.resposta === alternativa.letra) {
                      status = "info";
                    } else {
                      status = "light";
                    }
                  }
                  if (questao.status === "RESPONDIDA") {
                    if (alternativa.letra === questao.resposta) {
                      if (alternativa.letra === questao.gabarito) {
                        status = "success";
                      } else {
                        status = "danger";
                      }
                    } else {
                      if (alternativa.letra === questao.gabarito) {
                        status = "outline-success";
                      } else {
                        status = "light";
                      }
                    }
                  }
                  return { ...alternativa, status };
                })
                .map((alternativa) => (
                  <div
                    key={alternativa.letra}
                    className="alternativa d-flex py-3 "
                  >
                    <div className="letra">
                      <button
                        onClick={() => handleMarcar(alternativa.letra)}
                        style={{ width: 45, height: 45 }}
                        className={`btn btn-${alternativa.status} mr-3`}
                      >
                        {alternativa.letra}
                      </button>
                    </div>
                    <div
                      style={{ opacity: alternativa.riscada ? 0.2 : 1 }}
                      className="conteudo"
                    >
                      {alternativa.conteudo}
                    </div>
                    <div
                      onClick={() => handleRiscar(alternativa.letra)}
                      className="riscar ml-auto"
                    >
                      <i className="zmdi zmdi-close"></i>
                    </div>
                  </div>
                ))}
          </div>
          <div className="card-body p-4 d-flex">
            <button
              disabled={questao.status !== "MARCADA"}
              className={`btn btn-info`}
              onClick={handleResponder}
            >
              {loadingResposta && <Spinner size="sm" animation="border" />}
              {!loadingResposta && <i className="fas fa-check"></i>}
              {!loadingResposta && (
                <span className="ml-2 font-weight-bold">RESPONDER</span>
              )}
            </button>
          </div>
          <Comentarios questaoId={questaoId} onClose={() => setShowComents(false)} show={showComents} />
        </>
      )}
    </>
  );
}
