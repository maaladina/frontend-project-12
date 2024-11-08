import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} className="btn btn-primary">{t('header.logOut')}</Button>
      : <Button as={Link} to="/login" state={{ from: location }} className="btn btn-primary">{t('login.submit')}</Button>
  );
};

const Header = () => {
  const { t } = useTranslation();
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{t('header.title')}</a>
        <AuthButton />
      </div>
    </nav>
  );
};

export default Header;
