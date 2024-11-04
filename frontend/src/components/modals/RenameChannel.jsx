import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { hideModal } from "../../slices/modalSlice";
import { renameChannel } from "../../slices/channelsSlice";
import { useTranslation } from 'react-i18next';
import showToast from "../toast";
import filter from 'leo-profanity';

const RenameChannel = ({ item }) => {
    const dispatch = useDispatch();
    const inputRef = useRef();
    const [renameFailed, setRenameFailed] = useState(false);
    const channels = useSelector((state) => state.channels.channels);
    const token = useSelector((state) => state.auth.token);
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
            setRenameFailed(false)
            try {
                const editedChannel = { name: filter.clean(values.name) };
                if (channelNames.includes(editedChannel.name)) {
                    return;
                }
                const res = await axios.patch(`/api/v1/channels/${item.id}`, editedChannel, { headers: { Authorization: `Bearer ${token}` } });
                if (res.status == 200) {
                    dispatch(renameChannel({ id: item.id, name: editedChannel.name }));
                    dispatch(hideModal());
                    showToast('success', t('toast.renameChannel'))
                }
            } catch (e) {
                setRenameFailed(true);
                console.log(e);
                showToast('error', t('toast.networkError'));
            }
        }

    })

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
    )
};

export default RenameChannel;