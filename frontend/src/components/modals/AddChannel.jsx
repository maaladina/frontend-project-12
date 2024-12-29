import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { toast } from 'react-toastify';
import { hideModal } from '../../slices/modalSlice';
import { setActiveChannelId } from '../../slices/channelsSlice';
import useAuth from '../../hooks';
import routes from '../../routes';

const AddChannel = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const inputRef = useRef();
  const [addFailed, setAddFailed] = useState(false);
  const channels = useSelector((state) => state.channels.channels);
  const channelNames = [];
  channels.forEach((channel) => channelNames.push(channel.name));
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const addChannelSchema = Yup.object().shape({
    name: Yup.string()
      .required(t('errors.required'))
      .min(3, t('errors.length'))
      .max(20, t('errors.length'))
      .notOneOf(channelNames, t('errors.notUnique')),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: addChannelSchema,
    onSubmit: async (values) => {
      setAddFailed(false);
      try {
        const newChannel = { name: filter.clean(values.name) };
        if (channelNames.includes(newChannel.name)) {
          return;
        }
        const res = await axios.post(
          routes.channelsPath(),
          newChannel,
          { headers: auth.getAuthHeader() },
        );
        const newChannelRes = res.data;
        dispatch(setActiveChannelId({ activeChannelId: newChannelRes.id }));
        dispatch(hideModal());
        toast.success(t('toast.addChannel'));
      } catch (e) {
        console.log(e);
        setAddFailed(true);
        if (!e.isAxiosError) {
          toast.error(t('toast.unknownError'));
          return;
        }
        if (e.isAxiosError && e.response.status === 401) {
          toast.error(t('toast.authorizeError'));
          inputRef.current.select();
          return;
        }
        toast.error(t('toast.networkError'));
        throw e;
      }
    },

  });

  return (
    <Modal show onHide={() => dispatch(hideModal())} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
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
                                && (!!formik.errors.name || addFailed)}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <button type="button" className="me-2 btn btn-secondary" onClick={() => dispatch(hideModal())}>{t('modals.cancel')}</button>
              <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>{t('modals.send')}</button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
