import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels } from '../slices/channelsSlice.js';
import { setMessages } from '../slices/messagesSlice.js';
import Channel from './Channel.jsx';

const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (userId && userId.token) {
        return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
};

const HomePage = () => {
    const channels = useSelector((state) => state.channels.channels);
    const activeChannelId = useSelector((state) => state.channels.activeChannelId);
    const activeChannel = channels.find((channel) => channel.id == activeChannelId);
    const messages = useSelector((state) => state.messages.messages);
    const activeMessages = [];
    messages.forEach((message) => {
        if (message.channelId == activeChannelId) {
            activeMessages.push(message);
        }
    })
    const dispatch = useDispatch();

    useEffect(() => {
        const getChannels = async () => {
            const newData = await axios.get('/api/v1/channels', { headers: getAuthHeader() });
            const newChannels = newData.data;
            dispatch(setChannels({ newChannels }));
            const newData2 = await axios.get('/api/v1/messages', { headers: getAuthHeader() })
            const newMessages = newData2.data;
            dispatch(setMessages({ newMessages }));
        }
        getChannels();
    }, []);

    return (
        <div className="h-100">
            <div className="h-100" id="chat">
                <div className="d-flex flex-column h-100">
                    <Header />
                    <div className="container h-100 my-4 overflow-hidden rounded shadow">
                        <div className="row h-100 bg-white flex-md-row">
                            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
                                <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                                    <b>Каналы</b>
                                    <button type="button" className="p-0 text-primary btn btn-group-vertical">
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
                                        <span className="text-muted">{activeMessages.length} сообщений</span>
                                    </div>
                                    <div id="messages-box" className="chat-messages overflow-auto px-5 ">
                                        {activeMessages.map((message) => <div className="text-break mb-2"><b>{message.username}</b>: {message.body}</div>)}

                                    </div>
                                    <div className="mt-auto px-5 py-3">
                                        <form noValidate="" className="py-1 border rounded-2">
                                            <div className="input-group has-validation">
                                                <input name="body" aria-label="Новое сообщение" placeholder="Введите сообщение..." className="border-0 p-0 ps-2 form-control" value="" />
                                                <button type="submit" disabled="" className="btn btn-group-vertical">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"></path>
                                                    </svg>
                                                    <span className="visually-hidden">Отправить</span>
                                                </button>
                                            </div>
                                        </form>
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
    )
};

export default HomePage;