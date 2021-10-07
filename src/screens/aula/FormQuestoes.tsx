import Axios from "axios";
import React, { useEffect, useState } from "react";
import qs from 'query-string'

import { Spinner } from "react-bootstrap";
import { CenterLoading } from "src/components/center-loading/CenterLoading";
import { ModalProps } from "src/contexts/ModalContext";
import { Questao } from "src/interfaces";
import { toast } from "react-toastify";

export function FormQuestoes({ data, onClose }: ModalProps) {
  const [loading, setLoading] = useState("");
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    loadQuestoes();
  }, []);

  useEffect(() => {
    setMarkdown(
      questoes
        .map((questao) => {
          const alternativas =
            questao.alternativas &&
            questao?.alternativas
              .map((alt) => `${alt.conteudo}`)
              .join(`\n***\n`);

          const _head = `[ID: ${questao.id}]`;

          return `${_head}${questao.enunciado}\n***\n${alternativas}\n***\n${questao.gabarito}`;
        })
        .join(`\n****\n`)
    );
  }, [questoes]);

  const loadQuestoes = async () => {
    try {
      setLoading("GET");
      const params = {
        aula_id: data?.aula_id || undefined,
        id: data?.questao_id || undefined
      }

      const response = await Axios.get(`questoes?${qs.stringify(params)}`);

      setQuestoes(response.data);
    } catch (error) {}
    setLoading("");
  };

  const saveQuestoes = async () => {
    try {
      setLoading("SAVE");
      const response = await Axios.post(`questoes/editar-lote`, {
        markdown,
        aula_id: data.aula_id,
      });
      toast.success('Questão salva!')
      onClose(response.data)
    } catch (error) {
      toast.error('Ocorreu um ao salvar questão')
    }
    setLoading("");
  };

  return (
    <form>
      <CenterLoading show={loading === "GET"} />
      {loading !== "GET" && (
        <>
          <div className="form-group">
            <label>Markdown das questões</label>
            <textarea
              value={markdown}
              onChange={(ev) => setMarkdown(ev.target.value)}
              style={{ minHeight: 300 }}
              className="form-control rounded p-3 bg-light"
            ></textarea>
          </div>
          <div className="form-group mb-0 d-flex">
            <button
              onClick={() => onClose(null)}
              type="button"
              className="ml-auto btn btn-light"
            >
              Cancelar
            </button>
            <button
              disabled={loading === "SAVE"}
              onClick={saveQuestoes}
              type="button"
              className="ml-3 btn btn-primary"
            >
              {loading === "SAVE" ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <i className="zmdi zmdi-check"></i>
              )}
              <span className="ml-2">Salvar Alterações</span>
            </button>
          </div>
        </>
      )}
    </form>
  );
}
