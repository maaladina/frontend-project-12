import React from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { hideModal } from '../../slices/modalSlice';
import routes from '../../routes';
import showToast from '../toast';
import useAuth from '../../hooks';

const RemoveChannel = ({ item }) => {
  const dispatch = useDispatch();
  const auth = useAuth();

  const { t } = useTranslation();

  const handleRemove = async () => {
    try {
      const { id } = item;
      const res = await axios.delete(routes.channelPath(id), { headers: auth.getAuthHeader() });
      if (res.status === 200) {
        dispatch(hideModal());
        showToast('success', t('toast.removeChannel'));
      }
    } catch (e) {
      showToast('error', t('toast.networkError'));
    }
  };

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
  );
};

export default RemoveChannel;
