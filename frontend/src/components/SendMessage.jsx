import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import filter from 'leo-profanity';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const SendMessage = () => {
  const [sendFailed, setSendFailed] = useState(false);
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const auth = useAuth();
  const { username } = auth.user;
  const inputRef = useRef();
  const { t } = useTranslation();
  useEffect(() => inputRef.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async (values) => {
      setSendFailed(false);
      try {
        const newMessage = {
          body: filter.clean(values.body),
          channelId: activeChannelId,
          username,
        };
        await axios.post(routes.messagesPath(), newMessage, { headers: auth.getAuthHeader() });
        formik.values.body = '';
        inputRef.current.select();
      } catch (e) {
        setSendFailed(true);
        console.log(e);
        toast.error(t('toast.networkError'));
      }
    },
  });
  return (
    <div className="mt-auto px-5 py-3">
      <Form noValidate="" className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
        <Form.Group className="input-group has-validation">
          <Form.Control
            type="text"
            onChange={formik.handleChange}
            name="body"
            aria-label={t('chat.newMessage')}
            placeholder={t('chat.enterMessage')}
            className="border-0 p-0 ps-2 form-control"
            ref={inputRef}
            isInvalid={sendFailed}
            value={formik.values.body}
          />
          <Button type="submit" disabled={!formik.isValid && !formik.isSubmitting} className="btn btn-group-vertical">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
            </svg>
            <span className="visually-hidden">{t('chat.submit')}</span>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default SendMessage;
