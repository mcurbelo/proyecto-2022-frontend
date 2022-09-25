import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './pages/SignInPage';

import "./main.css"
import 'antd/dist/antd.css';
import SignInPage from './pages/SignInPage';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<>Todo</>} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);
reportWebVitals();
