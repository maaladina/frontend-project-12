import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useLocation,
} from 'react-router-dom';
import NotFound from './components/NotFound';
import Login from './components/Login';
import HomePage from './components/HomePage.jsx';
import SignUp from './components/SignUp.jsx';
import './App.css';
import useAuth from './hooks/index.jsx';

const PrivateRoute = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();

    return (
        auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
    );
};

function App() {
    document.documentElement.classList.add('h-100');
    document.getElementById('root').classList.add('h-100');
    document.body.classList.add('h-100');
    document.body.classList.add('bg-light');
    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={(
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    )}
                />
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </Router>
    );
}

export default App;