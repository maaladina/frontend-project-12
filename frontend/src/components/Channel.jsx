import React from 'react';
import { useDispatch } from 'react-redux';
import { addChannel, setActiveChannelId } from '../slices/channelsSlice.js';
import classNames from 'classnames';
import { Dropdown, DropdownButton, Button, ButtonGroup } from 'react-bootstrap';
import { showModal } from '../slices/modalSlice.js';
import { useTranslation } from 'react-i18next';

const Channel = ({ channel, activeChannelId }) => {
    const dispatch = useDispatch();
    const buttonCLass = classNames({
        'btn': true,
        'w-100': true,
        'rounded-0': true,
        'text-start': true,
        'text-truncate': true,
        'btn-secondary': channel.id == activeChannelId
    }
    )

    const { t } = useTranslation();

    const handleClick = (e) => {
        const activeChannelId = e.target.id;
        dispatch(setActiveChannelId({ activeChannelId }));
    }

    if (channel.removable) {
        return (
            <li className="nav-item w-100">
                <Dropdown className="w-100 d-flex show" as={ButtonGroup}>
                    <button type="button" className={buttonCLass} id={channel.id} onClick={handleClick}>
                        <span className="me-1"># </span>{channel.name}
                    </button>
                    <DropdownButton variant={channel.id == activeChannelId ? 'secondary rounded-0' : 'light rounded-0'}
                        title="">
                        <span className="visually-hidden">{t('chat.edit')}</span>
                        <Dropdown.Item onClick={() => dispatch(showModal({ type: 'removing', item: channel }))}>{t('chat.remove')}</Dropdown.Item>
                        <Dropdown.Item onClick={() => dispatch(showModal({ type: 'renaming', item: channel }))}>{t('chat.rename')}</Dropdown.Item>
                    </DropdownButton>
                </Dropdown>
            </li>
        )
    }
    return (
        <li className="nav-item w-100">
            <button type="button" className={buttonCLass} id={channel.id} onClick={handleClick}>
                <span className="me-1">#</span>
                {channel.name}
            </button>
        </li>
    )
}

export default Channel;