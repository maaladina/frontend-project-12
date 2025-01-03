import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';
import login from '../images/hexletImage.jpg';
import routes from '../routes.js';

const Login = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const { from } = location.state;
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.loginPath(), values);
        const user = res.data;
        auth.logIn(user);
        navigate(from);
      } catch (err) {
        console.log(err);
        if (!err.isAxiosError) {
          toast.error(t('toast.unknownError'));
          return;
        }
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          toast.error(t('toast.authorizeError'));
          inputRef.current.select();
          return;
        }
        toast.error(t('toast.networkError'));
        throw err;
      }
    },
  });

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href={routes.chatPagePath()}>{t('header.title')}</a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img src={login} className="rounded-circle" alt={t('login.title')} />
                    </div>

                    <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-md-0">
                      <h1 className="text-center mb-4">{t('login.title')}</h1>
                      <fieldset>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            placeholder={t('login.name')}
                            name="username"
                            id="username"
                            autoComplete="username"
                            isInvalid={authFailed}
                            required
                            ref={inputRef}
                          />
                          <Form.Label htmlFor="username">{t('login.name')}</Form.Label>
                        </Form.Group>
                        <Form.Group className="form-floating mb-3">
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder={t('login.password')}
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            isInvalid={authFailed}
                            required
                          />
                          <Form.Label htmlFor="password">{t('login.password')}</Form.Label>
                          <Form.Control.Feedback type="invalid">{t('errors.incorrect')}</Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" className="w-100 mb-3 btn btn-outline-primary" disabled={formik.isSubmitting} variant="outline-primary">{t('login.submit')}</Button>
                      </fieldset>
                    </Form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{t('login.noAccount')}</span>
                      {' '}
                      <a href={routes.signupPagePath()}>{t('login.signUp')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
