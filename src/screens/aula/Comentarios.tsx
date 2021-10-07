import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CenterLoading } from 'src/components/center-loading/CenterLoading';
import { Editor } from 'src/components/editor/Editor';

export function Comentarios({
  show = false,
  questaoId = 0,
  onClose = () => {},
}) {
  const [initialHtml, setInitialHtml] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState<'SAVING' | 'GETING' | ''>('');

  useEffect(() => {
    if (show) {
      loadComentario();
    }
  }, [show]);

  async function handlerSave() {
    setLoading('SAVING');
    try {
      const { data } = await Axios.post(`comentarios/${questaoId}`, {
        texto: html,
      });
      setLoading('');
      setHtml(data.texto);
      setInitialHtml(data.texto);
      toast.success('Comentário salvo!')
    } catch (error) {
      toast.error('Ocorreu um erro ao salvar o comentário')
    }
  }

  async function loadComentario() {
    setLoading('GETING');
    const { data } = await Axios.get(`comentarios/${questaoId}`);
    setLoading('');
    setInitialHtml(data.texto);
    setHtml(data.texto);
  }

  return (
    <>
      {show && <div onClick={onClose} className='ma-backdrop'></div>}
      <div className={`chat pt-0 ${show && 'toggled'}`}>
        <div style={{ height: '100%' }} className='d-flex flex-column'>
          <div
            style={{ minHeight: '65px', height: '65px' }}
            className='toolbar mb-0'>
            <div className='toolbar__label'>COMENTÁRIOS</div>
          </div>
          <div style={{ flexGrow: 1, overflowY: 'scroll' }} className='p-3'>
            {loading === 'GETING' && <CenterLoading show={true} />}
            {loading !== 'GETING' && (
              <Editor value={initialHtml} onChange={setHtml} />
            )}
          </div>
          <div>
            <button
              onClick={handlerSave}
              className='rounded-0 btn btn-block btn-primary'>
              {loading === 'SAVING' && <Spinner size='sm' animation='border' />}
              {loading !== 'SAVING' && 'Salvar Comentário'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
