import React, { FC, Fragment, useCallback, useState, FormEvent } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import './Login.scss'
import * as firebase from 'firebase';
import { firebaseApp } from '../../firebase/firebase-config';


export const Login: FC = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validateOnBlur: true,
        onSubmit: () => {
            setLoading(true)
            setError('')
            firebaseApp.auth()
                .signInWithEmailAndPassword(formik.values.email, formik.values.password)
                .catch(err => setError(err['message']))
                .finally(() => setLoading(false))
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Email inválido').required('Campo Obrigaório'),
            password: Yup.string().min(5, 'Senha curta').required('Campo de senha obrigatório')
        })

    })

    const handlerLoginWithGoogle = useCallback((ev: FormEvent) => {
        ev.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider()
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

        firebaseApp.auth().signInWithPopup(provider)

    }, [])

    const handlerLoginWithFacebook = useCallback((ev: FormEvent) => {
        ev.preventDefault()
        const provider = new firebase.auth.FacebookAuthProvider();

        provider.addScope('user_birthday')

        firebase.auth().signInWithPopup(provider)
    }, [])

    return (
        <Fragment>
            <div className="login-container">
                <div className="login-content">
                    <Card>
                        <Card.Body>
                            <div className="d-block w-100  mb-3 text-center mt-3">
                                <Card.Title style={{ width: '100%' }} className="d-block">INFORME SUAS CREDENCAIS</Card.Title>
                                <Card.Subtitle>Informe email e senha</Card.Subtitle>
                            </div>
                            {error !== '' &&
                                <Alert variant="danger" dismissible >
                                    {error}
                                </Alert>
                            }

                            <form onSubmit={formik.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Email</label>
                                    <input name="email" value={formik.values.email} onChange={formik.handleChange} type="text" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Senha</label>
                                    <input name="password" value={formik.values.password} onChange={formik.handleChange} type="password" className="form-control" />
                                </div>
                                <div className="form-group mt-5">
                                    <button type="submit" className="btn bg-teal btn-block" disabled={!formik.isValid}>
                                        {loading ?
                                            <Spinner animation="border" size="sm" />
                                            :
                                            <span>FAZER LOGIN</span>
                                        }
                                    </button>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button onClick={handlerLoginWithGoogle} style={{ flex: 1 }} className="btn btn-outline-danger mr-1">
                                        <i className="fab fa-google"></i> Google</button>
                                    <button onClick={handlerLoginWithFacebook} style={{ flex: 1 }} className="btn btn-outline-info ml-1">
                                        <i className="fab fa-facebook-f"></i> Facebook</button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Fragment>
    )
}