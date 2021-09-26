import Axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { ModalProps } from "src/contexts/ModalContext";

export function FormDisciplina({ onClose, data }: ModalProps) {
  const [loading, setLoading] = useState("");
  const { id = null } = data;
  const { values, setFieldValue, handleChange, handleSubmit } = useFormik({
    initialValues: {
      name: "",
      arquivada: "",
    },
    onSubmit: async (values) => {
      const method = id ? 'put' : 'post'
      const url = id ? `disciplinas/${id}` : 'disciplinas'

      try {
        const response = await Axios.request({
            url,
            method,
            data: values
        })

        onClose(response.data)

      } catch (error) {

      }
    },
  });

  useEffect(() => {
    loadDisciplina();
  }, []);

  const loadDisciplina = async () => {
    if (id) {
      setLoading("GET_DISCIPLINA");
      try {
        const response = await Axios.get(`disciplinas/${id}`);

        setFieldValue("name", response.data?.name);
        setFieldValue("arquivada", response.data?.arquivada);
      } catch (error) {}
      setLoading("");
    }
  };

  if (loading === "GET_DISCIPLINA") {
    return <div className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" />
    </div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nome</label>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          type="text"
          placeholder="Nome da Disciplina"
          className="form-control bg-light"
        />
        <i className="form-group__bar"></i>
      </div>
      <div className="form-group">
        <label>Arquivada</label>
        <div className="select">
          <select
            name="arquivada"
            value={values.arquivada}
            onChange={handleChange}
            className="form-control bg-light"
          >
            <option value=""></option>
            <option value="1">Sim</option>
            <option value="0">Não</option>
          </select>
          <i className="form-group__bar"></i>
        </div>
      </div>
      <div className="form-group d-flex mb-0">
        <button
          type="button"
          onClick={() => onClose(null)}
          className="ml-auto btn btn-light"
        >
          Cancelar
        </button>
        <button className="ml-3 btn btn-primary">Salvar Disciplina</button>
      </div>
    </form>
  );
}
