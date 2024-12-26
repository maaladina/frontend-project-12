import axios from 'axios';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../hooks/index.jsx';
import signup from '../images/signUp.jpg';
import routes from '../routes.js';

const SignUp = () => {
  const [regFailed, setRegFailed] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('errors.required'))
      .min(3, t('errors.length'))
      .max(20, t('errors.length')),
    password: Yup.string()
      .min(6, t('errors.minLength'))
      .required(t('errors.required')),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], t('errors.confirmPassword')),
  });

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
        const res = await axios.post(routes.signUpPath(), values);
        const user = res.data;
        auth.logIn(user);
        navigate(routes.chatPagePath());
      } catch (e) {
        console.log(e);
        if (!e.isAxiosError) {
          toast.error(t('toast.unknownError'));
          return;
        }
        if (e.isAxiosError && e.response.status === 409) {
          toast.error(t('toast.authorizeError'));
          setRegFailed(true);
          return;
        }
        toast.error(t('toast.networkError'));
        throw e;
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
                  <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                    <div>
                      <img src={signup} className="rounded-circle" alt={t('signUp.title')} />
                    </div>

                    <Form onSubmit={formik.handleSubmit} className="w-50">
                      <h1 className="text-center mb-4">{t('signUp.title')}</h1>
                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          type="text"
                          placeholder={t('signUp.name')}
                          name="username"
                          autoComplete="username"
                          id="username"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.username}
                          isInvalid={formik.touched.username
                                                    && (!!formik.errors.username || regFailed)}
                        />
                        <Form.Label htmlFor="username">{t('signUp.name')}</Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="form-floating mb-3">
                        <Form.Control
                          placeholder={t('signUp.password')}
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
                        <Form.Label htmlFor="password">{t('signUp.password')}</Form.Label>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="form-floating mb-4">
                        <Form.Control
                          placeholder={t('signUp.confirmPassword')}
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
                        <Form.Label htmlFor="confirmPassword">{t('signUp.confirmPassword')}</Form.Label>
                        {regFailed
                          ? (
                            <Form.Control.Feedback type="invalid">
                              {t('errors.exist')}
                            </Form.Control.Feedback>
                          )

                          : (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.confirmPassword}
                            </Form.Control.Feedback>
                          )}

                      </Form.Group>

                      <button type="submit" className="w-100 btn btn-outline-primary" disabled={formik.isSubmitting}>{t('signUp.submit')}</button>
                    </Form>

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

export default SignUp;
