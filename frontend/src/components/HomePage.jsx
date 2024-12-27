import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Header from './Header';
import { setChannels } from '../slices/channelsSlice.js';
import { setMessages } from '../slices/messagesSlice.js';
import Channels from './Channels.jsx';
import AddChannel from './modals/AddChannel.jsx';
import RemoveChannel from './modals/RemoveChannel.jsx';
import RenameChannel from './modals/RenameChannel.jsx';
import routes from '../routes.js';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../hooks/index.jsx';
import Messages from './Messages.jsx';

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
  const activeChannelId = useSelector((state) => state.channels.activeChannelId);
  const messages = useSelector((state) => state.messages.messages);
  const activeMessages = [];
  messages.forEach((message) => {
    if (message.channelId === activeChannelId) {
      activeMessages.push(message);
    }
  });
  const dispatch = useDispatch();
  const auth = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const getChannels = async () => {
      try {
        const newData = await axios.get(routes.channelsPath(), { headers: auth.getAuthHeader() });
        const newChannels = newData.data;
        dispatch(setChannels({ newChannels }));
        const newData2 = await axios.get(routes.messagesPath(), { headers: auth.getAuthHeader() });
        const newMessages = newData2.data;
        dispatch(setMessages({ newMessages }));
      } catch (e) {
        console.log(e);
        if (!e.isAxiosError) {
          toast.error(t('toast.unknownError'));
          return;
        }
        if (e.isAxiosError && e.response.status === 401) {
          auth.logOut();
          toast.error(t('toast.authorizeError'));
          return;
        }
        toast.error(t('toast.networkError'));
        throw e;
      }
    };
    getChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <Header />
            <div className="container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row">
                <Channels />
                <Messages />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default HomePage;
