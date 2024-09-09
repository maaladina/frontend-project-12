import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './components/NotFound';
import Login from './components/Login';
import './App.css';


function App() {
    document.documentElement.classList.add('h-100');
    document.getElementById('root').classList.add('h-100');
    document.body.classList.add('h-100');
    document.body.classList.add('bg-light');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;