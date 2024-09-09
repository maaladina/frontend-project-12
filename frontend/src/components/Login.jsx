import React from 'react';
import { Formik, Form, Field } from 'formik';
import login from '../images/hexletImage.jpg';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Обязательное поле'),
    password: Yup.string().min(6, 'Минимум 6 букв').required('Обязательное поле'),
});

const renderErrors = (errors, touched, id) => {
    if (errors[id] && touched[id]) {
        document.getElementById(id).classList.add('is-invalid');
        return <div className="text-danger">{errors[id]}</div>
    }
    if (document.getElementById(id)) {
        document.getElementById(id).classList.remove('is-invalid');
    }
    return null;
};

const Login = () => {
    return (
        <div className="h-100">
            <div className="h-100" id="chat">
                <div className="d-flex flex-column h-100">
                    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                        <div className="container">
                            <a className="navbar-brand" href="/">Hexlet Chat</a>
                            <button type="button" className="btn btn-primary">Выйти</button>
                        </div>
                    </nav>
                    <div className="container-fluid h-100">
                        <div className="row justify-content-center align-content-center h-100">
                            <div className="col-12 col-md-8 col-xxl-6">
                                <div className="card shadow-sm">
                                    <div className="card-body row p-5">
                                        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                                            <img src={login} className="rounded-circle" alt="Войти" />
                                        </div>

                                        <Formik
                                            initialValues={{ username: '', password: '' }}
                                            validationSchema={LoginSchema}
                                            onSubmit={(values) => {
                                                console.log(values);
                                            }}
                                        >
                                            {({ errors, touched }) => (
                                                <Form className="col-12 col-md-6 mt-3 mt-md-0">
                                                    <h1 className="text-center mb-4">Войти</h1>
                                                    <div className="form-floating mb-3">

                                                        <Field
                                                            type="username"
                                                            name="username"
                                                            autoComplete="username"
                                                            placeholder="Ваш ник"
                                                            id="username"
                                                            className="form-control" />
                                                        {renderErrors(errors, touched, 'username')}
                                                        <label htmlFor="username">Ваш ник</label>
                                                    </div>
                                                    <div className="form-floating mb-4">
                                                        <Field
                                                            name="password"
                                                            autoComplete="current-password"
                                                            placeholder="Пароль"
                                                            type="password"
                                                            id="password"
                                                            className="form-control" />
                                                        {renderErrors(errors, touched, 'password')}
                                                        <label className="form-label" htmlFor="password">Пароль</label>
                                                    </div>
                                                    <button type="submit" className="w-100 mb-3 btn btn-outline-primary">
                                                        Войти
                                                    </button>
                                                </Form>
                                            )}
                                        </Formik>

                                    </div>
                                    <div className="card-footer p-4">
                                        <div className="text-center"><span>Нет аккаунта?</span> <a href="/signup">Регистрация</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Toastify"></div>
            </div >
        </div >
    )
};

export default Login;