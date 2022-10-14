
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import "./main.css"
import 'antd/dist/antd.css';
import SignInPage from './pages/SignInPage';
import MainHeader from './components/MainHeader';
import HomePage from './pages/Home';
import UserList from './pages/UserList';
import NotificacionTest from './test/Notification'
import SignUpPage from './pages/SignUpPage';
import {Auth} from "shopit-shared";
require('dotenv').config();

Auth.endpoint = process.env.REACT_APP_SERVER_URL ?? "";
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage showHeader={true} />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/testNotifiacion" element={<NotificacionTest/>} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>
);
reportWebVitals();
