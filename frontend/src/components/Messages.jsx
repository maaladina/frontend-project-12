import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SendMessage from './SendMessage';

const Messages = () => {
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
  const { t } = useTranslation();
  return (
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
        <SendMessage />
      </div>
    </div>
  );
};

export default Messages;
