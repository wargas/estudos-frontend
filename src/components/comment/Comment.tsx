/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { Comentario } from 'src/interfaces/Comentario';
import { Questao } from '../../interfaces/Questao';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';

import Swal from 'sweetalert2';

import './Comments.scss';
import { Spinner } from 'react-bootstrap';
import Axios from 'axios';

export const Comment: FC<CommentProps> = ({ questao }) => {

    const [comentario, setComentario] = useState<Comentario>({ texto: '' } as Comentario);
    const [loading, setLoading] = useState(false);
    const [showEdit, setShowEdit] = useState(false);


    useEffect(() => {
        loadComents();
        setShowEdit(false);
    }, [questao])

    const loadComents = () => {
        setLoading(true)
        Axios.get<Comentario>(`comentarios/${questao.aula_id}/${questao.questao_id}`)
            .then(({ data }) => {
                setComentario(data);
            }).catch((err) => {
                
            }).finally(() => setLoading(false))
    }

    const handlerSaveComment = useCallback(() => {

        Axios.post(`comentarios/${questao.aula_id}/${questao.questao_id}`, {
            texto: comentario.texto
        }).then(() => {
            Swal.fire({
                title: 'OK',
                text: 'Comentário salvo com sucesso',
                timer: 3000,
                toast: true,
                position: 'bottom',
                icon: 'success'
            })

            setShowEdit(false);
        }).catch(() => {
            Swal.fire({
                title: 'Erro',
                text: 'Não conseguimos salvar seu comentário',
                timer: 3000,
                toast: true,
                position: 'bottom',
                icon: 'error'
            })
        })

    }, [comentario])

    const handlerCopiarQuestao = useCallback(() => {

        const opcoes = questao.opcoes.map(opcao => {
            return opcao.texto || ""
        }).join("\n\n");

        let texto = questao.enunciado + "\n\n" + opcoes

        setComentario({ ...comentario, texto })

    }, [comentario])

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
            </div>
        )
    }

    return (
        <Fragment>
            <div className="d-flex">
                <h3>Comentários da questão</h3>
                <button className="btn ml-auto" onClick={() => setShowEdit(!showEdit)}>
                    <i className="fas fa-edit"></i>
                </button>
            </div>
            {showEdit && (
                <div className="modal-footer">
                    <textarea
                        onChange={ev => setComentario({ ...comentario, texto: ev.target.value })}
                        value={comentario.texto}
                        className="form-control" style={{ minHeight: 250 }}></textarea>
                    <button onClick={handlerCopiarQuestao} className="btn btn-dark">Copiar questão</button>
                    <button onClick={handlerSaveComment} className="btn btn-dark">Salvar Comentário</button>
                </div>
            )}
            <Markdown
                plugins={[gfm, mark]}
                allowDangerousHtml
                children={comentario.texto} />
        </Fragment>
    )
}

export type CommentProps = {
    questao: Questao;
}

export const mark = (options: any) => {
    // console.log(options, 'options')
}