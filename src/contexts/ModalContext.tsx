import React, { createContext, FC, useCallback, useRef, useState } from "react";
import { useContext } from "react";
import { Modal } from "react-bootstrap";

export const ModalContext = createContext<ModalContextProps>(
  {} as ModalContextProps
);

export const ModalProvider: FC = ({ children }) => {
  const [Content, setContent] = useState(<Element />);
  const [show, setShow] = useState(false);

  const onCloseRef = useRef((result: any) => {});

  const [config, setConfig] = useState<ModalOptions>({
    title: "Modal",
    size: "lg",
    closeButton: false,
    backdrop: "static",
    data: {},
  });

  const openModal = useCallback(
    (Content: any, options: any, onClose: (result: any) => void) => {
      const { data = {}, ...rest } = options;

      setShow(true);
      onCloseRef.current = onClose;

      setContent(
        <Content setOptions={setConfig} onClose={handlerClose} data={data} />
      );
      setConfig((old) => ({ ...old, ...rest }));
    },
    []
  );

  const handlerClose = useCallback((retorno: any = null) => {
    if (onCloseRef.current) {
      onCloseRef.current(retorno);
    }
    setShow(false);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal }}>
      <Modal size={config.size} show={show} onHide={handlerClose}>
        <Modal.Header closeButton={config.closeButton}>
          <Modal.Title as={"h5"}>{config.title}</Modal.Title>
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
  openModal: (Element: any, options: any, onClose: () => void) => void;
};

export interface ModalOptions {
  title: string;
  size: "lg" | "sm" | "xl" | undefined;
  closeButton: boolean;
  backdrop: string;
  data: any;
}

export interface ModalProps {
  onClose: (ret: any) => void;
  setOptions: (opt: ModalOptions) => any;
  data: any;
}
