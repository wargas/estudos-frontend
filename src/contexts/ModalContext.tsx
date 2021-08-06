import { database } from "firebase";
import { title } from "process";
import React, { createContext, FC, useState } from "react";
import { useContext } from "react";
import { Modal } from "react-bootstrap";

export const ModalContext = createContext<ModalContextProps>({} as ModalContextProps);

export const ModalProvider: FC = ({ children }) => {
  const [Content, setContent] = useState(<Element />);
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState({
    title: 'Modal'
  })

  function openModal(props: ModalProps) {
    setShow(true);
    setContent(<props.content data={props.data} />);
    setConfig(old => ({...old, title: props.title}))
  }

  function handlerClose() {
    setShow(false)
  }

  return (
    <ModalContext.Provider value={{ openModal }}>
      <Modal show={show} onHide={handlerClose} >
        <Modal.Header closeButton>
          <Modal.Title>{config.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{Content}</Modal.Body>
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export function useModal(): any {
  const context = useContext(ModalContext);

  return [context.openModal];
}

function Element() {
  return <p>Ola mundo</p>;
}

export type ModalContextProps = {
    openModal: (props: ModalProps) => void
}

export type ModalProps = {
  content: any,
  data: any,
  title: string,
  onClose: (retorno: any) => void
}