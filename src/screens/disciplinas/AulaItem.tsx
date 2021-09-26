import { DateTime } from "luxon";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Aula } from "src/interfaces";

export interface AulaInterface extends Aula {
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

export interface Props {
  aula: AulaInterface;
}

export function AulaItem({ aula }: Props) {
  const { push } = useHistory();
  const last = aula.days.find((item) => item.last);

  return (
    <tr>
      <th>{String(aula.ordem).padStart(3, "0")}</th>
      <td>{aula.name}</td>
      <td>{last ? DateTime.fromSQL(last.data).toFormat("dd/MM/yy") : "-"}</td>
      <td>
        {last ? (
          <span>{((last?.acertos / last?.total) * 100).toFixed(1)}%</span>
        ) : (
          "-"
        )}
      </td>
      <td className="text-right">{aula.meta?.questoes_count}</td>
      <td className="text-right py-0">
        <button
          onClick={() => push(`/aula/${aula.id}/0`)}
          className="btn btn-sm"
        >
          <i className="zmdi zmdi-search"></i>
        </button>
      </td>
    </tr>
    // <div
    //   onClick={() => push(`/aula/${aula.id}/0`)}
    //   className="listview__item cursor-pointer"
    // >
    //   <i className="avatar-char bg-cyan">
    //     {String(aula.ordem).padStart(2, "0")}
    //   </i>
    //   <div className="listview__content">
    //     <div className="listview__heading">{aula.name}</div>
    //     <div className="listview__attrs">
    //       <span>
    //         {String(aula.meta?.questoes_count).padStart(2, "0")} Questões
    //       </span>
    //       <span>{aula.days.length} vezes</span>
    //       {last && (<span>{(last?.acertos / last?.total*100).toFixed(1)}%</span>)}
    //     </div>
    //   </div>
    //   <div className="actions listview__actions">
    //     <div className="actions__item">
    //       <i style={{ fontSize: 12 }} className="fas fa-chevron-right"></i>
    //     </div>
    //   </div>
    // </div>
  );
}
