import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import NotFound from './components/NotFound';
import Login from './components/Login';
import HomePage from './components/HomePage.jsx';
import SignUp from './components/SignUp.jsx';
import useAuth from './hooks/index.jsx';
import routes from './routes.js';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.user ? children : <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route
        path={routes.chatPagePath()}
        element={(
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        )}
      />
      <Route path={routes.otherPagesPath()} element={<NotFound />} />
      <Route path={routes.loginPagePath()} element={<Login />} />
      <Route path={routes.signupPagePath()} element={<SignUp />} />
    </Routes>
  </Router>
);

export default App;
