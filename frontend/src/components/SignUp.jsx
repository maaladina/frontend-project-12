import axios from 'axios';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import signup from '../images/signUp.jpg';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
    username: Yup.string()
        .required('Обязательное поле')
        .min(3, 'От 3 до 20 символов')
        .max(20, 'От 3 до 20 символов'),
    password: Yup.string()
        .min(6, 'Минимум 6 букв')
        .required('Обязательное поле'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
});

const SignUp = () => {
    const [regFailed, setRegFailed] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: SignupSchema,
        onSubmit: async (values) => {
            setRegFailed(false);
            try {
                const res = await axios.post('/api/v1/signup', values);
                localStorage.setItem('userId', JSON.stringify(res.data));
                auth.logIn();
                navigate('/');
            } catch (e) {
                if (e.response.status === 409) {
                    setRegFailed(true);
                }
                console.log(e);
            }
        }
    })

    return (
        <div className="h-100">
            <div className="h-100" id="chat">
                <div className="d-flex flex-column h-100">
                    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                        <div className="container">
                            <a className="navbar-brand" href="/">Hexlet Chat</a>
                        </div>
                    </nav>
                    <div className="container-fluid h-100">
                        <div className="row justify-content-center align-content-center h-100">
                            <div className="col-12 col-md-8 col-xxl-6"><div className="card shadow-sm">
                                <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                                    <div>
                                        <img src={signup} className="rounded-circle" alt="Регистрация" />
                                    </div>

                                    <Form onSubmit={formik.handleSubmit} className="w-50">
                                        <h1 className="text-center mb-4">Регистрация</h1>
                                        <Form.Group className="form-floating mb-3">
                                            <Form.Control
                                                type="text"
                                                placeholder="От 3 до 20 символов"
                                                name="username"
                                                autoComplete="username"
                                                id="username"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.username}
                                                isInvalid={formik.touched.username
                                                    && (!!formik.errors.username || regFailed)}
                                            />
                                            <Form.Label htmlFor="username">Имя пользователя</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="form-floating mb-3">
                                            <Form.Control
                                                placeholder="Не менее 6 символов"
                                                name="password"
                                                aria-describedby="passwordHelpBlock"
                                                autoComplete="new-password"
                                                type="password"
                                                id="password"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.password}
                                                isInvalid={formik.touched.password
                                                    && (!!formik.errors.password || regFailed)}
                                            />
                                            <Form.Label htmlFor="password">Пароль</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="form-floating mb-4">
                                            <Form.Control
                                                placeholder="Пароли должны совпадать"
                                                name="confirmPassword"
                                                autoComplete="new-password"
                                                type="password"
                                                id="confirmPassword"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.confirmPassword}
                                                isInvalid={formik.touched.confirmPassword
                                                    && (!!formik.errors.confirmPassword || regFailed)}
                                            />
                                            <Form.Label htmlFor="confirmPassword">Подтвердите пароль</Form.Label>
                                            {regFailed ?
                                                <Form.Control.Feedback type="invalid">
                                                    Такой пользователь уже существует
                                                </Form.Control.Feedback> :

                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.confirmPassword}
                                                </Form.Control.Feedback>
                                            }

                                        </Form.Group>

                                        <button type="submit" className="w-100 btn btn-outline-primary">Зарегистрироваться</button>
                                    </Form>

                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Toastify"></div>
            </div>
        </div>
    )
};

export default SignUp;