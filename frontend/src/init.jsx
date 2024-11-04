import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './App';
import resources from './locales/index.js';
import React, { useState } from 'react';
import './App.css';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import { io } from 'socket.io-client'
import { addMessage } from './slices/messagesSlice.js';
import { addChannel, removeChannel } from './slices/channelsSlice.js';
import filter from 'leo-profanity';

const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem('userId'));

    const logIn = () => setLoggedIn(true);
    const logOut = () => {
        localStorage.removeItem('userId');
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

const init = async () => {
    const i18n = i18next.createInstance();

    await i18n
        .use(initReactI18next)
        .init({
            resources,
            fallbackLng: 'ru',
        });

    filter.clearList()
    filter.add(filter.getDictionary('en'))
    filter.add(filter.getDictionary('fr'))
    filter.add(filter.getDictionary('ru'))

    const { dispatch } = store;
    const socket = io();
    socket.on('newMessage', (...args) => {
        args.forEach((arg) => {
            dispatch(addMessage({ newMessage: arg }))
        });
    });
    socket.on('newChannel', (...args) => {
        args.forEach((arg) => {
            dispatch(addChannel({ newChannel: arg }))
        });
    });
    socket.on('removeChannel', (...args) => {
        args.forEach((arg) => {
            dispatch(removeChannel({ channel: arg }))
        });
    });


    return (

        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </Provider>
        </I18nextProvider>
    );
};

export default init;