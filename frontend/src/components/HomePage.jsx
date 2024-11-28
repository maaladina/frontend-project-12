/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import filter from 'leo-profanity';
import Header from './Header';
import { setChannels } from '../slices/channelsSlice.js';
import { setMessages } from '../slices/messagesSlice.js';
import Channels from './Channels.jsx';
import AddChannel from './modals/AddChannel.jsx';
import RemoveChannel from './modals/RemoveChannel.jsx';
import RenameChannel from './modals/RenameChannel.jsx';
import routes from '../routes.js';
import 'react-toastify/dist/ReactToastify.css';
import showToast from './toast.js';
import useAuth from '../hooks/index.jsx';

const Modal = () => {
  const modalType = useSelector((state) => state.modal.type);
  const item = useSelector((state) => state.modal.currentChannel);
  if (modalType === 'adding') {
    return <AddChannel />;
  } if (modalType === 'removing') {
    return <RemoveChannel item={item} />;
  } if (modalType === 'renaming') {
    return <RenameChannel item={item} />;
  }
  return null;
};

const HomePage = () => {
  const [sendFailed, setSendFailed] = useState(false);
  const channels = useSelector((state) => state.channels.channels);
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const activeChannel = channels.find((channel) => channel.id === activeChannelId);
  const messages = useSelector((state) => state.messages.messages);
  const activeMessages = [];
  messages.forEach((message) => {
    if (message.channelId === activeChannelId) {
      activeMessages.push(message);
    }
  });
  const dispatch = useDispatch();
  const auth = useAuth();
  const username = auth.user.username;
  const inputRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    const getChannels = async () => {
      const newData = await axios.get(routes.channelsPath(), { headers: auth.getAuthHeader() });
      const newChannels = newData.data;
      dispatch(setChannels({ newChannels }));
      const newData2 = await axios.get(routes.messagesPath(), { headers: auth.getAuthHeader() });
      const newMessages = newData2.data;
      dispatch(setMessages({ newMessages }));
      inputRef.current.focus();
    };
    getChannels();
  }, []);

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
        showToast('error', t('toast.networkError'));
      }
    },
  });

  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <Header />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <Channels />
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100">
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b>
                          #
                          {activeChannel ? activeChannel.name : null}
                        </b>
                      </p>
                      <span className="text-muted">{t('chat.messagesCounter', { count: activeMessages.length })}</span>
                    </div>
                    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                      {activeMessages.map((message) => (
                        <div className="text-break mb-2" key={message.id}>
                          <b>{message.username}</b>
                          :
                          {' '}
                          {message.body}
                        </div>
                      ))}

                    </div>
                    <div className="mt-auto px-5 py-3">
                      <Form noValidate="" className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
                        <Form.Group className="input-group has-validation">
                          <Form.Control
                            type="text"
                            onChange={formik.handleChange}
                            name="body"
                            aria-label="Новое сообщение"
                            placeholder="Введите сообщение..."
                            className="border-0 p-0 ps-2 form-control"
                            ref={inputRef}
                            isInvalid={sendFailed}
                            value={formik.values.body}
                          />
                          <Button type="submit" disabled="" className="btn btn-group-vertical">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                              <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z" />
                            </svg>
                            <span className="visually-hidden">{t('chat.submit')}</span>
                          </Button>
                        </Form.Group>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Toastify">
            <ToastContainer />
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomePage;
