/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, Fragment, useState, useContext, useEffect } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import './Login.scss'
import { AuthContext } from 'src/contexts/AuthContext';
import Axios from 'axios';
import { useHistory } from 'react-router';


export const Login: FC = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, logout } = useContext(AuthContext);

    const { push } = useHistory();

    useEffect( () => {
        logout();
    }, []) 


    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validateOnBlur: true,
        onSubmit: async (values) => {
            setLoading(true)
            setError('')

            try {
                const { email, password } = values;
                const { data } = await Axios.post("auth/login", { email, password })

                if(data.token) {
                    login(data.token)
                    push("/dashboard")
                }


            } catch (error) {
                setError(JSON.stringify(error))
            }

            setLoading(false)
           
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Email inválido').required('Campo Obrigaório'),
            password: Yup.string().min(4, 'Senha curta').required('Campo de senha obrigatório')
        })

    })

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

                            <form autoComplete="off" onSubmit={formik.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Email</label>
                                    <input
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        type="email"
                                        autoComplete="off"
                                        className="form-control bg-light" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Senha</label>
                                    <input
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        type="password"
                                        autoComplete="off"
                                        className="form-control bg-light" />
                                </div>
                                <div className="form-group mt-5">
                                    <button type="submit" className="btn btn-dark bg-green btn-block"
                                        disabled={!formik.isValid}>
                                        {loading ?
                                            <Spinner animation="border" size="sm" />
                                            :
                                            <span>FAZER LOGIN</span>
                                        }
                                    </button>
                                </div>

                            </form>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Fragment>
    )
}