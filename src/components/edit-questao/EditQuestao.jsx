import Axios from 'axios';
import React, { Fragment, useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

export default ({ data, onClose }) => {

    const [texto, setTexto] = useState("");
    const [refTextarea, setRefTexarea] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadText = async () => {
            try {
                const { data: _data } = await Axios.get(`questoes/${data.aula_id}/${data.questao_id || 0}`);

                setTexto(_data.text)
            }
            catch (error) {

            }
        }

        loadText();
    }, [data])

    const onSalvar = async () => {
        setLoading(true)
        try {
            await Axios.post(`questoes/${data.aula_id}/${data.questao_id || 0}`, { texto });

            onClose(true)

        } catch (error) {

        }

        setLoading(false);
    }

    function handleAction(action) {
        const { selectionStart, selectionEnd } = refTextarea;

        let inicio = texto.substr(0, selectionStart)
        let selecionado = texto.substr(selectionStart, selectionEnd - selectionStart);
        let final = texto.substr(selectionEnd)

        if(selecionado.endsWith(" ")) {
            selecionado = selecionado.substr(0, selecionado.length - 1);
            final = ` ${final}`
        }

        selecionado = selecionado.split("\n").join(`${action.end}\n${action.start}`)

       setTexto(old => `${inicio}${action.start}${selecionado}${action.end}${final}`)

    }

    const onPaste = async (event) => {

        const [file] = event.clipboardData.files;

        if (file) {

            const image = new FormData();

            image.append('image', file, 'image');

            const { data } = await Axios.post(`questoes/upload`, image);

            if (data.fileName) {
                const start = refTextarea.selectionStart;
                setTexto(_texto => `${_texto.substring(0, start)}![](http://157.245.218.108/uploads/images/${data.fileName})${_texto.substring(start, _texto.length)}`)
            }

        }

    }

    return (
        <Fragment>
            <div className="d-flex">
                {actions.map(action => (
                    <button key={action.icon} onClick={() => handleAction(action)} className="btn btn-sm">
                        <i className={`fas fa-${action.icon}`}></i>
                    </button>
                ))}
            </div>
            <textarea
                ref={setRefTexarea}
                onPaste={onPaste}
                onChange={e => setTexto(e.target.value)}
                value={texto} style={{ minHeight: 200 }} className="form-control mb-3">

            </textarea>
            <Button
                onClick={onSalvar}>
                {loading ? 'Salvando...' : 'Salvar Questão'}
            </Button>
        </Fragment>
    )
}

const actions = [
    {
        icon: "underline",
        start: "<u>",
        end: "</u>"
    },
    {
        icon: "italic",
        start: "*",
        end: "*"
    },
    {
        icon: "bold",
        start: "**",
        end: "**"
    },
    {
        icon: "list-ul",
        start: "- ",
        end: ""
    }
]