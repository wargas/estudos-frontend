import React from 'react';
import Markdown from 'react-markdown';
import { Card, Button } from 'react-bootstrap';
import { Questao } from '../../interfaces/Questao';



export const QuestaoItem: React.SFC<QuestaoItemProps> = ({ questao, index, marcar, riscar }) => {

    return (
        <React.Fragment>
            <div className={`questao-item${questao.respondida ? ' respondida' : ''}`}>
                <Markdown className="enunciado" source={questao.enunciado?.replace(/\n/g, "\n\n")} />

                <div className="opcoes">
                    {questao.opcoes?.map((opcao, opcao_index) =>
                        <div
                            key={String(opcao_index)}
                            className={`opcao ${opcao.correta && questao.respondida ? 'correta' : ''} ${opcao.marcada ? 'marcada' : ''} ${opcao.riscada ? 'riscada' : ''}`}>
                            <div className="letra" onClick={() => marcar(opcao_index)}>
                                {opcao.letra} {opcao.status}
                            </div>
                            <div className="texto" onClick={() => riscar(opcao_index)}>
                                <Markdown source={opcao.texto} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export interface QuestaoItemProps {
    questao: Questao,
    index: number,
    marcar: (opcao: number) => void,
    riscar: (opcao: number) => void
}

