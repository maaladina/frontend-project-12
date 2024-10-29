import React from "react";
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { hideModal } from "../../slices/modalSlice";
import { removeChannel } from "../../slices/channelsSlice";
import routes from "../../routes";

const RemoveChannel = ({ item }) => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

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
                <Modal.Title>Удалить канал</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="lead">Уверены?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" className="me-2 btn btn-secondary" onClick={() => dispatch(hideModal())}>Отменить</Button>
                <Button type="button" className="btn btn-danger" onClick={handleRemove}>Удалить</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default RemoveChannel;