import React from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { hideModal } from '../../slices/modalSlice';
import routes from '../../routes';
import useAuth from '../../hooks';

const RemoveChannel = ({ item }) => {
  const dispatch = useDispatch();
  const auth = useAuth();

  const { t } = useTranslation();

  const handleRemove = async () => {
    try {
      const { id } = item;
      await axios.delete(routes.channelPath(id), { headers: auth.getAuthHeader() });
      dispatch(hideModal());
      toast.success(t('toast.removeChannel'));
    } catch (e) {
      console.log(e);
      if (!e.isAxiosError) {
        toast.error(t('toast.unknownError'));
        return;
      }
      if (e.isAxiosError && e.response.status === 401) {
        toast.error(t('toast.authorizeError'));
        return;
      }
      toast.error(t('toast.networkError'));
      throw e;
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
