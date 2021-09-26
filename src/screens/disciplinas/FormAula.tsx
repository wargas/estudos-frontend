import Axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { CenterLoading } from "src/components/center-loading/CenterLoading";
import { ModalProps } from "src/contexts/ModalContext";

export function FormAula({ data, onClose }: ModalProps) {
  const [loading, setLoading] = useState<string>("");

  useEffect(() => {
    loadAula();
  }, []);

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      ordem: "",
    },
    onSubmit: async (values) => {
      const _data = { ...values, ...data };
      const method = data?.id ? "put" : "post";
      const url = data?.id ? `aulas/${data.id}` : "aulas";

      try {
        setLoading("SAVE_AULA");
        const response = await Axios.request({ method, url, data: _data });

        onClose(response.data);
      } catch (error) {}
      setLoading("");
    },
  });

  async function loadAula() {
    if (data?.id) {
      try {
        setLoading("GET_AULA");
        const response = await Axios.get(`aulas/${data.id}`);

        setFieldValue("name", response.data.name);
        setFieldValue("ordem", response.data.ordem);


      } catch (error) {}
      setLoading("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CenterLoading show={loading === "GET_AULA"} />
      {loading !== "GET_AULA" && (
        <>
          <div className="form-group">
            <label>Nome</label>
            <input
              name="name"
              onChange={handleChange}
              value={values.name}
              type="text"
              className="form-control bg-light"
            />
            <i className="form-group__bar"></i>
          </div>
          <div className="form-group">
            <label>Ordem</label>
            <input
              name="ordem"
              onChange={handleChange}
              value={values.ordem}
              type="text"
              className="form-control bg-light"
            />
            <i className="form-group__bar"></i>
          </div>
          <div className="form-group mb-0 d-flex">
            <button
              type="button"
              onClick={() => onClose(null)}
              className="ml-auto btn btn-light"
            >
              Cancelar
            </button>
            <button type="submit" className="ml-3 btn btn-primary">
              {loading === 'SAVE_AULA' && <Spinner size="sm" animation="border" />}
              {loading !== 'SAVE_AULA' && <i className="zmdi zmdi-check"></i>}
              
              <span className="ml-2">Salvar Aula</span>
            </button>
          </div>
        </>
      )}
    </form>
  );
}
