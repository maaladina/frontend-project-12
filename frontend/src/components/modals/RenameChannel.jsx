import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { hideModal } from '../../slices/modalSlice';
import showToast from '../toast';
import useAuth from '../../hooks';
import routes from '../../routes';

const RenameChannel = ({ item }) => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const inputRef = useRef();
  const [renameFailed, setRenameFailed] = useState(false);
  const channels = useSelector((state) => state.channels.channels);
  const channelNames = [];
  channels.forEach((channel) => channelNames.push(channel.name));
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const renameChannelSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('errors.required'))
      .min(3, t('errors.length'))
      .max(20, t('errors.length'))
      .notOneOf(channelNames, t('errors.notUnique')),
  });

  const formik = useFormik({
    initialValues: {
      name: item.name,
    },
    validationSchema: renameChannelSchema,
    onSubmit: async (values) => {
      setRenameFailed(false);
      try {
        const editedChannel = { name: filter.clean(values.name) };
        if (channelNames.includes(editedChannel.name)) {
          return;
        }
        const res = await axios.patch(
          routes.channelPath(item.id),
          editedChannel,
          { headers: auth.getAuthHeader() },
        );
        if (res.status === 200) {
          dispatch(hideModal());
          showToast('success', t('toast.renameChannel'));
        }
      } catch (e) {
        console.log(e);
        setRenameFailed(true);
        if (!e.isAxiosError) {
          showToast('error', t('toast.unknownError'));
          return;
        }
        if (e.isAxiosError && e.response.status === 401) {
          showToast('error', t('toast.authorizeError'));
          inputRef.current.select();
          return;
        }
        showToast('error', t('toast.networkError'));
        throw e;
      }
    },

  });

  return (
    <Modal show onHide={() => dispatch(hideModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="" onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              id="name"
              className="mb-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              ref={inputRef}
              isInvalid={formik.touched.name
                                && (!!formik.errors.name || renameFailed)}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <button type="button" className="me-2 btn btn-secondary" onClick={() => dispatch(hideModal())}>{t('modals.cancel')}</button>
              <button type="submit" className="btn btn-primary">{t('modals.send')}</button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
