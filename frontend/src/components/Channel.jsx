import React from 'react';
import { useDispatch } from 'react-redux';
import { setActiveChannelId } from '../slices/channelsSlice.js';
import classNames from 'classnames';

const Channel = ({ channel, activeChannelId }) => {
    const dispatch = useDispatch();
    const buttonCLass = classNames({
        'btn': true,
        'w-100': true,
        'rounded-0': true,
        'text-start': true,
        'btn-secondary': channel.id == activeChannelId
    }
    )

    const handleClick = (e) => {
        const activeChannelId = e.target.id;
        dispatch(setActiveChannelId({ activeChannelId }));
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