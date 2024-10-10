import React from "react";
import useAuth from '../hooks/index.jsx';
import { Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';

const AuthButton = () => {
    const auth = useAuth();
    const location = useLocation();
    return (
        auth.loggedIn
            ? <Button onClick={auth.logOut} className="btn btn-primary">Выйти</Button>
            : <Button as={Link} to="/login" state={{ from: location }} className="btn btn-primary">Войти</Button>
    );
};

const Header = () => {
    return (
        <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
                <a className="navbar-brand" href="/">Hexlet Chat</a>
                <AuthButton />
            </div>
        </nav>
    )
};

export default Header;
