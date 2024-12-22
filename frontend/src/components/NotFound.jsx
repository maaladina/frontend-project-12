import { useTranslation } from 'react-i18next';
import notFound from '../images/404.svg';
import Header from './Header';
import routes from '../routes';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <Header />
          <div className="text-center">
            <img alt={t('notFound.pageNotFound')} className="img-fluid h-25" src={notFound} />
            <h1 className="h4 text-muted">{t('notFound.pageNotFound')}</h1>
            <p className="text-muted">
              {t('notFound.butYouCan')}
              {' '}
              <a href={routes.chatPagePath()}>{t('notFound.mainPage')}</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
