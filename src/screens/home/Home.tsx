/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import { Dropdown, Card, Col, Row } from "react-bootstrap";

import "./Home.scss";

import { ChartTempoEStadudo } from "../../components/chart-tempo-estudado/ChartTempoEstudado";
import { Disciplina } from "../../interfaces/Disciplina";
import { ChartQuestoesRespondidas } from "../../components/chart-questoes-respondidas/ChartQuestoesRespondidas";

import RankingQuestoesDia from "src/components/rankin-questos-dia/RankingQuestoesDia";
import RankingTempoDia from "src/components/ranking-tempo-dia/RankingTempoDia";

export interface HomeProps {}

export default function Home() {
  return (
    <Fragment>
      <Row>
        <Col style={{ height: 300 }}>
          <Card
            style={{
              overflow: "auto",
              height: "100%",
              paddingBottom: 16,
              scrollbarWidth: "none",
            }}
          >
            <RankingQuestoesDia />
          </Card>
        </Col>
        <Col md={9} style={{ height: 300, marginBottom: 32 }}>
          <Card className="" style={{ height: "100%" }}>
            <Card.Body>
              <ChartQuestoesRespondidas />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={9} style={{ height: 300, marginBottom: 32 }}>
          <Card className="" style={{ height: "100%" }}>
            <Card.Body>
              <Card.Title>Tempo Estudado por Dia</Card.Title>
              <div style={{ flexDirection: "column", display: "flex" }}>
                <ChartTempoEStadudo />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col style={{ height: 300 }}>
          <Card
            style={{
              overflow: "auto",
              height: "100%",
              paddingBottom: 16,
              scrollbarWidth: "none",
            }}
          >
            <RankingTempoDia />
          </Card>
        </Col>
      </Row>
      {/* <Row>
                <Col>
                    <Card className="">
                        <Card.Body>
                            <Card.Title>Nível por Aula</Card.Title>
                            <div className="actions">
                                <div className="actions--item">
                                    <SelectDisciplina onChange={setDisciplina} />
                                </div>
                            </div>
                            <ChartNivelAula disciplina={disciplina} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}
    </Fragment>
  );
}

export const SelectDisciplina = ({ onChange = (d: Disciplina) => {} }) => {
  const [disciplinas] = useState<Disciplina[]>([]);
  const [current, setCurrent] = useState({} as Disciplina);

  useEffect(() => {
    getLSCurrent();
  }, []);

  useEffect(() => {
    if (current) {
      localStorage.setItem("current-disciplina", JSON.stringify(current));

      onChange(current);
    }
  }, [current]);

  const getLSCurrent = () => {
    const lsCurrent = localStorage.getItem("current-disciplina");

    if (lsCurrent) {
      setCurrent(JSON.parse(lsCurrent));
    }
  };

  return (
    <Dropdown alignRight>
      <Dropdown.Toggle as={"div"} style={{ cursor: "pointer" }} split>
        {!!current ? current.name : "Selecione"}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {disciplinas.map((disciplina) => (
          <Dropdown.Item
            onClick={() => setCurrent(disciplina)}
            key={String(disciplina.id)}
          >
            {disciplina.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};
