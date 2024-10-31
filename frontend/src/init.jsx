import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import App from './App';
import resources from './locales/index.js';
import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useLocation,
} from 'react-router-dom';
import './App.css';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';
import { Provider } from 'react-redux';
import store from './slices/index.js';
import { io } from 'socket.io-client'

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