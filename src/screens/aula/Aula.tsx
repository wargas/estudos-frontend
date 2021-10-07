import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Aula as AulaInterface } from 'src/interfaces';
import { Tempo } from 'src/components/tempo/Tempo';

import './Aula.scss';

import { AulaEstatisticas } from './AulaEstatisticas';
import { QuestaoItem } from './QuestaoItem';
import { useModal } from 'src/contexts/ModalContext';
import { FormAula } from '../disciplinas/FormAula';
import { FormQuestoes } from './FormQuestoes';

export default function Aula() {
  const [aula, setAula] = useState<AulaInterface>({} as AulaInterface);
  const [loading, setLoading] = useState(false);
  const [questoesList, setQuestoesList] = useState<number[]>([]);

  const { id, questao } = useParams<{ id: string; questao: string }>();

  const [sidebar, setSidebar] = useState('');

  const { push } = useHistory();

  const [openModal] = useModal();

  useEffect(() => {
    loadAula();
  }, []);

  async function loadAula() {
    setLoading(true);
    try {
      const { data } = await Axios.get<AulaInterface>(`aulas/${id}`);
      setAula(data);

      setQuestoesList(data.questoes.map((it) => it.id));

      if (questao === '0') {
        push(`/aula/${id}/${data.questoes[0].id}`);
      }
    } catch (error) {}
    setLoading(false);
  }

  function next() {
    const _next = questoesList[questoesList.indexOf(Number(questao) + 1)];

    push(`/aula/${id}/${_next}`);
  }

  function prev() {
    const _prev = questoesList[questoesList.indexOf(Number(questao) - 1)];

    push(`/aula/${id}/${_prev}`);
  }

  return (
    <React.Fragment>
      <div className='toolbar'>
        <div className='toolbar--label'>
          <h5
            style={{ maxWidth: 500 }}
            className='text-truncate'
            title={aula?.name || '-'}>
            {aula.id
              ? `${String(aula?.ordem || '').padStart(2, '0')} ${aula?.name}`
              : 'Carregando...'}
          </h5>
          <Link
            className='text-dark'
            to={`/disciplinas/${aula?.disciplina_id}`}>
            {aula?.disciplina?.name}
          </Link>
        </div>

        <div style={{ width: 205 }} className='actions'>
          <i
            onClick={() =>
              openModal(
                FormAula,
                {
                  title: 'Editar Aula',
                  size: 'md',
                  data: { id: aula.id },
                },
                (result: any) => {
                  if (result) {
                    loadAula();
                  }
                }
              )
            }
            className='actions__item zmdi zmdi-edit'></i>
          <i
            onClick={() =>
              openModal(
                FormQuestoes,
                {
                  title: 'Editar questões em bloco',
                  size: 'lg',
                  data: { aula_id: id },
                },
                (result: any) => {
                  if (result) {
                    loadAula();
                  }
                }
              )
            }
            className='actions__item zmdi zmdi-format-list-numbered'></i>

          <button
            disabled={questoesList.indexOf(Number(questao)) === 0}
            onClick={prev}
            className='btn actions__item'>
            <i className='zmdi zmdi-arrow-left'></i>
          </button>
          <button onClick={() => setSidebar('estatisticas')} className='btn'>
            {questoesList.indexOf(Number(questao)) + 1}/{questoesList.length}
          </button>
          <button
            disabled={
              questoesList.indexOf(Number(questao)) >= questoesList.length - 1
            }
            onClick={next}
            className='btn actions__item'>
            <i className='zmdi zmdi-arrow-right'></i>
          </button>
        </div>
      </div>
      {aula.id !== undefined && (
        <>
          <div className='card'>
            <QuestaoItem questaoId={Number(questao)} />
          </div>
        </>
      )}
      <AulaEstatisticas
        questoes={aula.questoes}
        onClose={() => setSidebar('')}
        open={sidebar === 'estatisticas'}
      />
    </React.Fragment>
  );
}
