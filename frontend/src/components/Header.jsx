import React from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();
  return (
    auth.user
      ? <Button onClick={auth.logOut} className="btn btn-primary">{t('header.logOut')}</Button>
      : <Button as={Link} to={routes.loginPagePath} state={{ from: location }} className="btn btn-primary">{t('login.submit')}</Button>
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
