import React from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import {
  Dropdown, DropdownButton, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { showModal } from '../slices/modalSlice.js';
import { setActiveChannelId } from '../slices/channelsSlice.js';

const Channel = ({ channel, activeChannelId }) => {
  const dispatch = useDispatch();
  const buttonCLass = classNames({
    btn: true,
    'w-100': true,
    'rounded-0': true,
    'text-start': true,
    'text-truncate': true,
    'btn-secondary': channel.id === activeChannelId,
  });

  const { t } = useTranslation();

  const handleClick = (e) => {
    dispatch(setActiveChannelId({ activeChannelId: e.target.id }));
  };

  if (channel.removable) {
    return (
      <li className="nav-item w-100">
        <Dropdown className="w-100 d-flex show" as={ButtonGroup}>
          <button type="button" className={buttonCLass} id={channel.id} onClick={handleClick}>
            <span className="me-1"># </span>
            {channel.name}
          </button>
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
      <button type="button" className={buttonCLass} id={channel.id} onClick={handleClick}>
        <span className="me-1">#</span>
        {channel.name}
      </button>
    </li>
  );
};

export default Channel;
