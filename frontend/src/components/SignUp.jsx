import axios from 'axios';
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
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

const renderErrors = (errors, touched, id) => {
    if (errors[id] && touched[id]) {
        document.getElementById(id).classList.add('is-invalid');
        return <div placement="right" className="invalid-tooltip">{errors[id]}</div>
    }
    if (document.getElementById(id)) {
        document.getElementById(id).classList.remove('is-invalid');
    }
    return null;
};

const SignUp = () => {
    const [regFailed, setRegFailed] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

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

                                    <Formik
                                        initialValues={{
                                            username: '',
                                            password: '',
                                            confirmPassword: '',
                                        }}
                                        validationSchema={SignupSchema}
                                        onSubmit={async (values) => {
                                            setRegFailed(false);
                                            try {
                                                const res = await axios.post('/api/v1/signup', values);
                                                localStorage.setItem('userId', JSON.stringify(res.data));
                                                auth.logIn();
                                                navigate('/');
                                            } catch (err) {
                                                setRegFailed(true);
                                                throw err;
                                            }
                                        }}
                                    >
                                        {({ errors, touched }) => (
                                            <Form className="w-50">
                                                <h1 className="text-center mb-4">Регистрация</h1>
                                                <div className="form-floating mb-3">
                                                    <Field
                                                        placeholder="От 3 до 20 символов"
                                                        name="username"
                                                        autoComplete="username"
                                                        id="username"
                                                        className="form-control" />
                                                    <label className="form-label" htmlFor="username">Имя пользователя</label>
                                                    {renderErrors(errors, touched, 'username')}
                                                </div>
                                                <div className="form-floating mb-3">
                                                    <Field
                                                        placeholder="Не менее 6 символов"
                                                        name="password"
                                                        aria-describedby="passwordHelpBlock"
                                                        autoComplete="new-password"
                                                        type="password"
                                                        id="password"
                                                        className="form-control" />
                                                    {renderErrors(errors, touched, 'password')}
                                                    {regFailed ? <div placement="right" className="invalid-tooltip">Такой пользователь уже существует</div> : null}
                                                    <label className="form-label" htmlFor="password">Пароль</label>
                                                </div>
                                                <div className="form-floating mb-4">
                                                    <Field
                                                        placeholder="Пароли должны совпадать"
                                                        name="confirmPassword"
                                                        autoComplete="new-password"
                                                        type="password"
                                                        id="confirmPassword"
                                                        className="form-control" />
                                                    {renderErrors(errors, touched, 'confirmPassword')}
                                                    <label className="form-label" htmlFor="confirmPassword">Подтвердите пароль</label>
                                                </div>
                                                <button type="submit" className="w-100 btn btn-outline-primary">Зарегистрироваться</button>
                                            </Form>
                                        )}
                                    </Formik>
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