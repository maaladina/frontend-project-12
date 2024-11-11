import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Dropdown, ButtonGroup, Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { showModal } from '../slices/modalSlice.js';
import { setActiveChannelId } from '../slices/channelsSlice.js';

const Channel = ({ channel, activeChannelId }) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleClick = (e) => {
    dispatch(setActiveChannelId({ activeChannelId: e.target.id }));
  };

  if (channel.removable) {
    return (
      <li className="nav-item w-100">
        <Dropdown className="d-flex show" as={ButtonGroup}>
          <Button
            variant={channel.id === activeChannelId ? 'secondary' : ''}
            className="w-100 rounded-0 text-start text-truncate"
            id={channel.id}
            onClick={handleClick}
          >
            <span className="me-1"># </span>
            {channel.name}
          </Button>
          <Dropdown.Toggle variant={channel.id === activeChannelId ? 'secondary' : 'light'} className="flex-grow-0 dropdown-toggle-split">
            <span className="visually-hidden">{t('chat.edit')}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => dispatch(showModal({ type: 'removing', item: channel }))}>{t('chat.remove')}</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(showModal({ type: 'renaming', item: channel }))}>{t('chat.rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  }
  return (
    <li className="nav-item w-100">
      <Button
        variant={channel.id === activeChannelId ? 'secondary' : ''}
        className="w-100 rounded-0 text-start text-truncate"
        id={channel.id}
        onClick={handleClick}
      >
        <span className="me-1">#</span>
        {channel.name}
      </Button>
    </li>
  );
};

export default Channel;
