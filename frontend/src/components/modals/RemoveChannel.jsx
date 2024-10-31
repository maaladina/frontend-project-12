import React from "react";
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { hideModal } from "../../slices/modalSlice";
import { removeChannel } from "../../slices/channelsSlice";
import routes from "../../routes";
import { useTranslation } from 'react-i18next';

const RemoveChannel = ({ item }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const { t } = useTranslation();

    const handleRemove = async () => {
        await axios.delete(routes.channelPath(item.id), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        dispatch(removeChannel({ channel: item }));
        dispatch(hideModal());
    }

    return (
        <Modal show onHide={() => dispatch(hideModal())} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="lead">{t('modals.sure')}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" className="me-2 btn btn-secondary" onClick={() => dispatch(hideModal())}>{t('modals.cancel')}</Button>
                <Button type="button" className="btn btn-danger" onClick={handleRemove}>{t('modals.delete')}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RemoveChannel;