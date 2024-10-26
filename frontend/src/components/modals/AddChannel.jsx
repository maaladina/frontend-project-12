import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useFormik } from 'formik';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { hideModal } from "../../slices/modalSlice";
import { addChannel, setActiveChannelId } from "../../slices/channelsSlice";


const AddChannel = () => {
    const dispatch = useDispatch();
    const inputRef = useRef();
    const [addFailed, setAddFailed] = useState(false);
    const channels = useSelector((state) => state.channels.channels);
    const token = useSelector((state) => state.auth.token);
    const channelNames = [];
    channels.forEach((channel) => channelNames.push(channel.name))

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const addChannelSchema = Yup.object().shape({
        name: Yup.string()
            .required('Обязательное поле')
            .min(3, 'От 3 до 20 символов')
            .max(20, 'От 3 до 20 символов')
            .notOneOf(channelNames, 'Должно быть уникальным'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: addChannelSchema,
        onSubmit: async (values) => {
            setAddFailed(false)
            try {
                const newChannel = values;
                const res = await axios.post('/api/v1/channels', newChannel, { headers: { Authorization: `Bearer ${token}` } });
                const newChannelRes = res.data;
                dispatch(addChannel({ newChannel: newChannelRes }));
                dispatch(setActiveChannelId({ activeChannelId: newChannelRes.id }));
                dispatch(hideModal())
            } catch (e) {
                setAddFailed(true);
                console.log(e);
            }
        }

    })

    return (
        <Modal show onHide={() => dispatch(hideModal())} centered>
            <Modal.Header closeButton>
                <Modal.Title>Добавить канал</Modal.Title>
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

export default AddChannel;