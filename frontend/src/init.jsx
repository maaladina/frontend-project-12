import i18next from 'i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import React, { useState, useMemo } from 'react';
import { io } from 'socket.io-client';
import filter from 'leo-profanity';
import { Provider } from 'react-redux';
import App from './App';
import resources from './locales/index.js';
import AuthContext from './contexts/index.jsx';
import store from './slices/index.js';
import { addMessage } from './slices/messagesSlice.js';
import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice.js';

const AuthProvider = ({ children }) => {
  const userData = localStorage.getItem('userId') ? JSON.parse(localStorage.getItem('userId')) : undefined;
  const [user, setUser] = useState(userData);

  const logIn = (newUser) => {
    localStorage.setItem('userId', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setUser(undefined);
  };

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }
    return {};
  };

  const contextValue = useMemo(() => ({
    user, logIn, logOut, getAuthHeader,
  }), [user]);

  return (
    <AuthContext.Provider value={contextValue}>
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

  filter.clearList();
  filter.add(filter.getDictionary('en'));
  filter.add(filter.getDictionary('fr'));
  filter.add(filter.getDictionary('ru'));

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  };

  const { dispatch } = store;
  const socket = io();
  socket.on('newMessage', (arg) => {
    dispatch(addMessage({ newMessage: arg }));
  });
  socket.on('newChannel', (arg) => {
    dispatch(addChannel({ newChannel: arg }));
  });
  socket.on('removeChannel', (arg) => {
    dispatch(removeChannel({ channel: arg }));
  });
  socket.on('renameChannel', (arg) => {
    dispatch(renameChannel({ id: arg.id, name: arg.name }));
  });

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
