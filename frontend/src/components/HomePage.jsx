import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux';
import { setChannels, addChannel } from '../slices/channelsSlice.js';
import { setMessages, addMessage } from '../slices/messagesSlice.js';
import Channel from './Channel.jsx';
import AddChannel from './modals/AddChannel.jsx';
import RemoveChannel from './modals/RemoveChannel.jsx';
import RenameChannel from './modals/RenameChannel.jsx';
import routes from '../routes.js';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { showModal } from '../slices/modalSlice.js';

const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (userId && userId.token) {
        return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
};

const socket = io();

const HomePage = () => {
    const [sendFailed, setSendFailed] = useState(false);
    const channels = useSelector((state) => state.channels.channels);
    const activeChannelId = useSelector((state) => state.channels.activeChannelId);
    const activeChannel = channels.find((channel) => channel.id == activeChannelId);
    const messages = useSelector((state) => state.messages.messages);
    const username = useSelector((state) => state.auth.username);
    const modalType = useSelector((state) => state.modal.type);
    const item = useSelector((state) => state.modal.currentChannel);
    const activeMessages = [];
    messages.forEach((message) => {
        if (message.channelId == activeChannelId) {
            activeMessages.push(message);
        }
    })
    const dispatch = useDispatch();
    const inputRef = useRef();
    const { t } = useTranslation();

    const renderModal = () => {
        if (!modalType) {
            return null
        } else if (modalType == 'adding') {
            return <AddChannel />
        } else if (modalType == 'removing') {
            return <RemoveChannel item={item} />
        } else if (modalType == 'renaming') {
            return <RenameChannel item={item} />
        }
    }

    useEffect(() => {
        const getChannels = async () => {
            const newData = await axios.get(routes.channelsPath(), { headers: getAuthHeader() });
            const newChannels = newData.data;
            dispatch(setChannels({ newChannels }));
            const newData2 = await axios.get(routes.messagesPath(), { headers: getAuthHeader() })
            const newMessages = newData2.data;
            dispatch(setMessages({ newMessages }));
            inputRef.current.focus();
        }
        getChannels();
    }, []);

    useEffect(() => {
        socket.on("newMessage", (...args) => {
            args.forEach((arg) => {
                dispatch(addMessage({ newMessage: arg }))
            });
        });
        return () => {
            socket.off('newMessage');
        };
    }, [dispatch])


    const handleAdd = (e) => {
        e.preventDefault();
        dispatch(showModal({ type: 'adding', item: null }));
    }

    const formik = useFormik({
        initialValues: {
            body: '',
        },
        onSubmit: async (values) => {
            setSendFailed(false);
            try {
                const newMessage = { body: values.body, channelId: activeChannelId, username };
                const res = await axios.post(routes.messagesPath(), newMessage, { headers: getAuthHeader() });
                // dispatch(addMessage({ newMessage: res.data }));
                formik.values.body = '';
                inputRef.current.select();
            } catch (e) {
                setSendFailed(true);
                console.log(e);
            }
        }
    })

    return (
        <>
            <div className="h-100">
                <div className="h-100" id="chat">
                    <div className="d-flex flex-column h-100">
                        <Header />
                        <div className="container h-100 my-4 overflow-hidden rounded shadow">
                            <div className="row h-100 bg-white flex-md-row">
                                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                                    <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                                        <b>{t('chat.channels')}</b>
                                        <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleAdd}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
                                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
                                            </svg>
                                            <span className="visually-hidden">+</span>
                                        </button>
                                    </div>
                                    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
                                        {channels ? channels.map((channel) => {
                                            return <Channel channel={channel} activeChannelId={activeChannelId} key={channel.id} />
                                        }) : null}
                                    </ul>
                                </div>
                                <div className="col p-0 h-100">
                                    <div className="d-flex flex-column h-100">
                                        <div className="bg-light mb-4 p-3 shadow-sm small">
                                            <p className="m-0"><b># {activeChannel ? activeChannel.name : null}</b></p>
                                            <span className="text-muted">{t('chat.messagesCounter', { count: activeMessages.length })}</span>
                                        </div>
                                        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                                            {activeMessages.map((message) => <div className="text-break mb-2" key={message.id}><b>{message.username}</b>: {message.body}</div>)}

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
                                                        value={formik.values.body} />
                                                    <Button type="submit" disabled="" className="btn btn-group-vertical">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
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
                    </div>
                </div>
            </div>
            {renderModal()}
        </>
    )
};

export default HomePage;