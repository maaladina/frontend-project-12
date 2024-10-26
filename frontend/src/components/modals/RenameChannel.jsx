import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useFormik } from 'formik';
import { Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { hideModal } from "../../slices/modalSlice";
import { renameChannel } from "../../slices/channelsSlice";

const RenameChannel = ({ item }) => {
    const dispatch = useDispatch();
    const inputRef = useRef();
    const [renameFailed, setRenameFailed] = useState(false);
    const channels = useSelector((state) => state.channels.channels);
    const token = useSelector((state) => state.auth.token);
    const channelNames = [];
    channels.forEach((channel) => channelNames.push(channel.name));

    useEffect(() => {
        inputRef.current.select();
    }, []);

    const renameChannelSchema = Yup.object().shape({
        name: Yup.string()
            .required('Обязательное поле')
            .min(3, 'От 3 до 20 символов')
            .max(20, 'От 3 до 20 символов')
            .notOneOf(channelNames, 'Должно быть уникальным'),
    });

    const formik = useFormik({
        initialValues: {
            name: item.name,
        },
        validationSchema: renameChannelSchema,
        onSubmit: async (values) => {
            console.log(item)
            setRenameFailed(false)
            try {
                const editedChannel = values;
                const res = await axios.patch(`/api/v1/channels/${item.id}`, editedChannel, { headers: { Authorization: `Bearer ${token}` } });
                dispatch(renameChannel({ id: item.id, name: values.name }));
                dispatch(hideModal());
            } catch (e) {
                setRenameFailed(true);
                console.log(e);
            }
        }

    })

    return (
        <Modal show onHide={() => dispatch(hideModal())} centered>
            <Modal.Header closeButton>
                <Modal.Title>Переименовать канал</Modal.Title>
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
                        <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.name}
                        </Form.Control.Feedback>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="me-2 btn btn-secondary" onClick={() => dispatch(hideModal())}>Отменить</button>
                            <button type="submit" className="btn btn-primary">Отправить</button>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
};

export default RenameChannel;