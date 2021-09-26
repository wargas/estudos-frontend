import React from 'react';
import { Modal } from 'react-bootstrap';

export const useDialog = (Element, callback) => {

    const [show, setShow] = React.useState(false);
    const [data, setData] = React.useState({});

    const openDialog = React.useCallback((data) => {
        setShow(true);
        setData(data);
    }, [])

    const handlerClose = (data) => {
        setShow(false);
        callback(data);
    }

    const Dialog = (_options = {}) => {
        
        const defaults = {
            title: "",
            closeButton: true,
            size: "lg",
            backdrop: "static",
            keyboard: false,
            centered: false,
            modalClassName: "",
            headerClassName: "",
            bodyClassName: ""
        }

        const options = {...defaults, ..._options};
        
        const title = options.title;

        return (
            <Modal
                className={options.modalClassName}
                backdrop={options.backdrop}
                keyboard={options.keyboard}
                size={options.size}
                scrollable
                centered={ options.centered }
                show={show} onHide={e => handlerClose(null)}>
                { (title || options.closeButton) && (
                    <Modal.Header className={options.headerClassName} closeButton={options.closeButton}>
                        {title && (
                            <Modal.Title>{title}</Modal.Title>
                        )}
                    </Modal.Header>
                )}
                <Modal.Body className={options.bodyClassName}>
                    {show && (
                        <Element setTitle={() => {}} data={data} onClose={handlerClose} />
                    )}
                </Modal.Body>
            </Modal>
        )
    }

    return [Dialog, openDialog];

}